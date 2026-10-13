const Listing = require('../model/listing');
const User = require('../model/user');
const {getUser} = require('../services/auth');
const path = require('path');
require('../model/product');
require('../model/seller');


function signupPage(req, res){
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
}
function addressPage(req, res){
    const {userId} = req.params;
    res.render('address', {userId});
}
function loginPage(req, res){
    res.render('login');
}
function cart(req, res){

}
function wishlist(req, res){
    
}

module.exports = {
    signupPage,
    addressPage,
    loginPage
}