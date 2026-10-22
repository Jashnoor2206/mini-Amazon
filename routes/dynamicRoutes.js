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
    removeItem,
    removeFromWishlist
} = require('../controller/dynamicController');

router.post('/createUser', createUser);
router.post('/addressPage/:userId', enterAddress);
router.post('/login', handleLogin);
router.patch('/cart/add',requireLoginApi, addToCart);
router.patch('/cart/incrementQuantity',requireLoginApi, increaseQuantity);
router.patch('/cart/decrementQuantity', requireLoginApi, decreaseQuantity);
router.patch('/cart/removeItem', requireLoginApi, removeItem);
router.patch('/wishlist/add', requireLoginApi, addToWishlist);
router.patch('/wishlist/remove' , requireLoginApi, removeFromWishlist);

module.exports = router;
