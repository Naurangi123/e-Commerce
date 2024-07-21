// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy(User.authenticate()));
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};
