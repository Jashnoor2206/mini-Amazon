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

    // Sellers
    const sellers = await Seller.insertMany([
        {
          name: "Rajesh Kumar",
          email: "rajesh@teststore.com",
          password: "test123",
          contact: "9876543210",
          storeName: "TechBazaar",
          storeAdress: { street: "MG Road", city: "Bengaluru", state: "Karnataka", postalCode: "560001" },
          status: "active",
          isVerified: true,
          bankDetails: { accountHolderName: "Rajesh Kumar", bankName: "SBI", accountNumber: "1234567890", ifscCode: "SBIN0001234" }
        },
        {
          name: "Priya Sharma",
          email: "priya@gadgetworld.com",
          password: "test123",
          contact: "9876500000",
          storeName: "GadgetWorld",
          storeAdress: { street: "Park Street", city: "Kolkata", state: "West Bengal", postalCode: "700001" },
          status: "active",
          isVerified: true,
          bankDetails: { accountHolderName: "Priya Sharma", bankName: "HDFC", accountNumber: "9876543210", ifscCode: "HDFC0005678" }
        },
        {
          name: "Pankaj Kumar",
          email: "pankaj2003@gmail.com",
          password: "pankajandwife",
          contact: "9822365521",
          storeName: "Sharma Cloth House",
          storeAdress: { street: "Blue Street", city: "Delhi", state: "New Delhi", postalCode: "130010"},
          status: "active",
          isVerified: true,
          bankDetails: { accountHolderName: "Priya Sharma", bankName: "HDFC", accountNumber: "9876543210", ifscCode: "HDFC0005678" }
        }
    ]);
    
      // --- Products ---
    const products = await Product.insertMany([
        {
          name: "iPhone 15",
          description: "Apple iPhone 15, 128GB",
          category: "Electronics",
          subCategory: "Mobiles",
          brand: "Apple",
          images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCp4w3CpZCaGrD8JA1v7AQqmD_p4b8oSstJ6YfHxH_-A&s=10"]
        },
        {
          name: "Sony WH-1000XM5",
          description: "Wireless noise-cancelling headphones",
          category: "Electronics",
          subCategory: "Audio",
          brand: "Sony",
          images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4ytoI7tASYwbEzUr2omAgPSMePuY1j6-k_QBHWNqtDw&s=10"]
        },
        {
          name: "Boat Rockerz 450",
          description: "Bluetooth on-ear headphones",
          category: "Electronics",
          subCategory: "Audio",
          brand: "Boat",
          images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzDkle_QcXRbe4rwuCBSUhTQdTX25508CU2DyDXgy5Q&s"]
        },
        {
          name: "Blue Tshirt",
          description: "100 % cotton navy blue tshirt , M Size",
          category: "Cloth",
          subCategory: "Upper Wear",
          brand: "Wrogn",
          images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwcBiFYcL3_ZqbVGgW9W8jE3iOuWSArm4zreD-ZagBag&s=10"]
        }
    ]);

    await Listing.insertMany([
        { product: products[0]._id, seller: sellers[0]._id, price: 79999, stock: 10, condition: "new" },
        { product: products[0]._id, seller: sellers[1]._id, price: 78499, stock: 4,  condition: "new" }, // same product, different seller/price
        { product: products[1]._id, seller: sellers[1]._id, price: 24999, stock: 15, condition: "new" },
        { product: products[2]._id, seller: sellers[0]._id, price: 1299,  stock: 50, condition: "new" },
        { product: products[3]._id, seller: sellers[2]._id, price: 799, stock: 100, condition: "new"}
    ]);

    console.log("Seed complete ✅");
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});