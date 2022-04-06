const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const factory = require('../../utils/handlerFactory');
const AppError = require('../../utils/appError');
const Location = require('../../models/locationsModel');

exports.getUser = factory.getOne(User);


exports.updateUser = catchAsync(async (req,res,next)=>{
  const filterObj = factory.filterObject(req.body,'name','email','risk_status');  
  let doc = await User.findOneAndUpdate({_id : req.user._id}, filterObj, {
    new: true,
    runValidators: true
  });
  if (!doc)
    return next(new AppError("Doesn't found a user with that id, please login again", 404));
  res.status(200).send({
    message: 'success',
    data: doc
  });

})
exports.deleteUser = factory.deleteById(User);


exports.setCurrentLocation = catchAsync(async (req,res,next)=>{
  if(req.body.latitude==undefined || req.body.longitude==undefined)
    return next(new AppError("Send latitude and longitude to update location",400));
  let toUpdate =  {
    "type" : "Point",
    "coordinates" : [
      req.body.latitude,
      req.body.longitude
    ]
  };  
  
  let user = await User.findOne({_id : req.user._id});
  if (!user)
    return next(new AppError("Doesn't found a user with that id, please login again", 404));
  user.currentLocation = toUpdate;
  user.currentLocationDate = Date.now(); 
  //agrego la nueva locacion
  const _location = new Location({
      user : user._id,
      currentLocation : toUpdate,
      locationDate : user.currentLocationDate
      
  });
  await _location.save();
  await user.save({ validateBeforeSave: false });

  res.status(200).send({
    message: 'success',
    data: _location
  });



})




exports.getLocations = catchAsync(async (req,res,next)=>{
  console.log("Estoy en get locations");
  var ObjectId = require('mongoose').Types.ObjectId; 
  const _date1 = new Date(new Date().getTime()-(5*24*60*60*1000));

  let user = req.user;
  let locations = await Location.find({user : new ObjectId(user.id),locationDate: {$gte:_date1}});
  res.status(200).json({
    status: 'success',
    data : locations
  });
  
})




exports.updateLocations = catchAsync(async (req,res,next)=>{
  console.log("Estoy en update locations 2");
  let user = req.user;
  let locations = await Location.find({_id: req.user._id});
  console.log("locations es :",locations);
  user.locations = locations.filter(location=>
    location.currentDate>Date.now()-1000 * 60 * 60 * 24 * 0.5);
  locations = user.locations;
  res.status(200).json({
    status: 'success',
    data : {
      locations
    }
  });
  
})



exports.getContactsWithin = catchAsync(async (req,res,next)=>{
  //console.log("Aca pasa algo");
  //console.log(req.user.currentLocation);
  const [long,lat] = req.user.currentLocation.coordinates;
  const radius = 30/6378.1;
  //console.log(long,lat,radius);
  //console.log("Quiero ver que onda");
  const aux = Date.now();

  //debugin code

  //let {currentLocationDate} = req.user;
  //console.log("current Location date es : ",req.user.currentLocationDate);
  let aux2  = (req.user.currentLocationDate - (new Date()-30*600000));
  console.log(aux2);

  const users = await User.find({currentLocation : {$geoWithin : {
    $centerSphere : [[long,lat],radius],
  },
}

})

console.log(req.user.currentLocationDate);
console.log("A ver ahora : ",req.user.currentLocationDate>new Date()-35*6000);
const userAux = await User.find({ currentLocationDate: {$lte: (new Date()-35*60000)}});
console.log(userAux);
 next();
});



exports.getRedLocations = catchAsync(async (req,res,next)=>{
  
  const [long,lat] = req.user.currentLocation.coordinates;
  const radius = 30000/6378.1;
  const aux = new Date().getTime();
  const _date1 = new Date((aux)-(7 * 24 * 60 * 60 * 1000));


  let users = await Location.find({currentLocation : {$geoWithin : {
    $centerSphere : [[long,lat],radius],
  }

}
,locationDate: {$gte:_date1}


}).populate('user');

users = users.filter(user =>
  user.user.risk_status==="red"
);
let toSend = [];

 users.forEach(user =>{
   toSend.push(user.currentLocation);
 });

res.status(200).json({
  status: 'success',
  data: toSend
});



 

});








