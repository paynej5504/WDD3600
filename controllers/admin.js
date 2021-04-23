const { validationResult } = require('express-validator/check');
//const mongodb = require('mongodb'); //import mongo db
const Product = require('../models/product');

const mongoose = require('mongoose');
//const ObjectId = mongodb.ObjectId;

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
    const title = req.body.title;  
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

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
    
    //creates a new product based on the class
    //passes title, price, image, and description of product
    const product = new Product({
    // _id: new mongoose.Types.ObjectId('6037f528894c6f4cdcf025dc'),
      title: title, 
      price: price, 
      description: description, 
      imageUrl: imageUrl,
      userId: req.user
    });
    product
    .save()
    .then(result => {
      //console.log(result);
      console.log('created product');
      res.redirect('/admin/products');
    })
    .catch(err => {

      // server-side issue occurred if status code 500
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   // get error messages
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      //res.redirect('/500');
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
    //Product.findByPk(prodId)
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
    const updatedImageUrl = req.body.imageUrl;
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
          imageUrl: updatedImageUrl,
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
        product.imageUrl = updatedImageUrl;
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
    // //which fields you want to select or unselect
    // .select('title price -_id')
    // //tells mongoose to populate a certain field with info
    // .populate('userId', 'name')
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
  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      //redirect to products page once product is deleted
      res.redirect('/admin/products');
    })
    .catch(err => {
      //trigger status code and throw error
    const error = new Error(err);
    error.httpStatusCode = 500;
    //skip other middleware if error
    return next(error);
    });
    
  };