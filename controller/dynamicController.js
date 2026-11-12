const user = require('../model/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {sendOTP} = require('../services/mailer');
const bcrypt = require('bcrypt');
const {setUser} = require('../services/auth');
const Listing = require('../model/listing');
const {getUser} = require('../services/auth');
const User = require('../model/user');
const Order = require('../model/order');
const MAX_ATTEMPTS = 5;
const MIN_PASSWORD_LEN = 6;
const BCRYPT_ROUNDS = 10;
const OTP_LIFETIME_MS = 10*60*1000; // otp lifetime of 10 minutes or 600000 milliseconds
const OTP_COOLDOWN_MS = 60*1000; // resend otp cooldown of 60 seconds or 60000 ms
// const Product = require('../model/product');

async function createUser(req, res){
    const{ name, email, password, contact } = req.body;
    if(!password || password.length < MIN_PASSWORD_LEN){
        return res.render('signup', {error : "Password must be atleast 6 characters long"});
        // returning after invalid password
    }
    let newUser;
    try{
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        newUser = await user.create({
            name: name,
            email: email,
            password: hashedPassword,
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
    // checkout mode sends the selected cart item ids along; keep only valid-looking ids
    const checkoutItems = (req.body.items || '').split(',').filter(id => /^[a-f0-9]{24}$/.test(id)).join(',');
    try{
        const loggedInUser = await user.findById(userId);
        loggedInUser.addresses.push({label, street, city, state, postalCode, country});
        await loggedInUser.save();
        if(req.body.from === 'addresses'){
            return res.redirect('/amazon-clone/addresses');
        }
        if(req.body.from === 'checkout' && checkoutItems){
            return res.redirect(`/amazon-clone/checkout?items=${checkoutItems}`); // back to the same checkout
        }
        return res.redirect('/amazon-clone');
    }catch(err){
        console.log(err);
        const from = ['addresses', 'checkout'].includes(req.body.from) ? req.body.from : '';
        return res.render('address', { userId, from, items: checkoutItems, error: "Something went wrong, please try again" });
    }
}

async function handleLogin(req, res){
    try{
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';
        if(!email || !password){
            return res.render('login', {
                error : 'Please enter a valid email or password'
            });
        }
        const existingUser = await user.findOne({ email: email });
        if(!existingUser){
            return res.render('login',{
                error: "Invalid Username or Password"
            });
        }
        const match = await bcrypt.compare(password, existingUser.password);
        if(!match){
            return res.render('login', {
                error : "Invalid Username or Password"
            });
        }
        const token = setUser(existingUser);
        res.cookie("uuid", token, {httpOnly : true});
        return res.redirect('/amazon-clone');
    }catch(err){
        console.log(err);
        res.render('login', {error : "Something went wrong"});
    }
}

async function handleForgotPassword(req, res){
    const email = (req.body.email || '').trim().toLowerCase();
    if(!email){
        return res.render('forgotPassword', { error: 'Please enter your email' });
    }
    try{
        const existingUser = await user.findOne({ email });
        // only send otp when user exists and either they have been never sent a code or last otp was sent 60s ago
        const canSend = existingUser &&
            (!existingUser.resetOtpSentAt || Date.now() - existingUser.resetOtpSentAt.getTime() > OTP_COOLDOWN_MS);

        if(canSend){
            const otp = crypto.randomInt(100000, 1000000).toString(); // always 6 digits
            existingUser.resetOtpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS); // saves hash value of otp
            existingUser.resetOtpExpires = new Date(Date.now() + OTP_LIFETIME_MS); // saves date of when otp will be expired
            existingUser.resetOtpAttempts = 0; // saves attempts
            existingUser.resetOtpSentAt = new Date(); // saves current date
            await existingUser.save(); // saves everything to database
            await sendOTP(email, otp, OTP_LIFETIME_MS / 60000); // sends otp
        }

        // next page needs to know which email the code was sent to , it puts email, stage: 'otp' and it is http only so javascript cannot read it , it will expire after 10 minutes as mentioned in the maxAge
        const token = jwt.sign(
            { email, stage: 'otp' }, 
            process.env.SECRET, { expiresIn: OTP_LIFETIME_MS / 1000 }
        );
        res.cookie('pwreset', token, { httpOnly: true, sameSite: 'lax', maxAge: OTP_LIFETIME_MS });
        return res.redirect('/amazon-clone/verify-otp');
    }catch(err){
        console.log(err);
        return res.render('forgotPassword', { error: 'Could not send the code, please try again', email });
    }
}

async function handleResendOtp(req, res){
    // 1. must still be on the OTP step
    let data;
    try{
        data = jwt.verify(req.cookies.pwreset, process.env.SECRET);
    }catch(err){
        return res.redirect('/amazon-clone/forgot-password');
    }
    if(data.stage !== 'otp' || !data.email){
        return res.redirect('/amazon-clone/forgot-password');
    }
    const email = data.email;

    try{
        const existingUser = await user.findOne({ email });

        // 2. same 60-second cooldown as /forgot-password
        const canSend = existingUser &&
            (!existingUser.resetOtpSentAt || Date.now() - existingUser.resetOtpSentAt.getTime() > OTP_COOLDOWN_MS);

        if(canSend){
            // 3. brand new code: replaces the old one and resets the attempt counter
            const otp = crypto.randomInt(100000, 1000000).toString();
            existingUser.resetOtpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);
            existingUser.resetOtpExpires = new Date(Date.now() + OTP_LIFETIME_MS);
            existingUser.resetOtpAttempts = 0;
            existingUser.resetOtpSentAt = new Date();
            await existingUser.save();
            await sendOTP(email, otp, OTP_LIFETIME_MS / 60000);
        }

        // 4. give the cookie a fresh 10 minutes to match the new code
        const token = jwt.sign({ email, stage: 'otp' }, process.env.SECRET, { expiresIn: OTP_LIFETIME_MS / 1000 });
        res.cookie('pwreset', token, { httpOnly: true, sameSite: 'lax', maxAge: OTP_LIFETIME_MS });

        // 5. one message for every case, so nothing is revealed
        return res.render('verifyOtp', {
            email,
            message: 'If this email is registered, a new code has been sent. You can request another after ' + (OTP_COOLDOWN_MS / 1000) + ' seconds.'
        });
    }catch(err){
        console.log(err);
        return res.render('verifyOtp', { email, error: 'Could not resend the code, please try again' });
    }
}

async function handleVerifyOtp(req, res){
    // 1. read the cookie set by /forgot-password
    let data;
    try{
        data = jwt.verify(req.cookies.pwreset, process.env.SECRET);
    }catch(err){
        return res.redirect('/amazon-clone/forgot-password');
    }
    if(data.stage !== 'otp' || !data.email){
        return res.redirect('/amazon-clone/forgot-password');
    }
    const email = data.email;
    const otp = (req.body.otp || '').trim();

    // 2. basic format check
    if(!/^\d{6}$/.test(otp)){
        return res.render('verifyOtp', { email, error: 'Please enter the 6-digit code' });
    }

    try{
        const existingUser = await user.findOne({ email });

        // 3. no user, no code, or code expired -> same generic message
        if(!existingUser || !existingUser.resetOtpHash ||
           !existingUser.resetOtpExpires || existingUser.resetOtpExpires < new Date()){
            return res.render('verifyOtp', { email, error: 'Code is invalid or has expired. Please request a new one.' });
        }

        // 4. too many wrong tries -> wipe the code
        if(existingUser.resetOtpAttempts >= MAX_ATTEMPTS){
            existingUser.resetOtpHash = null;
            existingUser.resetOtpExpires = null;
            await existingUser.save();
            return res.render('verifyOtp', { email, error: 'Too many attempts. Please request a new code.' });
        }

        // 5. compare with the saved hash
        const match = await bcrypt.compare(otp, existingUser.resetOtpHash);
        if(!match){
            existingUser.resetOtpAttempts += 1;
            await existingUser.save();
            const attemptsLeft = MAX_ATTEMPTS - existingUser.resetOtpAttempts;
            return res.render('verifyOtp', {
                email,
                error: attemptsLeft > 0 ? 'Incorrect code' : 'Too many attempts. Please request a new code.',
                attemptsLeft
            });
        }

        // 6. correct: make the code single-use
        existingUser.resetOtpHash = null;
        existingUser.resetOtpExpires = null;
        existingUser.resetOtpAttempts = 0;
        await existingUser.save();

        // 7. upgrade the cookie so /reset-password will open
        const token = jwt.sign({ userId: existingUser._id, stage: 'reset' }, process.env.SECRET, { expiresIn: OTP_LIFETIME_MS / 1000 });
        res.cookie('pwreset', token, { httpOnly: true, sameSite: 'lax', maxAge: OTP_LIFETIME_MS });
        return res.redirect('/amazon-clone/reset-password');
    }catch(err){
        console.log(err);
        return res.render('verifyOtp', { email, error: 'Something went wrong, please try again' });
    }
}
async function resetPassword(req, res){
    // 1. only allow users who passed the OTP step
    let data;
    try{
        data = jwt.verify(req.cookies.pwreset, process.env.SECRET);
    }catch(err){
        return res.redirect('/amazon-clone/forgot-password');
    }
    if(data.stage !== 'reset' || !data.userId){
        return res.redirect('/amazon-clone/forgot-password');
    }

    // 2. validate on the server too (browser checks can be bypassed)
    const { password, confirmPassword } = req.body;
    if(!password || password.length < MIN_PASSWORD_LEN){
        return res.render('resetPassword', { error: 'Password must be at least 6 characters long' });
    }
    if(password !== confirmPassword){
        return res.render('resetPassword', { error: 'Passwords do not match' });
    }

    try{
        const existingUser = await user.findById(data.userId);
        if(!existingUser){
            res.clearCookie('pwreset');
            return res.redirect('/amazon-clone/forgot-password');
        }

        // 3. save the new hashed password and wipe any leftover OTP data
        existingUser.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
        existingUser.resetOtpHash = null;
        existingUser.resetOtpExpires = null;
        existingUser.resetOtpAttempts = 0;
        await existingUser.save();

        // 4. end the reset flow and any old login on this browser
        res.clearCookie('pwreset');
        const loginToken = setUser(existingUser);              // same as handleLogin
        res.cookie('uuid', loginToken, { httpOnly: true });
        return res.redirect('/amazon-clone');
    }catch(err){
        console.log(err);
        return res.render('resetPassword', { error: 'Something went wrong, please try again' });
    }

}

function loggingOut(req, res){
    res.clearCookie("uuid", { httpOnly: true });
    return res.redirect('/amazon-clone/login');
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
        const wishlistIds = user ? user.wishlist.map(id => id.toString()) : [];
        res.render('homePage', {listings, user: user, wishlistIds});
    }catch(err){
        console.log(err);
        res.status(500).send('Something wrong happened while loading homePage')
    }
}

async function increaseQuantity(req, res){
    const {listingID} = req.body;
    try{
        const listing = await Listing.findById(listingID);
        const user = await User.findById(req.user._id);
        const product = user.cart.find(item => item.listing.toString() === listingID);

        if(product.quantity >= listing.stock){
            return res.status(400).json({error : 'No more stock available'});
        }
        product.quantity += 1;
        await user.save();
        return res.status(200).json({quantity : product.quantity, price : listing.price});
    }catch(err){
        console.log(err);
        return res.status(500).json({error : ' some unknown error occurred '});
    }

}
async function decreaseQuantity(req, res){
    const {listingID} = req.body;
    try{
        const listing = await Listing.findById(listingID);
        const user = await User.findById(req.user._id);
        const product = user.cart.find(item => item.listing.toString() === listingID);
        if(product.quantity === 1){
            user.cart = user.cart.filter(
                item => item.listing.toString() !== listingID
            ); // this keeps every item other than one that has same listing id, removing the listing product completely
            await user.save();
            return res.status(200).json({quantity : 0 , removed : true});
        }else{
            product.quantity -= 1;
        }

        await user.save();
        return res.status(200).json({quantity : product.quantity, price : listing.price});
    }catch(err){
        return res.status(500).json({error : 'some unexpected error occurred '});
    }
}

async function removeItem(req, res){
    const {listingID} = req.body;
    try{
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(
            item => item.listing.toString() !== listingID
        ); 
        await user.save();
        return res.status(200).json({removed : true});

    }catch(err){
        return res.status(500).json({message : 'some unexpected error occurred '});
    }
}

async function addToWishlist(req, res){
    const {listingId} = req.body;
    try{
        const listing = await Listing.findById(listingId);
        if(!listing) return res.status(400).json({error : 'Item not available'});

        const dbUser = await User.findById(req.user._id);

        const alreadyAdded = dbUser.wishlist.some(id => id.toString() === listing.product.toString());
        if(!alreadyAdded){
            dbUser.wishlist.push(listing.product);
            await dbUser.save();
        }
        return res.status(200).json({wishlisted : true});
    }catch(err){
        console.log(err);
        return res.status(500).json({error : 'Some unexpected error occurred'});
    }
}

async function removeFromWishlist(req, res){
    const {listingId, productId} = req.body;
    let prodID = productId;
    try{
        if(!prodID){
            const listing = await Listing.findById(listingId);
            if(!listing){
                return res.status(400).json({error : 'Item not available'});
            }
            prodID = listing.product.toString();
        }
        const dbUser = await User.findById(req.user._id);

        dbUser.wishlist = dbUser.wishlist.filter(id => id.toString() !== prodID);
        await dbUser.save();
        return res.status(200).json({wishlisted : false});
    }catch(err){
        console.log(err);
        return res.status(500).json({error : 'Some unexpected error occurred'});
    }
}


async function removeAddress(req, res){
    const {addressId} = req.params;
    try{
        const dbUser = await User.findById(req.user._id); // only ever the logged in user's own document
        const address = dbUser && dbUser.addresses.id(addressId);
        if(!address) return res.status(404).json({error : 'Address not found'});

        address.deleteOne();
        await dbUser.save();
        return res.status(200).json({removed : true});
    }catch(err){
        console.log(err);
        return res.status(500).json({error : 'Some unexpected error occurred'});
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
                return res.status(400).json({error : 'Stock is finished'});
            }

            existingProduct.quantity += 1;
        }else{
            dbUser.cart.push({listing : listingID, quantity : 1});
        }
        await dbUser.save();
        const quantity = existingProduct ? existingProduct.quantity : 1; // how many of this item are in the cart now
        return res.json({cartCount : dbUser.cart.length, quantity});

    }catch(err){
        console.log(err);
        return res.status(500).json({error : 'Something went wrong'});
    }
}

async function placeOrder(req, res){
    // reserved = listings whose stock we already reduced, so we can give it back if something fails later
    const reserved = [];
    const giveBackStock = () => Promise.all(
        reserved.map(r => Listing.updateOne({ _id: r.id }, { $inc: { stock: r.qty } }))
    );

    try{
        const ids = (req.body.items || '').split(',').filter(Boolean); // same comma list the checkout form sends
        const {addressId} = req.body;
        if(ids.length === 0) return res.redirect('/amazon-clone/cart');

        const dbUser = await User.findById(req.user._id).populate({
            path: 'cart.listing',
            populate: { path: 'product', select: 'name images' }
        });
        if(!dbUser) return res.redirect('/amazon-clone/login');

        // only order what is really in this user's cart (never trust ids/prices coming from the form)
        const cartItems = dbUser.cart.filter(item =>
            item.listing && ids.includes(item.listing._id.toString())
        );
        if(cartItems.length === 0) return res.redirect('/amazon-clone/cart');

        const address = dbUser.addresses.id(addressId); // only the user's own addresses can match
        if(!address) return res.status(400).send('Please choose a valid delivery address');

        // 1. check stock before touching anything
        for(const item of cartItems){
            const l = item.listing;
            if(l.status !== 'active' || l.stock < item.quantity){
                return res.status(400).send(`Sorry, only ${l.stock} left of ${l.product ? l.product.name : 'an item'}. Please update your cart.`);
            }
        }

        // 2. reduce stock. The {stock: {$gte: qty}} filter means the update only happens if enough stock
        //    is still there at this exact moment, so two buyers can never push stock below 0
        for(const item of cartItems){
            const result = await Listing.updateOne(
                { _id: item.listing._id, status: 'active', stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } } // $gte means greater than equal to
            );
            if(result.modifiedCount === 0){ // result is how many documents mongoDb changed , 0 means item sold out , went inactive or something else happened so in that case return back the stock
                await giveBackStock();
                return res.status(400).send('One of the items just went out of stock. Please check your cart again.');
            }
            reserved.push({ id: item.listing._id, qty: item.quantity }); // pushing in reserved array
        }

        // 3. snapshot the items with today's price
        const items = cartItems.map(item => ({
            listing: item.listing._id,
            product: item.listing.product._id,
            name: item.listing.product.name,
            image: item.listing.product.images && item.listing.product.images[0],
            price: item.listing.price,
            quantity: item.quantity
        }));
        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        let newOrder;
        try{
            newOrder = await Order.create({
                orderID: Order.generateOrderID(),
                user: dbUser._id,
                name: dbUser.name,
                email: dbUser.email,
                phone: dbUser.contact,
                shippingAddress: {
                    label: address.label,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    postalCode: address.postalCode,
                    country: address.country
                },
                items,
                totalAmount
            });
        }catch(err){
            await giveBackStock(); // order wasn't saved, so put the stock back
            throw err;
        }

        // 4. listings that just hit 0 stock are marked out of stock
        await Listing.updateMany(
            { _id: { $in: reserved.map(r => r.id) }, stock: 0 },
            { $set: { status: 'out_of_stock' } }
        );

        // 5. remove only the ordered items from the cart
        dbUser.cart = dbUser.cart.filter(item =>
            !(item.listing && ids.includes(item.listing._id.toString()))
        );
        await dbUser.save();

        return res.redirect(`/amazon-clone/order/${newOrder.orderID}`);
    }catch(err){
        console.log(err);
        return res.status(500).send('Something went wrong while placing your order');
    }
}

// Now since the listing only stores the reference id of the product in the form of string , so to fetch the actual product in items collection you need to write .populate , same logic for seller. From seller we fetch the storeName and rating , limit(20) caps the query to return only atmax 20 documents so that it does not causes delay in the system while fetching. We will pair it with .skip later and move to page 1, 2 etc

module.exports = {
    placeOrder,
    createUser,
    enterAddress,
    handleLogin,
    homePage,
    profilePage,
    addToCart,
    addToWishlist,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    removeFromWishlist,
    removeAddress,
    loggingOut,
    handleForgotPassword,
    resetPassword,
    handleVerifyOtp,
    handleResendOtp
}