const {getUser} = require('../services/auth');

async function restrictToLoggedInUser(req, res, next){
    try{
        const userUid = req.cookies.uuid;
        if(!userUid) return res.redirect('/amazon-clone/login');
        const user = getUser(userUid);
        if(!user) return res.redirect('/amazon-clone/login');
        req.user = user;
        next();
    }catch(err){
        return res.redirect('/amazon-clone/login');
    }
}

module.exports = {
    restrictToLoggedInUser
};