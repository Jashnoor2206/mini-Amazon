const express = require('express');
const app = express();
const staticRoutes = require('./routes/staticRoutes');
const dynamicRouting = require('./routes/dynamicRoutes');
const connectToMongoDB = require('./connect');
connectToMongoDB(app);

app.set('view engine', 'ejs');
app.set('views', '/Users/jashnoorsingh/Desktop/NodeJS Projects/mini-Amazon/views');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/amazon-clone', staticRoutes);
app.use('/user', dynamicRouting);