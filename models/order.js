//import statements
const mongoose = require('mongoose');

//create new schema
const Schema = mongoose.Schema;

//store data in order collection
const orderSchema = new Schema ({
    //product data
    products: [
        {
            product: { type: Object, required: true},
            quantity: {type: Number, required: true}
        }
    ],
    //user info
    user: { 
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId, //user id
            required: true,
            ref: 'User' //refer to user model
        }
    }
});

//export order model
module.exports = mongoose.model('Order', orderSchema);
