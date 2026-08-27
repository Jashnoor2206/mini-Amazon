require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB(app){
    try{
        console.log('trying to connect to db')
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Database !');
        app.listen(3000);
    }catch(err){
        console.log(err);
    }
}

module.exports = connectToMongoDB;