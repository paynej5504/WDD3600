
//import path
const path = require('path');

// This is an example of how to create a node server
//const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

//imports error.js from controllers folder
const errorController = require('./controllers/error');

//import database
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require ('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

app.use ((req, res, next) => {
    User.findByPk(1)
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

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize
//.sync({force: true})
.sync()
.then(result => {
    return User.findByPk(1);
    //console.log(result);
    // what port the server listens on. (localhost:3000)
    //app.listen(3000);
})
.then (user => {
    if (!user) {
       return User.create({name: 'Max', email: 'test@test.com'});
    }
    return user; 
})
.then (user => {
    return user.createCart();
    //console.log(user);
})
.then (cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

