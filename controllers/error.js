//creates get404 function to render 404
/*exports.get404 = (req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
}*/
exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path:'/404',
    isAuthenticated: req.session.isLoggedIn });
};

exports.get500 = (req, res, next) => {
    // renders 500 page if there's a 500 error
    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path:'/500',
        isAuthenticated: req.session.isLoggedIn });
};
  