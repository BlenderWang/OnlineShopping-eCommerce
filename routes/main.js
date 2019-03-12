const router = require('express').Router();
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');

const async = require('async');

const stripe = require('stripe')('sk_test_sNn8CrFTtnKxUsIGJqP8U3U8');

function paginate(req, res, next) {
    const perPage = 9;
    const page = req.params.page;

    Product
        .find()
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .exec((err, products) => {
            if(err) return next(err);
            Product.count().exec((err, count) => {
                if(err) return next(err);
                res.render('main/product-main', {
                    products: products,
                    pages: count / perPage
                });
            });
        });
}

Product.createMapping(function(err, mapping) {
    if(err) {
        console.log('error occurred creating mapping');
        console.log(err);
    }else {
        console.log('mapping created');
        console.log(mapping);
    }
});

const stream = Product.synchronize();
let count = 0;

stream.on('data', function() {
  count++;
});

stream.on('close', function() {
  console.log("Indexed " + count + " documents");
});

stream.on('error', function(err) {
  console.log(err);
});

router.get('/cart', (req, res, next) => {
    Cart
        .findOne({ owner: req.user._id })
        .populate('items.item')
        .exec((err, foundCart) => {
            if(err) return next(err);
            res.render('main/cart', {
                foundCart: foundCart,
                message: req.flash('remove')
            });
        });
});

router.post('/product/:product_id', (req, res, next) => {
    Cart.findOne({ owner: req.user._id }, (err, cart) => {
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        });

        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

        cart.save((err) => {
            if(err) return next(err);
            return res.redirect('/cart');
        });
    });
});

router.post('/remove', (req, res, next) => {
    Cart.findOne({ owner: req.user._id }, (err, foundCart) => {
        foundCart.items.pull(String(req.body.item));
        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
        foundCart.save((err, found) => {
            if(err) return next(err);
            req.flash('remove', 'Successfully removed item');
            res.redirect('/cart');
        });
    });
});

router.post('/search', (req, res, next) => {
    res.redirect('/search?q=' + req.body.q);
});

router.get('/search', (req, res, next) => {
    if(req.query.q) {
        Product.search({
            query_string: { query: req.query.q }
        }, (err, results) => {
            if(err) return next(err);
            const data = results.hits.hits.map((hit) => {
                return hit;
            });
            res.render('main/search-result', {
                query: req.query.q,
                data: data
            });
        });
    }
});

router.get('/', (req, res, next) => {
    if(req.user) {
        paginate(req, res, next);
    }else {
        res.render('main/home');
    }
});

router.get('/page/:page', (req, res, next) => {
    paginate(req, res, next);
});

router.get('/products/:page', (req, res, next) => {
    paginate(req, res, next);
});

router.get('/about', (req, res) => {
    res.render('main/about');
});

router.get('/products/:id', (req, res, next) => {
    Product
        .find({ category: req.params.id })
        .populate('category')
        .exec(function(err, products) {
            if(err) return next(err);
            res.render('main/category', {
                products: products
            });
        });
});

router.get('/product/:id', (req, res, next) => {
    Product.findById({ _id: req.params.id }, (err, product) => {
        if(err) return next(err);
        res.render('main/product', {
            product: product
        });
    });
});

router.post('/payment', (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const currentCharges = Math.round(req.body.stripeMoney * 100);

    stripe.customers.create({
        source: stripeToken,
    }).then((customer) => {
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'sek',
            customer: customer.id
        });
    });
    // then((charge) => {
    //     async.waterfall([
    //         function(callback) {
    //             Cart.findOne({ owner: req.user._id }, (err, cart) => {
    //                 callback(err, cart);
    //             });
    //         },
    //         function(cart, callback) {
    //             User.findOne({ _id: req.user._id}, (err, user) => {
    //                 if(user) {
    //                     for(let i = 0; i < cart.length; i++) {
    //                         user.history.push({
    //                             item: cart.items[i].item,
    //                             paid: cart.items[i].price
    //                         });
    //                     }
    //                     user.save((err, user) => {
    //                         if(err) return nwxt(err);
    //                         callback(err, user);
    //                     });
    //                 }
    //             });
    //         },
    //         function(user) {
    //             Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, (err, update) => {
    //                 if(update) {
    //                     res.redirect('/profile');
    //                 }
    //             });
    //         }
    //     ]);
    // });
    res.redirect('/profile');

});

module.exports = router;