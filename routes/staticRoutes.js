const express = require('express');
const {
    signupPage,
    addressPage,
    loginPage
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
router.get('/profile', profilePage);

module.exports = router;