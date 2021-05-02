//import statements
const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

const mongoose = require('mongoose');

const fileHelper = require('../util/file');
const product = require('../models/product');

//admin functions
//exported function
exports.getAddProduct = (req, res, next) => {
    // if user is logged in show page
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  };
  
  //adds new product through post route
  exports.postAddProduct = (req, res, next) => {
    //get product information
    const title = req.body.title;  
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // check if image is set
    if (!image) {
      // return error if data is not defined
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          price: price,
          description: description
        },
        // error if file is not an image file
        errorMessage: 'Attached file is not an image.',
        validationErrors: []
      });
    }
    const errors = validationResult(req);

    //if there is an error
    if (!errors.isEmpty()) {
      // error status code
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description
        },
        // get error messages
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
    
    const imageUrl = image.path;

    //creates a new product based on the class
    //passes title, price, image, and description of product
    const product = new Product({
      title: title, 
      price: price, 
      description: description, 
      imageUrl: imageUrl,
      userId: req.user
    });
    //save product information and redirect
    product
    .save()
    .then(result => {
      console.log('created product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      //skip other middleware if error
      return next(error);
    });
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    // if not in editing mode
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
      // check for existance of product
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [] // no errors so empty array
      });
    })
    .catch(err => {
      //trigger status code and throw error
      const error = new Error(err);
      error.httpStatusCode = 500;
      //skip other middleware if error
      return next(error);
    });
  };

  // //fetches info for the product and replaces it with new info
  exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // error status code
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        // product data values
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDescription,
          _id: prodId
        },
        // get error messages
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
    
    //find product and get full mongoose object
    Product.findById(prodId)
      .then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        if (image) {
          // delete image if new image is added
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }
        
        return product.save().then(result => {
          console.log('UPDATED PRODUCT');
          res.redirect('/admin/products');
        });
      })
      
      .catch(err => {
        //trigger status code and throw error
      const error = new Error(err);
      error.httpStatusCode = 500;
      //skip other middleware if error
      return next(error);
      });
    }

    //get products
  exports.getProducts = (req, res, next) => {
    // only products created by user will be retrieved
    Product.find({userId: req.user._id})
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      //trigger status code and throw error
    const error = new Error(err);
    error.httpStatusCode = 500;
    //skip other middleware if error
    return next(error);
    });
  };

  //delete product
  exports.deleteProduct = (req, res, next) => {
    //get product that matches the id
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
      //if product is not found throw error message
      if (!product) {
        return next(new Error('Product not found.'));
      }
      //delete file
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({_id: prodId, userId: req.user._id});
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      //success message if product was deleted
      res.status(200).json({message: 'Success!'});
    })
    //error message is product deletion failed
    .catch(err => {
      res.status(500).json({message: 'Deleting product failed.'});
    });
    
  };