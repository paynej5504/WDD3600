const fs = require('fs');
const path = require('path');

//cart.json adds object that represents out cart
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    //take id of product you want to add
    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            
            let cart = {products: [], totalPrice: 0};
            //if there is no error then we know we have an existing cart
            if (!err) {
                cart = JSON.parse(fileContent);
            }

        
        // analyze the cart => find existing product
        // see if product id we are trying to add matches existing product
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        // add new product or increase quantity
        if (existingProduct) {
            //take all properties of existing product and add them to a javascript object
            updatedProduct = {...existingProduct};
            //increment quantity by 1
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            //replace element with updated product
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = {id: id, qty: 1};
            //array with all the old cart products
            cart.products = [...cart.products, updatedProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        });
        
    });
        
    }

    //to delete items form cart
    static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
       if (err) {
           return;
       } 
       const updatedCart = {...JSON.parse(fileContent)};
       const product = updatedCart.products.find(prod => prod.id === id);
       if (!product) {
           return;
       }
       const productQty = product.qty;
       //runs over all elements in array and returns true if th eproduct id is not equal to the id you are looking for
       updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
       //equation to subtract the price of the item(s) from the total price 
       updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

       //store updated cart to file
       fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
       });
    });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null); 
            } else {
                //callback to get entire cart
                cb(cart);
            }
        });
    }

};