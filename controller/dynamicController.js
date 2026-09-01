const user = require('../model/user');

async function createUser(req, res){
    const{ name, email, password, contact } = req.body;
    try{
        newUser = await user.create({
            name: name,
            email: email,
            password: password,
            contact: contact
        })
    }catch(err){
        console.log(err);
        return res.render('error');
    }

    return res.redirect('/user/enterAddress/${newUser._id}');
}

async function enterAddress(req, res){
    const { label, street, city , state, postalCode, country} = req.body;
    const { userId } = req.params;
    try{
        const loggedInUser = await user.findById(userId);
        loggedInUser.addresses.push({label, street, city, state, postalCode, country});
        await loggedInUser.save();
        return res.redirect('/amazon-clone');
    }catch(err){
        console.log(err);
        return res.render('addressPage', { error: "Something went wrong, please try again" });
    }
}

async function handleLogin(req, res){
    const {email, password} = req.body;
    const existingUser = await user.findOne({email, password});
    if(!existingUser){
        return res.render('login',{
            error: "Invalid Username or Password"
        });
    }
    return res.redirect('/amazon-clone');
}

module.exports = {
    createUser,
    enterAddress,
    handleLogin
}