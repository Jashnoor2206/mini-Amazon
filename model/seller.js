const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true // strip leading or trailing whitespaces
    },
    email : {
        type : String,
        unique : true,
        required : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        minlength : 6
    },
    contact : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 10
    },

    // store info

    storeName : {
        type : String,
        required : true,
        trim : true
    },
    gstNumber : {
        type : String,
        default : null
    },
    storeAdress : {
        street : {type : String , required : true},
        city : {type : String , required : true},
        stete : {type : String , required : true},
        postalCode : {type : String , required : true},
        country : {type : String , default : "India"}
    },

    // verification status

    isVerified:{
        type: Boolean,
        default: false
    },
    verificationDocs:[
        {
          type: { type: String }, // e.g. "PAN", "GST", "Aadhar"
          url: String
        }
    ],
    status:{
        type: String,
        enum: ["pending", "active", "suspended", "banned"],
        default: "pending"
    },

    // Relationship
    // we moved it to listings

    // Ratings
    rating : {
        type : Number,
        default : 0,
        min : 0,
        max : 5
    },
    totalRatings : {
        type : Number,
        default : 0
    },

    // Bank Details

    bankDetails : {
        accountHolderName : {type : String , required : true},
        bankName : {type : String , required : true},
        accountNumber : {type : String , required : true},
        ifscCode : {type : String, required : true}
    }
}, {timestamps : true});

const seller = mongoose.mondel("sellers", sellerSchema);
module.exports = seller;