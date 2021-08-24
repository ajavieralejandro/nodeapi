const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//const catchAsync = require('../utils/catchAsync');

const contacSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Contacts must belong to an user']
    },
    currentLocation:{ 
        type: {
          type: String,
          enum: ['Point'],
          default:'Point',
    
        },
        coordinates: {
          type: [Number],
          required:[true,'User contatac must have a current location']
     
        }
      },
    currentLocationDate:Date,
    contacts:[
        {
            type: mongoose.Schema.ObjectId,
            ref:'User',
            required:[true,'A friend must have an id'],
            date : Date.now()
        }
    ]


 
});

const Contact = mongoose.model('Contact', contacSchema);

module.exports = Contact;

