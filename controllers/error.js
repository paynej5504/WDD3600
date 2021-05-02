//returns 404 status if page is not found
exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path:'/404',
    isAuthenticated: req.session.isLoggedIn });
};

//returns 500 status if there is an error
exports.get500 = (req, res, next) => {
    // renders 500 page if there's a 500 error
    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path:'/500',
        isAuthenticated: req.session.isLoggedIn });
};
  