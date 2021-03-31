const User = require('../models/user');

//view for /login url
exports.getLogin = (req, res, next) => {
    //get true or false value of cookie
    /*console.log(req.get('Cookie'))
    const isLoggedIn = req
      .get('Cookie')
      .split(';')[1]
      .trim()
      .split('=')[1] === 'true';*/
      console.log(req.session.isLoggedIn);
    //render login page
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      });
  };

  //get login data
  exports.postLogin = (req, res, next) => {
    User.findById('6037f3f60d88f74b980b648b')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
  };

  //register postLogout button
  exports.postLogout = (req, res, next) => {
    //clear session once logged out
    req.session.destroy(err => {
      console.log(err);
      //redirect to home page
      res.redirect('/');
    });
};
  