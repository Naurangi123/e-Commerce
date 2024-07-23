
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const passportConfig=require('./config/passport')
const User=require('./models/User')
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const path=require('path')
const flash = require('connect-flash');

const app = express();

mongoose.connect('mongodb://localhost:27017/e-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportConfig(passport)

//routes
app.get('/', async (req, res) => {
    try {
        let username = null;
        let authenticated = req.isAuthenticated();
        if (authenticated) {
            const user = await User.findOne({ username: req.user.username });
            if (user) {
                username = user.username;
            }
        }
        res.render('home', { authenticated, username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/auth', userRoutes);
app.use('/products',adminRoutes);
app.use('/cart',cartRoutes)

// Make `user` available in all views
app.use((req, res, next) => {
    res.locals.user = req.user; 
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

