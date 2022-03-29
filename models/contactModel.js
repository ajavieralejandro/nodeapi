const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//const catchAsync = require('../utils/catchAsync');

const contacSchema = new mongoose.Schema({

    user1:{  
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Contacts must belong to an user']
    },
    user2:{  
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Contacts must belong to an user']
    },
    contactDate : {
        type : Date,
        default : Date.now
    }


 
});

const Contact = mongoose.model('Contact', contacSchema);

module.exports = Contact;

