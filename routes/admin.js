//import path
const path = require('path');

/*import express*/
const express = require('express');

//import products.js from controllers folder
const productsController = require('../controllers/products');

//create router
const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postAddProduct);

// exports router
module.exports = router;