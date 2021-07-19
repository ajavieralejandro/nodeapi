const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//const catchAsync = require('../utils/catchAsync');

const friendSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Contacts must belong to an user']
    },
    friends:[
        {
            type: mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'A friend must have an id'],
        }
    ]


 
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;

