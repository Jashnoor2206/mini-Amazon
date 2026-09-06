const express = require('express');
const {restrictToLoggedInUser} = require('../middleware/auth');
const {
    homePage,
    signupPage,
    addressPage,
    loginPage
} = require('../controller/staticRoutesController')
const router = express.Router();

router.get('/',restrictToLoggedInUser, homePage);
router.get('/signup', signupPage);
router.get('/enterAddress/:userId', addressPage);
router.get('/login', loginPage);

module.exports = router;