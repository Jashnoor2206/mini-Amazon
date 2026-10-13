const express = require('express');
const {restrictToLoggedInUser} = require('../middleware/auth')
const {
    signupPage,
    addressPage,
    loginPage,
    cartPage,
    wishlistPage
} = require('../controller/staticRoutesController')
const {
    homePage,
    profilePage
} = require('../controller/dynamicController');
const router = express.Router();

router.get('/', homePage);
router.get('/signup', signupPage);
router.get('/enterAddress/:userId', addressPage);
router.get('/login', loginPage);
router.get('/profile', restrictToLoggedInUser, profilePage);
router.get('/cart', restrictToLoggedInUser, cartPage);
router.get('/wishlist', restrictToLoggedInUser, wishlistPage);

module.exports = router;