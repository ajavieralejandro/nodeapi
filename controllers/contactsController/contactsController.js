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
const Handler = require('../../utils/handlerFactory');

//const sendMail = require('../../utils/email');
const handlerFactory = require('../../utils/handlerFactory');

exports.getContactsWithin = catchAsync(async (req,res,next)=>{
    if(!req.user.currentLocation.coordinates)
        return next(new AppError("Update user cordinates",400));
        //testing dates comparassion
    const _currentDate = req.user.currentLocationDate;
    const _date1 = new Date(_currentDate.getTime()-(30*60*1000)) ;
    const _date2 = new Date(_currentDate.getTime()+(30*60*1000)) ;
    const [long,lat] = req.user.currentLocation.coordinates;
    const radius = 200000/6378.1;
    const contactsWithin = await Contact.find({currentLocation : {$geoWithin : {
      $centerSphere : [[long,lat],radius]
    },
}
   ,currentLocationDate: {$gte:_date1,$lte:_date2}

})
    res.status(200).json({
        status: 'success',
        data: contactsWithin
      });
  
  })

  //A implementar

  exports.updateContacts = catchAsync(async (req,res,next)=>{
    let contacts = await Contact.findOne({user : req.user._id});
    contacts.contacts.forEach(contact =>
        console.log(contact)
        );
    res.status(200).json({
        status: 'success',
        data: null
      });



  });



  //Falta testear
  exports.addContact = catchAsync(async (req, res, next) => {
    let contacts = await Contact.findOne({user : req.user._id});
    let user = await User.findById(req.contac_id);
    if(!user)
        return next(new AppError("No user with that id",400));
    contacts.contacts.push(req.contact_id);
    await contacts.save();
    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });


  //Get Contacts Falta Testear
  exports.getContacts = catchAsync(async (req, res, next) => {
    let contacts = await Contact.findOne({user : req.user._id});
    //let contactsAux = await  Handler.getOne(Contact,req.user._id);

    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });




  //Solo una aparición por contacto
  exports.addContacts = catchAsync(async (req, res, next) => {
    let {users} = req.body;
    let contacts = null;
    if(users){
         let _aux = [];
         contacts = await Contact.findOne({user : req.user._id});
         for(user of users){
             let _user = await User.findById(user);
             if(!_user)
                return next(new AppError("No user with that id",400));
             if(!contacts.contacts.includes(_user._id)) contacts.contacts.push(_user._id);
         }
    await contacts.save();

    }
    
    res.status(200).json({
      status: 'success',
      data: contacts.contacts
    });
    
  });

  exports.test = catchAsync(async (req,res,next)=>{
    res.status(204).json({
        status: 'success',
        message : 'hola'
      });
  })


 