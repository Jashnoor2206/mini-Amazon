const userModel = require('../model/user');

async function createUser(req, res){
    const{ name, email, password, contact } = req.body;
    try{
        newUser = await userModel.create({
            name: name,
            email: email,
            password: password,
            contact: contact
        })
    }catch(err){
        console.log(err);
        return res.render('error');
    }

    return res.redirect('/amazon-clone');
}

async function enterAddress(req, res){
    const { label, street, city , state, postalCode, country} = req.body;
    try{
        
    }catch(err){

    }
}

module.exports = {
    createUser,
    enterAddress
}