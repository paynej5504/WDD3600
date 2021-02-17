
//import path
const path = require('path');

// This is an example of how to create a node server
//const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

//imports error.js from controllers folder
const errorController = require('./controllers/error');

//import database
const db = require('./util/database');

/*imports modules */
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



//calls bodyParser to parse the body that's sent through the form
app.use(bodyParser.urlencoded({extended: false}));
//static method serves static files. In this case it's used to access the css file
app.use(express.static(path.join(__dirname, 'public', )));

//places the router object 
app.use('/admin',adminRoutes); //ADDED BY AH
app.use(shopRoutes);

//middleware to handle 404
//app.use((req, res, next) => { //COMMENTED OUT BY AH
    //uses join method to connect to 404.html page 
   //res.status(404).render('404', { pageTitle: 'Page Not Found' }); //COMMENTED OUT BY AH
//});

//references get404 function
app.use(errorController.get404);

// what port the server listens on. (localhost:3000)
app.listen(3000);