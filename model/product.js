const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subCategory: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
  
    // Media
    images: [
      {
        type: String 
      }
    ],
  
    specifications: {
      type: Map,
      of: String
    },
  
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
  
    isActive: {
      type: Boolean,
      default: true // lets admin delist a product from catalog without deleting it
    }
  
  }, { timestamps: true });
  
productSchema.index({ name: "text", description: "text" }); // this is mongodb's default seach engine , let's you search
const product = mongoose.model("items", productSchema)
module.exports = product;

// since product in different categories have different attributes , a map lets you store key and value pairs