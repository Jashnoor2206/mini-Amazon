const express = require('express');

function homePage(req, res){
    res.render('homePage');
}

module.exports = homePage;