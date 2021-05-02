
//import statements
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

//imports error.js from controllers folder
const errorController = require('./controllers/error');
//import products.js from controllers folder
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');

const User = require('./models/user');

//enter MongoDb connection string in ''
const MONGODB_URI = '';

/*imports modules */
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// initialize csurf
const csrfProtection = csrf();

// control path and filename
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  // rename file 
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //image files that are accepted
  if (
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
   
};


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');



//calls bodyParser to parse the body that's sent through the form
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); //use multer and set imput name that will hold file
//static method serves static files. In this case it's used to access the css file
app.use(express.static(path.join(__dirname, 'public' )));
// go to /images then serve th efiles staticly
app.use('/images', express.static(path.join(__dirname, 'images' )));
//session middleware is initialized
app.use(session({
  secret: 'my secret', 
  resave: false, 
  saveUninitialized: false, 
  store: store
  })
);
app.use(flash());

// csrf token
app.use((req, res, next) => {
  // these fields are set for the views that are rendered
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

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

app.post('/create-order', isAuth, shopController.postOrder);

// initialize csrf middleware
app.use(csrfProtection);
app.use((req, res, next) => {
  // these fields are set for the views that are rendered
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//places the router object 
app.use('/admin',adminRoutes); //ADDED BY AH
app.use(shopRoutes);
app.use(authRoutes);


app.get('/500', errorController.get500);
//references get404 function
app.use(errorController.get404);

// include error middleware
app.use((error, req, res, next) => {
  res.status(500).render('500', { 
    pageTitle: 'Error!', 
    path:'/500',
    isAuthenticated: req.session.isLoggedIn });
});

//connect to database via mongoose
mongoose
  .connect(
    MONGODB_URI  
  )
.then(result =>{
  //open on port 3000
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
