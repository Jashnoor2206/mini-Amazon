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
    resetPasswordPage
} = require('../controller/staticRoutesController')
const {
    homePage,
    profilePage
} = require('../controller/dynamicController');
const product = require('../model/product');
const router = express.Router();

router.get('/', homePage);
router.get('/signup', signupPage);
router.get('/enterAddress/:userId', addressPage);
router.get('/login', loginPage);
router.get('/profile', restrictToLoggedInUser, profilePage);
router.get('/addresses', restrictToLoggedInUser, addressListPage);
router.get('/cart', restrictToLoggedInUser, cartPage);
router.get('/wishlist', restrictToLoggedInUser, wishlistPage);
router.get('/checkout', restrictToLoggedInUser, checkoutPage);
router.get('/product/:listingId', productPage);
router.get('/profile/edit' ,restrictToLoggedInUser, editProfile);
router.get('/forgot-password', forgotPassword);
router.get('/verify-otp', verifyOtp);
router.get('/reset-password', resetPasswordPage);

module.exports = router;