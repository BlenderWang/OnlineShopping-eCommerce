const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    price: Number,
    image: String
});

// mongoosastic the library used to replicate data from mongodb to elasticsearch
//  helps reducing additional code for connecting to db
ProductSchema.plugin(mongoosastic, {
    hosts: [
      'localhost:9200'  // default for mogosastic
    ]
});

module.exports = mongoose.model('Product', ProductSchema);