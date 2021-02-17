//import mysql
const mysql = require('mysql2');

//set up connection by creating a pool
// pool manages multiple connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'meeko05'
});

//export the pool
module.exports = pool.promise();