//import path
const path = require('path');
//import express
const express = require('express');
//import products.js from controllers folder
const shopController = require('../controllers/shop');

// create router
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
 router.get('/products/:productId', shopController.getProduct);
 router.get('/cart', shopController.getCart);

 router.post('/cart', shopController.postCart);

 router.post('/cart-delete-item', shopController.postCartDeleteProduct);

 router.post('/create-order', shopController.postOrder);

 router.get('/orders', shopController.getOrders);


//router gets exported
module.exports = router;
