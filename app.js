const express = require('express');
const app = express();
const connectToMongoDB = require('./connect');
connectToMongoDB(app);

app.set('view engine', 'ejs');
app.set('view', './view');
app.use(express.json());
app.use(express.urlencoded({extended: true}));