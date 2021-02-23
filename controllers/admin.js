const Product = require('../models/product');
//admin functions
//exported function
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    });
  };
  
  //adds new product through post route
  exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;  
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    //creates a new product based on the class
    //passes title, price, image, and description of product
    req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      //console.log(result);
      console.log('created product');
      res.redirect('/admin/products');
    }).catch(err => {
      console.log(err);
    });
    
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    // if not in editing mode
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user
    .getProducts({where: { id: prodId } })
    //Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
  };

  //fetches info for the product and replaces it with new info
  exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  }

  exports.getProducts = (req, res, next) => {
    req.user
    .getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
  };

  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
      //redirect to products page once product is deleted
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
    
  };