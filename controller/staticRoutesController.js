const Listing = require('../model/listing');
const User = require('../model/user');
const {getUser} = require('../services/auth');
require('../model/product');
require('../model/seller');

function signupPage(req, res){
    res.render('signup');
}
function addressPage(req, res){
    const {userId} = req.params;
    res.render('address', {userId});
}
function loginPage(req, res){
    res.render('login');
}

module.exports = {
    signupPage,
    addressPage,
    loginPage
}