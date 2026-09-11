const express = require('express');
const {
    homePage,
    signupPage,
    addressPage,
    loginPage
} = require('../controller/staticRoutesController')
const router = express.Router();

router.get('/', homePage);
router.get('/signup', signupPage);
router.get('/enterAddress/:userId', addressPage);
router.get('/login', loginPage);

module.exports = router;