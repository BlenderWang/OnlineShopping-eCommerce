const router = require('express').Router();
const async = require('async');
const faker = require('faker/locale/sv');
const Category = require('../models/category');
const Product = require('../models/product');

// /api/search
router.post('/search', (req, res, next) => {
  console.log(req.body.search_term);

  // use mongosastic feature seach based on 'search_term'
  Product.search({
    query_string: { query: req.body.search_term }
  }, (err, results) => {
    if(err) return next(err);
    res.json(results);
  });
});

// search a prod by its name
router.get('/:name', (req, res, next) => {
    // runnint 2 asyn fn
    async.waterfall([
      // fn index[0]
      function(callback) {
        Category.findOne({ name: req.params.name }, function(err, category) {
          if (err) return next(err);
          // the result goes to callback
          callback(null, category);
          // this callback leads to the 2nd fn
        });
      },

      // fn index[1]
      function(category, callback) {
        for (let i = 0; i < 20; i++) {
          let product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();

          product.save();
        }
      }
    ]);
    res.json({ message: 'Success' });
});

module.exports = router;