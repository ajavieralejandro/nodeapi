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


exports.addFriend = catchAsync(async (req, res, next) => {
    //busco al usuario y lo agrego a mi lista de amigos
    let friend = await User.findOne({user : req.body.friend_id});
    if(!friend)
    next( new AppError("No user with that id",404));
    let friends = await Friend.findOne({user : req.user._id});
    friends.friends.push(req.friend_id);
    await friends.save();
    res.status(204).json({
      status: 'success',
      data: contacts
    });
    
  });
