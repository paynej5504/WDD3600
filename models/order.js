const mongoose = require('mongoose');

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
        name: {
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
