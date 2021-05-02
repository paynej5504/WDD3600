//import path
const path = require('path');

/*import express*/
const express = require('express');
const { body } = require('express-validator/check');

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
 router.post('/add-product', [
    body ('title')
    // only uses numbers and letters
        .isString()
        // title can't have less than 3 characters
        .isLength({ min: 3 })
        // trim extra whitespace
        .trim(),
    body ('price')
        .isFloat(),
    body ('description')
        // description can't have less than 5 characters or more than 400
        .isLength({ min: 5, max: 400 })
        // trim extra whitespace
        .trim()
 ], 
 isAuth, 
 adminController.postAddProduct
 );

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body ('title')
        // check if valid string
            .isString()
            // title can't have less than 3 characters
            .isLength({ min: 3 })
            // trim extra whitespace
            .trim(),
        body ('price')
            .isFloat(),
        body ('description')
            // description can't have less than 5 characters or more than 400
            .isLength({ min: 5, max: 400 })
            // trim extra whitespace
            .trim()
    ], 
    isAuth, 
    adminController.postEditProduct
);

// delete route to delete product
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

// exports router
module.exports = router;
