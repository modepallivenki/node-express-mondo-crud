const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are mandatory!' });
    // check if duplicate user
    const duplicateUser = await User.findOne({ username: user }).exec();
    if (duplicateUser) return res.status(409).json({ 'message': 'User is already exists!' });
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create and save the new user in MongoDB
        const newUser = await User.create({ 
                            "username": user,
                            "password": hashedPwd
                         });
        
        console.log(newUser);
        res.status(201).json({'message': `User ${user} is created successfully!`});
    } catch (error) {
        res.status(500).json({ 'message': `Exception thrown ${error.message}` });
    }
}

module.exports = handleRegister;