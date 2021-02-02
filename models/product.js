// creates product array
//const products = [];

const fs = require('fs');
const path = require('path');
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
    constructor(t) {
        // create property. Title is equal to title recieveing
        this.title = t;
    }
    // save method to store product in array
    save() {
        getProductsFromFile(products => {
           
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
        
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
        //return products;
    }
};