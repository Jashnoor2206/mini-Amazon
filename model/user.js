const mongoose = require('mongoose');
const  userSchema = new mongoose.Schema({
    // personal details
    name : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        lowercase : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    contact : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 10
    },

    // address 
    addresses: [
        {
          label: { type: String, default: "Home" }, // "Home", "Work", etc.
          street: String,
          city: String,
          state: String,
          postalCode: String,
          country: { type: String, default: "India" },
          isDefault: { type: Boolean, default: false }
        }
    ],

    // cart
    cart: [
        {
          listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1
          }
        }
    ],

    // why not use ref : "listing" ? Because wishlist is a casual browsing , we are not committed to buying the item yet , we just want to add it in wishlist indicating its possible future purchase . Thats why it is referenced to product not listing 
    wishlist: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        }
    ],

    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        default: "buyer"
    },
    
      // Account status
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "suspended", "banned"],
        default: "active"
    }

}, {timestamps : true});

const user = mongoose.model("users", userSchema);
module.exports = user;