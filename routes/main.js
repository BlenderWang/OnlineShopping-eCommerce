const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('main/home');
});

router.get('/about', (req, res) => {
    res.render('main/about');
});

// test the looping fn
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

module.exports = router;