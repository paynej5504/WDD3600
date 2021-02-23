//define a user model
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//define a user and store the user in a constant
const User = sequelize.define('user', {
    //id, name, and email for user
    id: {
        type: Sequelize.INTEGER,
        //will auto increment
        autoIncrement: true,
        //does not allow nulls
        allowNull: false,
        //this is the primary key
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

//export module
module.exports = User;