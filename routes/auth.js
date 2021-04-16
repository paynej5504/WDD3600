const express = require('express');

// import express validator
// gives us the check function that we import from the package
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login', 
    [ // checks validity of email
        body('email')
        .isEmail()
        // if email is invalid send error message
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
        // makes sure a valid password is entered
       body ('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim() // remove extra whitespace
    ], 
        authController.postLogin
);

// checks if email is valid. If it is not, a message is sent
router.post(
    '/signup', 
    [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            // throw error when validation fails
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden.');
            // }
            // // if validation succeeded return true
            // return true;
            return User.findOne({ email: value })
            .then(userDoc => {
                // if the user exists send error message
                if (userDoc) {
                    return Promise.reject('Email address exists already, please pick a different one.');
                }
            });
        })
        .normalizeEmail(), 
        // checks for the password to be at least 5 characters long
        body('password', 
        'Please enter a password with at least 5 characters using numbers and letters.'
        )
        .isLength({min: 5})
        // only allow numbers and letters
        .isAlphanumeric()
        .trim(), // trim extra whitespace
        // check if passwords match
    body('confirmPassword')
        .trim() //remove whitespace
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            // true if passwords match
            return true;
        })
    ],
        authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;