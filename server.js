const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const engine = require('ejs-mate');

const User = require('./models/user')

const app = express();

/*mongoose.connect('mongodb://root:Abc123@cluster0-shard-00-00-jajab.mongodb.net:27017,cluster0-shard-00-01-jajab.mongodb.net:27017,cluster0-shard-00-02-jajab.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log('Connected to the database');
    }
});*/

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true}, (err) => {
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
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.post('/create-user', (req, res, next) => {
    const user = new User();
    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save((err) => {
        if(err) return next(err);

        res.json('Successfully created a new user');
    });
});

app.get('/', (req, res) => {
    res.render('main/home');
});

app.get('/signup', (req, res) => {
    res.render('main/signup');
});

app.listen(3000, (err) => {
    if(err) throw err;
    console.log('Server is running at port 3000');
});