const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const getSignToken = require('../../utils/getJWT');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');
const AppError = require('../../utils/appError');
const Contact = require('../../models/contactModel');
const Friend = require('../../models/friendsModel');

//const sendMail = require('../../utils/email');
const handlerFactory = require('../../utils/handlerFactory');

exports.getContactsWithin = catchAsync(async (req,res,next)=>{
    console.log("Aca pasa algo");
    console.log(req.user.currentLocation);
    const [long,lat] = req.user.currentLocation.coordinates;
    const radius = 200000/6378.1;
    console.log(long,lat,radius);
    console.log("Quiero ver que onda");
    const users = await User.find({currentLocation : {$geoWithin : {
      $centerSphere : [[long,lat],radius]
    } }})
    console.log(users);
    
    console.log("Hasta aca llego bien");
   next();
  
  })

  exports.addContact = catchAsync(async (req, res, next) => {
    let contacts = await Contact.findOne({user : req.user._id});
    contacts.contacts.push(req.contact_id);
    await contacts.save();
    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });

 