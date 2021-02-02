//import path
const path = require('path');
//import express
const express = require('express');
//import products.js from controllers folder
const productsController = require('../controllers/products');

// create router
const router = express.Router();

router.get('/', productsController.getProducts);

//router gets exported
module.exports = router;
