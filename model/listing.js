const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "items",
        required : true
    },
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "sellers",
        required : true
    },

    // seller specific info
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    condition: {
        type: String,
        enum: ["new", "used", "refurbished"],
        default: "new"
    },
    status: {
        type: String,
        enum: ["active", "inactive", "out_of_stock"],
        default: "active"
    }

}, {timestamps : true});
listingSchema.index({ product: 1, seller: 1 }, { unique: true }); // this line says that across the whole listing , combination of seller and product should be unique

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
