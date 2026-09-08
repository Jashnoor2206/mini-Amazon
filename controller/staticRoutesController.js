const Listing = require('../model/listing');
require('../model/product');
require('../model/seller');

async function homePage(req, res){
    try{
        const listings = await Listing.find({status : "active"})
            .populate("product")
            .populate("seller", "storeName rating")
            .limit(20);
        
        res.render('homePage', {listings});
    }catch(err){
        console.log(err);
        res.status(500).send('Something wrong happened while loading homePage')
    }
}

// Now since the listing only stores the reference id of the product in the form of string , so to fetch the actual product in items collection you need to write .populate , same logic for seller. From seller we fetch the storeName and rating , limit(20) caps the query to return only atmax 20 documents so that it does not causes delay in the system while fetching. We will pair it with .skip later and move to page 1, 2 etc

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