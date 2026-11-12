const express = require('express');
const router = express.Router();
const {requireLoginApi, restrictToLoggedInUser} = require('../middleware/auth');
const {
    createUser,
    enterAddress,
    handleLogin,
    addToCart,
    addToWishlist,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    removeFromWishlist,
    removeAddress,
    loggingOut,
    handleForgotPassword,
    resetPassword,
    handleVerifyOtp,
    handleResendOtp,
    placeOrder
} = require('../controller/dynamicController');



// ==================== Signup, Login and Logout (views: signup page, login.ejs, profile.ejs) ====================
router.post('/createUser', createUser);
router.post('/login', handleLogin);
router.post('/logout', loggingOut);



// ==================== Forgot password flow (views: forgotPassword.ejs, verifyOtp.ejs, resetPassword.ejs) ====================
router.post('/forgot-password', handleForgotPassword);
router.post('/verify-otp', handleVerifyOtp);
router.post('/resend-otp', handleResendOtp);
router.post('/reset-password', resetPassword);



// ==================== Addresses (views: address.ejs, addressList.ejs) ====================
router.post('/addressPage/:userId', enterAddress);
router.delete('/address/:addressId', requireLoginApi, removeAddress);



// ==================== Cart (view: cart.ejs; add to cart is also used on home, product and wishlist pages) ====================
router.patch('/cart/add',requireLoginApi, addToCart);
router.patch('/cart/incrementQuantity',requireLoginApi, increaseQuantity);
router.patch('/cart/decrementQuantity', requireLoginApi, decreaseQuantity);
router.patch('/cart/removeItem', requireLoginApi, removeItem);



// ==================== Wishlist (view: wishlist.ejs; also the heart buttons on home and product pages) ====================
router.patch('/wishlist/add', requireLoginApi, addToWishlist);
router.patch('/wishlist/remove' , requireLoginApi, removeFromWishlist);



// ==================== Checkout (view: checkout.ejs) ====================
router.post('/placeOrder', restrictToLoggedInUser, placeOrder);



module.exports = router;
