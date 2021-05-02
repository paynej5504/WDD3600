// import statements
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// validationResult allows you to gather all the errors
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

// tell nodemailer how emails will be delivered
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      // key from sendgrid
      api_key:
        '//sendgrid api key goes here'
    }
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  // lets you know there is a message
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  //render login page
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // pass error message
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};

// get signup info
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    // no messages if valid
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  // extract email and password
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req); // collect errors
  // if there are errors
  if (!errors.isEmpty()) {
    console.log(errors.array());
    // return error status code
    return res.status(422)
    // return to login page and log any errors
    .render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  // find user with specific email
  User.findOne({ email: email })
    .then(user => {
      // if don't have user return error message
      if (!user) {
         // return error status code
        return res.status(422)
        // return to login page and log any errors
        .render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          // return error message 
          errorMessage: 'Invalid email or password',
          // return old input
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
      // validate password
        .compare(password, user.password)
        .then(doMatch => {
          // if passwords are equal
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
            // return error status code
        return res.status(422)
        // return to login page and log any errors
        .render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          // return error message 
          errorMessage: 'Invalid email or password.',
          // return old input
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      //trigger status code and throw error
    const error = new Error(err);
    error.httpStatusCode = 500;
    //skip other middleware if error
    return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  /* retrieve email */
  const email = req.body.email;
  /* retireve password */
  const password = req.body.password;
  const errors = validationResult(req); // collect errors
  // if there are errors
  if (!errors.isEmpty()) {
    console.log(errors.array());
    // return error status code
    return res.status(422)
    // return to signup page and log any errors
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { 
        email: email, 
        password: password, 
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  
      // encrypt password to protect from hackers
      bcrypt
        .hash(password, 12)
        // get hashed password
        .then(hashedPassword => {
          const user = new User({
            // save email and password
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          // redirect to login page
          res.redirect('/login');
          // send message 
          return transporter.sendMail({
            // configure email you want to send
            to: email,
            from: '', //enter your email address in ''
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        })
        .catch(err => {
          //trigger status code and throw error
        const error = new Error(err);
        error.httpStatusCode = 500;
        //skip other middleware if error
        return next(error);
        });
};

exports.postLogout = (req, res, next) => {
  // end session when user logs out
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

// render reset page
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    // buffer will store hexadecimal values
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      // if no user with matching email, send error message
      if (!user) {
        req.flash('error', 'No account with email found.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      user.save();
    })
    .then(result => {
      // redirect back to starting page
      res.redirect('/');
      // send email to reset password
      transporter.sendMail({
        // configure email you want to send
        to: req.body.email,
        from: '', //enter sender email address in ''
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
    })
    .catch(err => {
      //trigger status code and throw error
    const error = new Error(err);
    error.httpStatusCode = 500;
    //skip other middleware if error
    return next(error);
    });
  });
};

exports.getNewPassword = (req, res, next) => {
  // check if have user for token
  const token = req. params.token;
  // see if token is greater than now
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  // get user for who you want to set the password
  .then(user => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token
    });
  })
  .catch(err => {
    //trigger status code and throw error
  const error = new Error(err);
  error.httpStatusCode = 500;
  //skip other middleware if error
  return next(error);
  });

  
}

exports.postNewPassword = (req, res, next) => {
  //get user details
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: passwordToken, 
    resetTokenExpiration: {$gt: Date.now()}, 
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then (hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    //save user information
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    //trigger status code and throw error
  const error = new Error(err);
  error.httpStatusCode = 500;
  //skip other middleware if error
  return next(error);
  });
}
