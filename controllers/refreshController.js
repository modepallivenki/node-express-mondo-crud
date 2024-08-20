const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //unauthorised
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const userFound = await User.findOne({refreshToken: refreshToken}).exec();
    if (!userFound) return res.sendStatus(403); //forbidden
    const roles = Object.values(userFound.roles);
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=>{
            if(err || userFound.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {   
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            );
            res.json({ accessToken });
        }  
    );
        
}

module.exports = handleRefreshToken;