const Cart = require('../models/cart');

module.exports = function(req, res, next) {
    if(req.user) {
        // for a logged in user save the total of prod in the total variable
        let total = 0;
        // use mongo findOne() to search the owner's cart by _id
        Cart.findOne({ owner: req.user._id }, (err, cart) => {
            if(cart) {
                for(let i = 0; i < cart.items.length; i++) {
                    total += cart.items[i].quantity;
                }
                // set a locals.cart variable to store the quantities of the item
                res.locals.cart = total;
            }else {
                res.locals.cart = 0;
            }
            // if cart is not found callback
            next();
        })
    }else {
        next();
    }
}