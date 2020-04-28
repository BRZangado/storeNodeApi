const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order.find()
  .populate('products', 'name price')
  .exec()
  .then(docs => {
    res.status(200).json(docs);
  })
  .catch(err =>{
    res.status(500).json({error:err});
  });
});

router.post('/', async (req, res, next) => {

  var products_ids = req.body.productsIds;
  var validated_ids = [];
  var total = 0;

  for(id of products_ids){
    await Product.findById(id)
    .exec()
    .then(doc => {
      if(doc){
        total = total + doc.price;
        validated_ids.push(doc._id);
      }
    });
  }

  if(validated_ids.length > 0){

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      products:validated_ids,
      total_price:total
    });
  
    newOrder.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({error:err});
    });

  }
  else{
    res.status(404).json({
      error:"Products not found"
    });
  }

});

router.get('/:orderId', (req, res, next) => {
  let id = req.params.orderId;
  Order.findById(id)
  .populate('products')
  .exec()
  .then(doc => {
    if(doc){
      res.status(200).json(doc);
    }
    else{
      res.status(404).json({
        error:"Order not found"
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      error:err
    });
  });
});

router.delete('/:orderId', (req, res, next) => {
  let id = req.params.orderId;
  Order.remove({_id:id})
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err =>{
    res.status(500).json({error:err});
  });
});

module.exports = router;
