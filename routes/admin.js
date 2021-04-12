//import path
const path = require('path');

/*import express*/
const express = require('express');

//import products.js from controllers folder
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

//create router
const router = express.Router();



// /admin/add-product => GET
 router.get('/add-product', isAuth, adminController.getAddProduct);
 // /admin/products => GET
 router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
 router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// exports router
module.exports = router;