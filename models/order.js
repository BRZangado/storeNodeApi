const mongoose = require('mongoose');
const Product = require('./product');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Product'} ],
  total_price:Number
});


module.exports = mongoose.model('Order', orderSchema);
