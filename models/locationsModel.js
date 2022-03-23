const mongoose = require('mongoose');

//const catchAsync = require('../utils/catchAsync');

const locationsSchema = new mongoose.Schema({

    
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

