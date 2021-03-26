
//import path
const path = require('path');

// This is an example of how to create a node server
//const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//imports error.js from controllers folder
const errorController = require('./controllers/error');

const User = require('./models/user');

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

// app.use ((req, res, next) => {
//     User.findById()
//     .then
// });
app.use((req, res, next) => {
    //search for user with this id
    User.findById('6037f3f60d88f74b980b648b')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

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

//connect via mongoose
mongoose.connect('mongodb+srv://Jeris:meeko05@cluster0.riltt.mongodb.net/shop?retryWrites=true&w=majority')
.then(result =>{
  //see if have user
  User.findOne().then(user => {
    //if user is not set
    if (!user) {
      //create new user 
      const user = new User({
        name: 'Max',
        email: 'max@test.com',
        cart: {
          items: []
        }
      }); 
      user.save();
    }
  })
  
  app.listen(3000);
}).catch(err => {
  console.log(err);
});
