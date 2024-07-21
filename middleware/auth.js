
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

module.exports.setUser = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
};
