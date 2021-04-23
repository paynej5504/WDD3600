
//import path
const path = require('path');

// This is an example of how to create a node server
//const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

//imports error.js from controllers folder
const errorController = require('./controllers/error');

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://Jeris:meeko05@cluster0.riltt.mongodb.net/shop?retryWrites=true&w=majority';

/*imports modules */
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// initialize csurf
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');



//calls bodyParser to parse the body that's sent through the form
app.use(bodyParser.urlencoded({extended: false}));
//static method serves static files. In this case it's used to access the css file
app.use(express.static(path.join(__dirname, 'public', )));
//session middleware is initialized
app.use(session({
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false, 
  store: store
  })
);
app.use(csrfProtection);
app.use(flash());

// csrf token
app.use((req, res, next) => {
  // these fields are set for the views that are rendered
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// app.use ((req, res, next) => {
//     User.findById()
//     .then
// });
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    } 
    //search for user with this id
    User.findById(req.session.user._id)
      .then(user => {
        // check for existence of user
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        // throw an error if there is an issue
        next(new Error(err));
      });
  });

  

//places the router object 
app.use('/admin',adminRoutes); //ADDED BY AH
app.use(shopRoutes);
app.use(authRoutes);

//middleware to handle 404
//app.use((req, res, next) => { //COMMENTED OUT BY AH
    //uses join method to connect to 404.html page 
   //res.status(404).render('404', { pageTitle: 'Page Not Found' }); //COMMENTED OUT BY AH
//});

app.get('/500', errorController.get500);
//references get404 function
app.use(errorController.get404);

// include error middleware
app.use((error, req, res, next) => {
  //res.redirect('/500');
  res.status(500).render('500', { 
    pageTitle: 'Error!', 
    path:'/500',
    isAuthenticated: req.session.isLoggedIn });
});

//connect via mongoose
mongoose
  .connect(
    MONGODB_URI  
  )
.then(result =>{
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
