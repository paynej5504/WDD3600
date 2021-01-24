//import path
const path = require('path');
//import express
const express = require('express');

//import rootDir from path.js
const rootDir = require('../util/path');

//create router
const router = express.Router();

/*handles get requests*/
router.get('/', (req, res, next) => {
    //uses join method to yield path
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

//router gets exported
module.exports = router;