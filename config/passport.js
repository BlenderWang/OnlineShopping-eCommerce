const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// middleware
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email}, (err, user) => {
        if(err) return done(err);
        if(!user) {
            return done(null, false, req.flash('loginMessage', 'No such user has been found'));
        }
        if(!user.comparePw(password)) {
            return done(null, false, req.flash('loginMessage', 'Wrong password'));
        }
        return done(null, user);
    });
}));

// custom fn to validate
exports.isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}