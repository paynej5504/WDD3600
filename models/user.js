const mongoose = require('mongoose');
//const { STRING } = require('sequelize/types');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
                quantity: {type: Number, required: true}
            }
        ]
    } 
});

//add own method to add to cart
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        //if _id matches the id of the product you're trying to insert, you know it already exists
        return cp.productId.toString() === product._id.toString();
    });
    //if item is not already in cart quantity starts at 1
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    //if item is alreayd in cart index by 1
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        //if item did not exist before push it 
        updatedCartItems.push({
            productId: product._id, 
            quantity: newQuantity
        });
    }
    
    const updatedCart = {
        items: updatedCartItems
    };
    //update cart
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    //get updated cart items
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    //get updated cart and save
    this.cart.items = updatedCartItems;
    return this.save();
}

//clear cart
userSchema.methods.clearCart = function () {
    //cart has no more items
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// //define a user model
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     //save user to db
//     save() {
//         const db = getDb();
//         //insert name and email properties for user
//         return db.collection('users').insertOne(this);
//     }

//     //add to cart
//     addToCart(product) {
    //     const cartProductIndex = this.cart.items.findIndex(cp => {
    //         //if _id matches the id of the product you're trying to insert, you know it already exists
    //         return cp.productId.toString() === product._id.toString();
    //     });
    //     //if item is not already in cart quantity starts at 1
    //     let newQuantity = 1;
    //     const updatedCartItems = [...this.cart.items];
    //     //if item is alreayd in cart index by 1
    //     if (cartProductIndex >= 0) {
    //         newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    //         updatedCartItems[cartProductIndex].quantity = newQuantity;
    //     } else {
    //         //if item did not exist before push it 
    //         updatedCartItems.push({
    //             productId: new ObjectId(product._id), 
    //             quantity: newQuantity
    //         });
    //     }
        
       
        
    //     const updatedCart = {
    //         items: updatedCartItems
    //     };
    //     const db = getDb(); //get access to db
    //     return db
    //     .collection('users')
    //     .updateOne(
    //         {_id: new ObjectId(this._id)},
    //         {$set: {cart: updatedCart}} //override old cart with new cart
    //         );
    // }

//     getCart() {
//         //gives access to db
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         //find all products in cart
//         return db.collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products => {
//             return products.map(p => {
//                 //use .find to look at all cart items
//                 return {...p, quantity: this.cart.items.find(i => {
//                     return i.productId.toString() === p._id.toString();
//                 }).quantity
//             };
//             });
//         });
//     }

//     //delete cart item(s)
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db
//         .collection('users')
//         .updateOne(
//             {_id: new ObjectId(this._id)},
//             {$set: {cart:{items: updatedCartItems}}}
//         );
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//         .then(products => {
//             //items we want to save
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name
//                 }
//             };
//             return db.collection('orders').insertOne(order);
//         })
//         .then(result => {
//             this.cart = {items: []}; //empty cart
//             //clear cart in db
//             return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)},
//                 {$set: {cart:{items: []}}}
//             );
//         });
//     } 

//     getOrders() {
//         const db = getDb();
//         //find all orders for user
//         return db
//         .collection('orders')
//         .find({'user._id': new ObjectId(this._id)})
//         .toArray();
//     }

//     static findById(userId){
//         //access database
//         const db = getDb();
//         return db.collection('users')
//         .findOne({_id: new ObjectId(userId)})
//         // .then(user => {
//         //     console.log(user);
//         // })
//         // .catch(err => {
//         //     console.log(err);
//         // });
//     }
// }
// //export module
// module.exports = User;