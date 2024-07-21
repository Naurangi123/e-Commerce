
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const methodOverride = require('method-override');
const Register = require('./models/Register');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const {setUser}=require('./middleware/auth')
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
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(setUser)

passport.use(new LocalStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

app.use(flash());

app.use('/', userRoutes);
app.use('/products',adminRoutes);
// app.use('/products',cartRoutes);

app.get('/', async (req, res) => {
    try {
        // Check if user is logged in
        if (req.user) {
            // Assuming req.user contains user information after login
            const user = await Register.findOne({ username: req.user.username });
            if (user) {
                res.render('home', { user});
            } else {
                res.render('home', { user: null});
            }
        } else {
            res.render('home', { user: null });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

