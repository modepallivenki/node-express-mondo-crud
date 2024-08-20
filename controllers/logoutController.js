const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no content
    const refreshToken = cookies.jwt;
    // refreshToken in DB?
    const userFound = await User.findOne({refreshToken : refreshToken}).exec();
    if (!userFound){
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204); //no content
    }
    // erase refreshToken from DB and clear jwt cookie
    userFound.refreshToken = '';
    const result = await userFound.save();
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
}

module.exports = handleLogout;