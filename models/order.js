//import sequelize
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    //create id by setting type, nulls, if it will auto increment, and if it is a primary key
    id: {
        type: Sequelize.INTEGER,
        //will auto increment
        autoIncrement: true,
        //will not allow a null
        allowNull: false,
        // this is th eprimary key
        primaryKey: true
    }
 
});

//export cartItem
module.exports = Order;