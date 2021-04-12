//import path
const path = require('path');
//import express
const express = require('express');
//import products.js from controllers folder
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

// create router
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);


//router gets exported
module.exports = router;
