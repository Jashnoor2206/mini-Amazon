const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;
if(!secret){
    throw new Error('SECRET is missing in .env file ');
} // adding a safeguard , if secret is missing it shows on terminal and stops the server

function setUser(user){
    const payload = {
        _id : user._id,
        email : user.email
    }
    console.log("User logged in");
    return jwt.sign(payload, secret);
}

function getUser(token){
    if(!token) return null;
    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser
}