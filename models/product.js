// creates product array
//const products = [];


const Cart = require('./cart');
const db = require('../util/database');


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
    // save method to store product into database
    save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {
        
    }

    static fetchAll() {
        //get id, title, price, etc from database
        return db.execute('SELECT * FROM products');
    }

    // return product with same id
    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
};