const express = require('express');
const {
    homePage,
    signupPage,
    addressPage
} = require('../controller/staticRoutesController')
const router = express.Router();

router.get('/', homePage);
router.get('/signup', signupPage);
router.get('/enterAddress', addressPage);

module.exports = router;