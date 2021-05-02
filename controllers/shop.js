//import statements
const fs = require('fs'); // import file system
const path = require('path');

const PDFDocument = require('pdfkit');
//need stripe secret key
const stripe = require('stripe')(''); //add stripe secret key in ''

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2; //limits number of items on page

// for /products url
exports.getProducts = (req, res, next) => {
  //find all the products
  // get page number
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
    // skip first 2 items and fetch next 2 items
    return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE); //item limit is 2
  })
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
      //set number of items on all pages
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
  }).catch(err => {
    //trigger status code and throw error
  const error = new Error(err);
  error.httpStatusCode = 500;
  //skip other middleware if error
  return next(error);
  });
};

exports.getIndex = (req, res, next) => {
  // get page number
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
    // skip first 2 items and fetch next 2 items
    return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      //set number of items on all pages in shop
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
        products: products
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
  .catch(err => {
    //trigger status code and throw error
  const error = new Error(err);
  error.httpStatusCode = 500;
  //skip other middleware if error
  return next(error);
  });
};

exports.getCheckout = (req, res, next) => {
  // render checkout page
  req.user
  //tell mongoose to fetch data for cart items
  .populate('cart.items.productId')
  .execPopulate()
  .then(user => {
     const products = user.cart.items;
     let total = 0;
     // loop through products
     products.forEach(p => {
       // calculate total
      total += p.quantity * p.productId.price;
     });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
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

exports.postOrder = (req, res, next) => {

  // token is created using Checkut or Elements!
  // Get the payment token Id submitted by the form:
  const token = req.body.stripeToken;
  let totalSum = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      //loop through user cart items
      user.cart.items.forEach(p => {
        // calculate total amount
        totalSum += p.quantity * p.productId.price;
      });
      
      const products = user.cart.items.map(i => {
        //._doc gives access to just the data
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });
      //create new order object
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        //products for user's cart
        products: products
      });
      return order.save();
    })
  .then(result => {
    //create charge object
    const charge = stripe.charges.create({
      amount: totalSum * 100, //add * 100 because it is in cents
      currency: 'usd',
      description: 'Demo Order',
      source: token,
      metadata: {order_id: result._id.toString()}
    });
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    //trigger status code and throw error
  const error = new Error(err);
  error.httpStatusCode = 500;
  //skip other middleware if error
  return next(error);
  });
};

//view for /orders url
exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
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

exports.getInvoice = (req, res, next) => {
  // retrieve order id
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order => {
    // if order is not found send error message
    if (!order) {
      return next(new Error('No order found.'));
    }
    // if do have order check if correct user
    // if not same user return error
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }
    // invoice name using order id
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    // create a pdf
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
      // define how content should be served to client
    res.setHeader(
      'Content-Disposition', 
      'inline; filename="' + invoiceName + '"'
    );
    // also store to serevr
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res); // return to client
      // adding text to pdf
    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('---------------------');
    //sum
    let totalPrice = 0;
    // list product, quantity, and price
    order.products.forEach(prod => {
      // calculate total price
      totalPrice += prod.quantity * prod.product.price;
      //create information that will be on doc
      pdfDoc.fontSize(14)
      .text(
        prod.product.title + 
        ' - ' + 
        prod.quantity + 
        ' x ' + 
        '$' + 
        prod.product.price
      );
    });
    pdfDoc.text('-----');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();
  })
  .catch(err => next(err));
  
};