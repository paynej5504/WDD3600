const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'meeko05', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;