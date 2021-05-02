//import statements
const mongoose = require('mongoose');

//create new schema
const Schema = mongoose.Schema;

//user schema requires email, password, and cart items
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