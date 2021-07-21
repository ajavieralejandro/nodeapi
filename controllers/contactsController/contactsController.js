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
    if(!req.user.currentLocation.cordinates)
        next(new AppError("Update user cordinates",400));
    const [long,lat] = req.user.currentLocation.coordinates;
    const radius = 200000/6378.1;
    const contactsWithin = await User.find({currentLocation : {$geoWithin : {
      $centerSphere : [[long,lat],radius]
    } }})
    res.status(204).json({
        status: 'success',
        data: contactsWithin
      });
  
  })

  //Falta chequear que el id del contacto a agregar sea el correto...
  exports.addContact = catchAsync(async (req, res, next) => {
    let contacts = await Contact.findOne({user : req.user._id});
    contacts.contacts.push(req.contact_id);
    await contacts.save();
    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });

  exports.addContacts = catchAsync(async (req, res, next) => {
    let {users} = req;
    let contacts = await Contact.findOne({user : req.user._id});
    users.forEach(user => {
        const aux = User.findById(user._id);
        if(!aux)
            next(new AppError("No user with that id"));
        conctacs.push(user._id);
    }
    )
    await contacts.save();
    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });


 