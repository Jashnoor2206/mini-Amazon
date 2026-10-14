const express = require('express');
const router = express.Router();
const {requireLoginApi} = require('../middleware/auth');
const {
    createUser,
    enterAddress,
    handleLogin,
    addToCart,
    addToWishlist,
    increaseQuantity,
    decreaseQuantity,
    removeItem
} = require('../controller/dynamicController');
const userModel = require('../model/user');

router.post('/createUser', createUser);
router.post('/addressPage/:userId', enterAddress);
router.post('/login', handleLogin);
router.post('/cart/add',requireLoginApi, addToCart);
router.post('/wishlist/add', requireLoginApi, addToWishlist);
router.patch('/cart/incrementQuantity',requireLoginApi, increaseQuantity);
router.patch('/cart/decrementQuantity', requireLoginApi, decreaseQuantity);
router.patch('/cart/removeItem', requireLoginApi, removeItem);

module.exports = router;
