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

async function checkoutPage(req, res){
    try{
        const ids = (req.query.items || '').split(',').filter(Boolean); // turns string back into the array 
        if(ids.length === 0) return res.redirect('/amazon-clone/cart');

        const dbUser = await User.findById(req.user._id).populate({
            path: 'cart.listing',
            populate: [
                { path: 'product', select: 'name images' },
                { path: 'seller', select: 'storeName' }
            ]
        });
        
        const items = dbUser.cart.filter(item =>
            item.listing && ids.includes(item.listing._id.toString())
        );
        if(items.length === 0) return res.redirect('/amazon-clone/cart');

        const total = items.reduce((sum, item) => sum + item.listing.price * item.quantity, 0);

        res.render('checkout', { user: dbUser, items, total, addresses: dbUser.addresses });
    }catch(err){
        console.log(err);
        res.status(500).send('Something went wrong while loading checkout');
    }
}

async function wishlistPage(req, res){
    try{
        const dbUser = await User.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name images'
        });

        const products = dbUser.wishlist.filter(p => p); // skip deleted products

        // find purchasable listings for all wishlisted products in ONE query
        const listings = await Listing.find({
            product: { $in: products.map(p => p._id) },
            status: 'active',
            stock: { $gt: 0 }
        }).sort({ price: 1 }); // cheapest first

        // keep only the cheapest listing per product
        const listingByProduct = {};
        listings.forEach(l => {
            const key = l.product.toString();
            if(!listingByProduct[key]) listingByProduct[key] = l;
        });

        const items = products.map(p => ({
            product: p,
            listingId: listingByProduct[p._id.toString()]?._id || null
        }));

        res.render('wishlist', { user: dbUser, items });
    }catch(err){
        console.log(err);
        res.status(500).send('Something went wrong while loading wishlist');
    }
}

module.exports = {
    signupPage,
    addressPage,
    loginPage,
    cartPage,
    wishlistPage,
    checkoutPage
}