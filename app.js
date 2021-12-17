// REQUIREMENTS
const express = require('express');
const engine = require('ejs-mate');
const dotenv = require('dotenv')
const ejs = require('ejs');
const colors = require('colors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const methodOverride = require('method-override');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const searchRoutes = require('./routes/searchBar');
const userRoutes = require('./routes/users');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport =require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');

dotenv.config({path: '.env'});

// DB CONNECT ---------------------------------------------------------------------------------------------------------------
const localDB = 'mongodb://localhost:27017/bibliotech'
const cloudDB = process.env.MONGO_URI

mongoose.connect(cloudDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:".bgRed));
db.once("open", () => {
    console.log(`Mongoose(Atlas) connected`.black.bgBrightCyan);
});


// App configs and uses ---------------------------------------------------------------------------------------------------------------
const app = express();
// app.use(morgan('dev'))
app.set("view engine", 'ejs')
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(flash())


const sessionOptions = {secret: process.env.SESSIONSECRET, 
                        resave: false, 
                        saveUninitialized: false,
                        cookie:{
                                httpOnly: true,
                                expires:Date.now() + 1000 *30 * 60 * 24 * 7,
                                maxAge:1000 * 60 * 60 * 24 * 7 //maxAge == expiring session 7 days
                                }       
                        }

app.use(session(sessionOptions))

// User auth with passport (local-mongoose) -----------------------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// middleware for flashing messages, also accessing currentUser  --------------------------------------------------------
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

// ROUTES   ------------------------------------------------------------------------------------------------------------------------------

app.get("/", (req,res) => {res.render("homepage")})

app.use('/', searchRoutes)
app.use('/allbooks', bookRoutes)
app.use('/allbooks', reviewRoutes)
app.use("/", userRoutes) 


// ERROR HANDLER ------------------------------------------------------------------------------

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});


app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    //Mongoose bad ID object
    if(err.name === 'CastError'){
        const message = `No resource found or the page has been deleted, ${err.value}`;
        error = new ExpressError(message, 404)
    }
    //Mongoose duplicated key
    if(err.code === 11000) {
        const message = 'Duplicated field value';
        error = new ExpressError(message, 400)
    }
    // Error Handler
    var {status = 500, message = "Ops, something went wrong1!"} = error;
    if(!error.message) message = "Hmmm...Something from the server went wrong!";
    res.status(status).render('error', {error});
})


app.listen(3000, () => {
    console.log("Connected to the port".bgBrightYellow.black);
});



