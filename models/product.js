//import mongodb
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    //stores title, price, description, image url, id, and userid when it gets created
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        //create new id object otherwise store null
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }
    save() { //save in db
        //access to db
        const db = getDb();
        let dbOp;
        if (this._id) {
            //Update product
            dbOp = db
            .collection('products')
            .updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db
            .collection('products')
            .insertOne(this);
        }
        
        //connect to products connection
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }
    //get products
    static fetchAll() {
        //get access to db
        const db = getDb();
        //find all products
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(prodId) {
        //get access to db
        const db = getDb();
        //return products with a certain id
        return db.collection('products')
        //find the items that match the id stored in the db
        .find({_id: new mongodb.ObjectId(prodId)})
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        //log an error if there is one
        .catch(err => {
            console.log(err);
        });
    }

    static deleteById(prodId) {
        //get access to db
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(result => {
            console.log('Deleted');
        })
        .catch(err => {
            console.log(err);
        });
    }
}


module.exports = Product;