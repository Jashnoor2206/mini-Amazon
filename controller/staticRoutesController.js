
function homePage(req, res){
    res.render('homePage');
}
function signupPage(req, res){
    res.render('signup');
}
function addressPage(req, res){
    res.render('address');
}

module.exports = {
    homePage,
    signupPage,
    addressPage
}