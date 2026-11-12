const express = require('express');
const app = express();
const staticRoutes = require('./routes/staticRoutes');
const dynamicRouting = require('./routes/dynamicRoutes');
const connectToMongoDB = require('./connect');
const cookieParser = require('cookie-parser');
const path = require('path');
app.use('/client-assets', express.static(path.join(__dirname, 'client/dist')));
connectToMongoDB(app);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// __dirname holds the full path of the folder and it varies with the computer for my mac it would be something else and for some other person who clones my code it would be something else . path.join(a, b) glues two paths a, b together. app.set tells which folder ejs files exist so res.render() knows what to target so after joining the path it becomes somePath/mini-Amazon/views
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/amazon-clone', staticRoutes);
app.use('/user', dynamicRouting);