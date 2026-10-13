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
        const msg = err.code === 11000 ? "Email already registered" : "Something went wrong";
        return res.render('signup', { error: msg });
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
        return res.render('address', { userId, error: "Something went wrong, please try again" });
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

async function addToCart(req, res){
    const {listingID} = req.body;
    try{
        const listing = await Listing.findById(listingID);
        if(!listing || listing.status !== 'active' || listing.stock < 1){
            return res.status(400).json({error : 'Item unavailable'});
        }

        const dbUser = await User.findById(req.user._id);
        const existingProduct = dbUser.cart.find(item => item.listing.toString() === listingID);

        if(existingProduct){
            if(existingProduct.quantity >= listing.stock){
                return res.status(400).json({error : 'Stock if finished'});
            }

            existingProduct.quantity += 1;
        }else{
            dbUser.cart.push({listing : listingID, quantity : 1});
        }
        await dbUser.save();
        return res.json({cartCount : dbUser.cart.length});

    }catch(err){
        console.log(err);
        return res.status(500).json({error : 'Something went wrong'});
    }
}

// Now since the listing only stores the reference id of the product in the form of string , so to fetch the actual product in items collection you need to write .populate , same logic for seller. From seller we fetch the storeName and rating , limit(20) caps the query to return only atmax 20 documents so that it does not causes delay in the system while fetching. We will pair it with .skip later and move to page 1, 2 etc

module.exports = {
    createUser,
    enterAddress,
    handleLogin,
    homePage,
    profilePage,
    addToCart
}