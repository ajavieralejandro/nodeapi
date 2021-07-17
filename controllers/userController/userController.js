const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Contact = require('../../models/contactModel');
const factory = require('../../utils/handlerFactory');

exports.getUser = factory.getOne(User);
exports.updateUser = factory.UpdateById(User);
exports.deleteUser = factory.deleteById(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findOneAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.addFriend = catchAsync(async (req, res, next) => {
  let contacts = await Contact.findOne({user : req.user._id});
  contacts.contacts.push(req.contact_id);
  await contacts.save();
  res.status(204).json({
    status: 'success',
    data: contacts
  });
  
});

exports.findFriends = catchAsync(async (req, res, next) => {
  let {name} = req.body;
  let users = await User.find({ name: { $regex:name, $options: 'i'}});
  res.status(200).json({
    status: 'success',
    data : {
      users
    }
  });
    
});

exports.getContactsWithin = catchAsync(async (req,res,next)=>{
  
})






