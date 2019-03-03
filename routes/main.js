const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('main/home');
});

router.get('/login', (req, res) => {
    res.render('main/login');
});

module.exports = router;