const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

    User.find({email:req.body.email})
    .exec()
    .then(doc => {
        if(doc.length >= 1){
            console.log(doc);
            return res.status(409).json({
                message:"User with email " + doc[0].email + " already created"
            });
        }
        else{

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({error:err});
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message:"User created"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error:err
        });
    });

});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id:id})
    .exec()
    .then(result => {
        res.result(200).json(result);
    })
    .catch(err => {
        res.status(500).json({error:err});
    });
});

module.exports = router;