const express = require('express');
const router = express.Router();
const {
    createUser,
    enterAddress,
    handleLogin,
    addToCart
} = require('../controller/dynamicController');
const userModel = require('../model/user');

router.post('/createUser', createUser);
router.post('/addressPage/:userId', enterAddress);
router.post('/login', handleLogin);
router.post('/cart/add', addToCart);

module.exports = router;
