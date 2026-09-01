
function homePage(req, res){
    res.render('homePage');
}
function signupPage(req, res){
    res.render('signup');
}
function addressPage(req, res){
    const {userId} = req.params;
    res.render('address', {userId});
}
function loginPage(req, res){
    res.render('login');
}

module.exports = {
    homePage,
    signupPage,
    addressPage,
    loginPage
}