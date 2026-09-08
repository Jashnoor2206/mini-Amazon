// dummy for the time being 
const Listing = require('./model/listing');
const Product = require('./model/product');
const Seller = require('./model/seller');
const mongoose = require('mongoose');
const connectToMongoDB = require('./connect');


// for the time being we are creating dummy users and listings here to check and debug
async function seed(){
    connectToMongoDB();
    // delete previous listing
    await Product.deleteMany({});
    await Seller.deleteMany({});
    await Listing.deleteMany({});
}