const mongoose = require('mongoose');

//const catchAsync = require('../utils/catchAsync');

const locationsSchema = new mongoose.Schema({

  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'A location must belong to an user']
},

    
    currentLocation:{ 
        type: {
          type: String,
          enum: ['Point'],
          default:'Point',
    
        },
        coordinates: {
          type: [Number],
          required:[true,'location must have coodinates']
     
        }
      },
     locationDate:{
         type: Date,
         default : Date.now,

     }


 
});

const Location = mongoose.model('Locations', locationsSchema);

module.exports = Location;

