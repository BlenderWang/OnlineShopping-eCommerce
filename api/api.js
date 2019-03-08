const router = require('express').Router();
const async = require('async');
const faker = require('faker');
const Category = require('../models/category');
const Product = require('../models/product');

router.post('/search', (req, res, next) => {
  console.log(req.body.search_term);

  Product.search({
    query_string: { query: req.body.search_term }
  }, (err, results) => {
    if(err) return next(err);
    res.json(results);
  });
});

router.get('/:name', (req, res, next) => {
    async.waterfall([
      function(callback) {
        Category.findOne({ name: req.params.name }, function(err, category) {
          if (err) return next(err);
          callback(null, category);
        });
      },

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