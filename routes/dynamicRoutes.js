const express = require('express');
const router = express.Router();
const {
    createUser,
    enterAddress,
    handleLogin
} = require('../controller/dynamicController');
const userModel = require('../model/user');

router.post('/createUser', createUser);
router.post('/addressPage/:userId', enterAddress);
router.post('/login', handleLogin);

module.exports = router;
