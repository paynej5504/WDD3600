//import path
const path = require('path');

// This is an example of how to create a node server
//const http = require('http');

const express = require('express');

/*imports modules */
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//calls bodyParser to parse the body that's sent through the form
app.use(bodyParser.urlencoded({extended: false}));
//static method serves static files. In this case it's used to access the css file
app.use(express.static(path.join(__dirname, 'public', )));

/*places the router object 
automatically considers routes from admin.js file*/
app.use('/admin',adminRoutes);
app.use(shopRoutes);

//middleware to handle 404
app.use((req, res, next) => {
    //uses join method to connect to 404.html page 
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// what port the server listens on. (localhost:3000)
app.listen(3000);