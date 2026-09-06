const express = require('express');
const app = express();
const staticRoutes = require('./routes/staticRoutes');
const dynamicRouting = require('./routes/dynamicRoutes');
const connectToMongoDB = require('./connect');
const cookieParser = require('cookie-parser');
connectToMongoDB(app);

app.set('view engine', 'ejs');
app.set('views', '/Users/jashnoorsingh/Desktop/NodeJS Projects/mini-Amazon/views');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/amazon-clone', staticRoutes); // adding the middleware
app.use('/user', dynamicRouting);