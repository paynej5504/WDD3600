module.exports = (req, res, next) => {
    // if user is not logged in 
    if (!req.session.isLoggedIn) {
        // redirect to login page
        return res.redirect('/login');
    }
    next();
}