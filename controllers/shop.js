const Product = require('../models/product');
const Order = require('../models/order');
// for /products url
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
      /*hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true*/
    });
  })
  .catch(err => {
    console.log(err);
  });
};

//controller to get one product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product, 
      pageTitle: product.title,
      path: '/products'
    }); 
  }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  //call all the products
  Product.fetchAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

//view for /cart url
exports.getCart = (req, res, next) => {
  //console.log(req.user.cart);
  req.user
  .getCart()
  .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
  .catch(err => console.log(err))
};

//add an element to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  //fetch product you want to add
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product); //return promise
  })
  //result of update operation
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  });
};

//delete items in cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .deleteItemFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
  .addOrder()
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

//view for /orders url
exports.getOrders = (req, res, next) => {
  req.user
  .getOrders()
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};
