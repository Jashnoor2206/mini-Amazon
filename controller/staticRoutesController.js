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
async function cartPage(req, res){
    const dbUser = await User.findById(req.user._id).populate({
        path: 'cart.listing',
        populate: [
            { path: 'product', select: 'name images' },
            { path: 'seller', select: 'storeName' }
        ]
    });

    const items = dbUser.cart.filter(item => item.listing); // skip deleted listings
    const total = items.reduce((sum, item) => sum + item.listing.price * item.quantity, 0);

    res.render('cart', { user: dbUser, items, total });
}
async function wishlistPage(req, res){

}

module.exports = {
    signupPage,
    addressPage,
    loginPage,
    cartPage,
    wishlistPage
}