const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('main/home');
});

router.get('/signup', (req, res) => {
    res.render('main/signup');
});

module.exports = router;