const express = require('express');
const router = express.Router();

//import auth controller
const authController = require('../controllers/auth');

//get the login page
//point to the controller with getLogin function
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//logout
router.post('/logout', authController.postLogout);


//export router
module.exports = router;