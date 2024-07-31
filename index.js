const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const MongoStore = require('connect-mongo');
const passportConfig = require('./config/passport');
const Product =require('./models/Product')
const User=require('./models/User')

// This is the cause of lazy loading 

// const profileRoutes=require('./routes/profileRoutes')
// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const isAuthenticated=require('./middleware/auth')

const app = express();

mongoose.connect('mongodb://localhost:27017/e-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/e-commerce' }),
    cookie: { secure: false } 
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});


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
        const products=await Product.find({}).sort({_id:-1});
        res.render('home', { products,authenticated, username });
    } catch (err) {
        req.flash('error','Internal Server Error');
        res.redirect('/');

    }
})

app.post('/logout',async(req, res, next)=>{
    req.logout((err)=>{
      if (err) { 
        req.flash('error', 'There was an error logging out.'+err);
        return res.redirect('/');
        
    }
      res.redirect('/auth/login');
    });
  });


//   normal and lazy loading

// app.use('/profile', profileRoutes);
// app.use('/auth', userRoutes);
// app.use('/products',adminRoutes);
// app.use('/cart',cartRoutes)


// Improvement with fast loading to remove lazy loading implement 
app.use('/profile',  (req, res, next) => {
    try {
        const profileRoutes = require('./routes/profileRoutes');
        profileRoutes(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/auth',  (req, res, next) => {
    try {
        const userRoutes = require('./routes/userRoutes');
        userRoutes(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/products',  (req, res, next) => {
    try {
        const adminRoutes = require('./routes/adminRoutes');
        adminRoutes(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/cart', (req, res, next) => {
    try {
        const cartRoutes = require('./routes/cartRoutes');
        cartRoutes(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    req.flash('error', 'Internal Server Error');
    res.status(500).redirect('/');
});

// Define your routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));