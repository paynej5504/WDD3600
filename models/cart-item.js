//import sequelize
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
    //create id by setting type, nulls, if it will auto increment, and if it is a primary key
    id: {
        type: Sequelize.INTEGER,
        //will auto increment
        autoIncrement: true,
        //will not allow a null
        allowNull: false,
        //this is the primary key
        primaryKey: true
    },
    //quantity of the cart
    quantity: Sequelize.INTEGER
});

//export cartItem
module.exports = CartItem;