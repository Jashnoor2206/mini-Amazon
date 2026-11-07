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

router.post('/createUser', createUser);
router.post('/addressPage/:userId', enterAddress);
router.post('/login', handleLogin);
router.post('/logout', loggingOut);
router.patch('/cart/add',requireLoginApi, addToCart);
router.patch('/cart/incrementQuantity',requireLoginApi, increaseQuantity);
router.patch('/cart/decrementQuantity', requireLoginApi, decreaseQuantity);
router.patch('/cart/removeItem', requireLoginApi, removeItem);
router.patch('/wishlist/add', requireLoginApi, addToWishlist);
router.patch('/wishlist/remove' , requireLoginApi, removeFromWishlist);
router.delete('/address/:addressId', requireLoginApi, removeAddress);
router.post('/forgot-password', handleForgotPassword);
router.post('/verify-otp', handleVerifyOtp);
router.post('/resend-otp', handleResendOtp);
router.post('/reset-password', resetPassword);
router.post('/placeOrder', restrictToLoggedInUser, placeOrder);

module.exports = router;
