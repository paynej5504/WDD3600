// creates product array
//const products = [];

const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
    
    fs.readFile(p, (err, fileContent) => {
        // if error return an empty array
        if (err) {
             cb([]);
        } else {
        //to return as an array, call JSON.parse
         cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    //get t
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        // create property. Title is equal to title recieveing
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    // save method to store product in array
    save() {
        
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
           
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
        //return products;
    }

    // if product id is same as product you are looking at
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};