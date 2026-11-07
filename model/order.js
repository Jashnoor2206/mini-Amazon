const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // readable unique id shown to the customer, e.g. "OD1762542000000-4821"
    orderID: {
        type: String,
        required: true,
        unique: true
    },

    // who placed the order (lets us list orders on the profile later)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    // customer details copied at the time of ordering
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },

    // a copy of the address, not a reference: if the user deletes the address later, the order still keeps it
    shippingAddress: {
        label: { type: String, default: "Home" },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: "India" }
    },

    // products in the order, with the price frozen at the time of ordering
    items: [
        {
            listing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "listing",
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "items",
                required: true
            },
            name: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    paymentMethod: {
        type: String,
        enum: ["COD"],
        default: "COD"
    },

    status: {
        type: String,
        enum: ["placed", "shipped", "delivered", "cancelled"],
        default: "placed"
    }

}, { timestamps: true });

// generates something like "OD1762542000000-4821"
orderSchema.statics.generateOrderID = function () {
    return "OD" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);
};

const order = mongoose.model("orders", orderSchema);
module.exports = order;
