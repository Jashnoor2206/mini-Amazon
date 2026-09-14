const user = require('../model/user');
const {setUser} = require('../services/auth');
const Listing = require('../model/listing');
const {getUser} = require('../services/auth');
const User = require('../model/user');

async function createUser(req, res){
    const{ name, email, password, contact } = req.body;
    let newUser;
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
    const token = setUser(newUser);
    res.cookie("uuid", token);
    return res.redirect(`/amazon-clone/enterAddress/${newUser._id}`);
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
        return res.render('address', { error: "Something went wrong, please try again" });
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
    const token = setUser(existingUser);
    res.cookie("uuid", token);
    return res.redirect('/amazon-clone');
}

async function profilePage(req, res){
    let userPayload = null;
    let user = null;
    try{
        userPayload = getUser(req.cookies.uuid);
    }catch(err){
        userPayload = null;
    }
    if(userPayload){
        user = await User.findById(userPayload._id);
    }
    res.render('profile', {user : user});
}

async function homePage(req, res){
    try{
        const listings = await Listing.find({status : "active"})
            .populate("product")
            .populate("seller", "storeName rating")
            .limit(20);

        let userPayload = null;
        try{
            userPayload = getUser(req.cookies.uuid);
        }catch(err){
            userPayload = null;
        }
        
        let user = null;
        if(userPayload){
            user = await User.findById(userPayload._id);
        }
        res.render('homePage', {listings, user: user});
    }catch(err){
        console.log(err);
        res.status(500).send('Something wrong happened while loading homePage')
    }
}

// Now since the listing only stores the reference id of the product in the form of string , so to fetch the actual product in items collection you need to write .populate , same logic for seller. From seller we fetch the storeName and rating , limit(20) caps the query to return only atmax 20 documents so that it does not causes delay in the system while fetching. We will pair it with .skip later and move to page 1, 2 etc

module.exports = {
    createUser,
    enterAddress,
    handleLogin,
    homePage,
    profilePage
}