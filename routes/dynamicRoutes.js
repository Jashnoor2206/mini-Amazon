const express = require('express');
const router = express.Router();
const {
    createUser,
    enterAddress
} = require('../controller/dynamicController');
const userModel = require('../model/user');

router.post('/createUser', createUser);
router.post('/addressPage', enterAddress);

module.exports = router;
