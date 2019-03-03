const router = require('express').Router();
const User = require('../models/user');

router.get('/signup', (req, res, next) => {
    res.render('accounts/signup');
});

router.post('/signup', (req, res, next) => {
    const user = new User();

    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    // user email validation
    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if(existingUser) {
            console.log(req.body.email + 'already exists');
            return req.redirect('/signup');
        }else {
            user.save((err, user) => {
                if(err) return next(err);

                res.json('New user has been created');
            });
        }
    });
});

module.exports = router;