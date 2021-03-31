const Product = require('../models/product');
//const Order = require('../models/order');
// for /products url
exports.getProducts = (req, res, next) => {
  //find all the products
  Product.find()
  .then(products => {
    console.log(products);
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
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
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    }); 
  }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  //find all the products
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated: req.session.isLoggedIn
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
  //tell mongoose to fetch data for cart items
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
     const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
  .catch(err => console.log(err))
};

//add an element to the cart
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  //fetch product you want to add
  Product.findById(prodId)
  .then(product => {
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
  .removeFromCart(prodId)
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        //._doc gives access to just the data
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });
      //create new order object
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        //products for user's cart
        products: products
      });
      return order.save();
    })
  .then(result => {
    req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

//view for /orders url
exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};
