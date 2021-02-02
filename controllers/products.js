const Product = require('../models/product');

//exported function
exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

//adds new product through post route
exports.postAddProduct = (req, res, next) => {
  //creates a new product based on the class
  const product = new Product(req.body.title);
  //calls save method
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  //call all the products
  Product.fetchAll(products => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
  
};
