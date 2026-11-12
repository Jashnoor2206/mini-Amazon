require('dotenv').config();
const mongoose = require('mongoose');
const port = process.env.PORT;

async function connectToMongoDB(app){
    try{
        console.log('trying to connect to db')
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Database !');
        app.listen(port , () => {
            console.log(`Server is running on port ${port}`);
        });
    }catch(err){
        console.log(err);
    }
}

module.exports = connectToMongoDB;