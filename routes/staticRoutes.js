const express = require('express');
const {restrictToLoggedInUser} = require('../middleware/auth')
const {
    signupPage,
    addressPage,
    loginPage,
    addressListPage,
    cartPage,
    wishlistPage,
    checkoutPage,
    productPage,
    editProfile,
    forgotPassword,
    verifyOtp,
    resetPasswordPage,
    orderConfirmationPage,
    getOrders
} = require('../controller/staticRoutesController')
const {
    homePage,
    profilePage
} = require('../controller/dynamicController');
const product = require('../model/product');
const router = express.Router();



// ==================== Home page (view: homePage.ejs) ====================
router.get('/', homePage);



// ==================== Signup and Login (signup page is served by the React app; view: login.ejs) ====================
router.get('/signup', signupPage);
router.get('/login', loginPage);



// ==================== Forgot password flow (views: forgotPassword.ejs, verifyOtp.ejs, resetPassword.ejs) ====================
router.get('/forgot-password', forgotPassword);
router.get('/verify-otp', verifyOtp);
router.get('/reset-password', resetPasswordPage);



// ==================== Addresses (views: address.ejs, addressList.ejs) ====================
router.get('/enterAddress',restrictToLoggedInUser, addressPage);
router.get('/addresses', restrictToLoggedInUser, addressListPage);



// ==================== Profile (views: profile.ejs, editProfile.ejs) ====================
router.get('/profile', restrictToLoggedInUser, profilePage);
router.get('/profile/edit' ,restrictToLoggedInUser, editProfile);



// ==================== Product page (view: product.ejs) ====================
router.get('/product/:listingId', productPage);



// ==================== Cart (view: cart.ejs) ====================
router.get('/cart', restrictToLoggedInUser, cartPage);



// ==================== Wishlist (view: wishlist.ejs) ====================
router.get('/wishlist', restrictToLoggedInUser, wishlistPage);



// ==================== Checkout (view: checkout.ejs) ====================
router.get('/checkout', restrictToLoggedInUser, checkoutPage);



// ==================== Orders (views: orderConfirmation.ejs, myOrders.ejs) ====================
router.get('/order/:orderID', restrictToLoggedInUser, orderConfirmationPage);
router.get('/orders', restrictToLoggedInUser, getOrders);



module.exports = router;