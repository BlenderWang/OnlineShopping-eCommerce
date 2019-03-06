const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const secret = require('./config/secret');
const User = require('./models/user');
const Category = require('./models/category');

const app = express();

/*mongoose.connect('mongodb://root:Abc123@cluster0-shard-00-00-jajab.mongodb.net:27017,cluster0-shard-00-01-jajab.mongodb.net:27017,cluster0-shard-00-02-jajab.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log('Connected to the database');
    }
});*/

mongoose.set('useCreateIndex', true);
mongoose.connect(secret.database, { useNewUrlParser: true}, (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log('Connected to the database');
    }
})

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    Category.find({}, (err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.listen(secret.port, (err) => {
    if(err) throw err;
    console.log('Server is running at port ' + secret.port);
});