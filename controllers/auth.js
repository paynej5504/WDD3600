// import statements
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// tell nodemailer how emails will be delivered
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      // key from sendgrid encoded to protect account
      api_key:
        'SG.#######-##-###########.####_######################_###############'
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
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // pass error message
    errorMessage: message
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
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  // extract email and password
  const email = req.body.email;
  const password = req.body.password;
  // find user with specific email
  User.findOne({ email: email })
    .then(user => {
      // if don't have user return error message
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
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
          // if password is invalid
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  /* retrieve email */
  const email = req.body.email;
  /* retireve password */
  const password = req.body.password;
  /* retrieve confirmation password */
  const confirmPassword = req.body.confirmPassword;
  /* find a user that has the email we are extracting */
  User.findOne({ email: email })
    .then(userDoc => {
      // if the user exists send error message
      if (userDoc) {
        req.flash(
          'error',
          'E-Mail exists already, please pick a different one.'
        );
        // redirect back to signup page
        return res.redirect('/signup');
      }
      // encrypt password to protect from hackers
      return bcrypt
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
            from: 'paynej5504@clarkstate.edu',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
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
        from: 'paynej5504@clarkstate.edu',
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      });
    })
    .catch(err => {
      console.log(err);
    })
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
    console.log(err);
  });

  
}

exports.postNewPassword = (req, res, next) => {
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
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
  })
}
