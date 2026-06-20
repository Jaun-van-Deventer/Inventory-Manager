const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  whereToBuy: {
    type: String, 
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);