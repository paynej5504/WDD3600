//import statements
const mongoose = require('mongoose');

//allows you to create new schemas
const Schema = mongoose.Schema;

//how a product should look like in app
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//export product schema
module.exports = mongoose.model('Product', productSchema);
