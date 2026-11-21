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
    profilePhoto : {
        type : String,
        default : ""
    },

    // address 
    addresses: [
        {
          label: { type: String, default: "Home" }, // "Home", "Work", etc.
          street: { type: String, default: " "},
          city: { type: String, default: " "},
          state: { type: String, default: " "},
          postalCode: { type: String, default: " "},
          country: { type: String, default: "India" },
          isDefault: { type: Boolean, default: false }
        }
    ],

    // cart
    cart: [
        {
          listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "listing"
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
          ref: "items"
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
    },
    // password reset
    resetOtpHash:     { type: String,  default: null },  // bcrypt hash of the OTP, never the OTP itself
    resetOtpExpires:  { type: Date,    default: null },  // now + 10 minutes
    resetOtpAttempts: { type: Number,  default: 0 },     // wrong tries so far
    resetOtpSentAt:   { type: Date,    default: null },  // for the resend cooldown
    pendingEmail: { type: String, default: null, trim: true, lowercase: true}, // the new email that we will recieve 
    emailChangeStage: { type: String , enum : ['current', 'new', null], default : null},
    // which email the live code was sent to
    emailOtpHash : { type : String, default : null}, // bcrypt hash of the OTP
    emailOtpExpires : { type : Date, default : null }, // now + 10 minutes
    emailOtpAttempts : { type : Number, default : 0}, // wrong tries so far
    emailOtpSentAt : { type : Date, default : null} // for resend cooldown
}, {timestamps : true});


const user = mongoose.model("users", userSchema);
module.exports = user;