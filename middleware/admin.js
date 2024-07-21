
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user && req.user.isLoggedIn) {
        return next(); 
    }
    res.redirect('/products');
};
