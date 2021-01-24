//import path
const path = require('path');

/*import express*/
const express = require('express');

//import rootDir from path.js
const rootDir = require('../util/path');

//create router
const router = express.Router();

/*handles get requests*/
router.get('/add-product',(req, res, next) => {
    // uses join method to yield path to add-products.html
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

//only fires for incoming post requests
router.post('/add-product', (req, res, next) => {
    //extracts what the user sent
    console.log(req.body);
    // redirects to the / route
    res.redirect('/');
});

//router gets exported
module.exports = router;