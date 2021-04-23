//import sequelize
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
    //create id by setting type, nulls, if it will auto increment, and if it is a primary key
    id: {
        type: Sequelize.INTEGER,
        //will auto increment
        autoIncrement: true,
        //does not allow a null
        allowNull: false,
        //this is the primary key
        primaryKey: true
    },
    //quantity of the cart
    quantity: Sequelize.INTEGER
});

//export cartItem
module.exports = OrderItem;