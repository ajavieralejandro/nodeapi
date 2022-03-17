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

const createSendToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_COKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'PRODUCTION') cookieOptions.secure = true;
  //generate a token with the user id in the database
  const token = getSignToken(user._id);
  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'succsess',
    token,
    data: { user }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //bad practice
  //const newUser = await User.create(req.body);
  //new code
 ;

  const newUser = await User.create({
    name: req.body.name,
    lastName : req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  //Creo las listas de contactos estrechos y amigos 
  await Contact.create({
    user : newUser.id
  });
  await Friend.create({
    user : newUser.id
  })

  createSendToken(newUser, 201, res);
});



exports.getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitingFields()
    .pagination();
  const users = await features.query;

  res.status(200).json({
    status: 'succsess',
    resoults: users.length,
    data: { users }
  });
});



exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exists
  if (!email || !password)
    return next(new AppError('Please provide email and password!', 404));
  //2) check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect password or email', 404));
  }
  createSendToken(user, 200, res);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  //checking t2hat the token exist
  console.log("hola 1");
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new AppError('You are not logged!', 401));
  console.log("hola 2");

  //2)Verification Token
  
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("hola 3");

  const user = await User.findById(decoded.id).select('+password');
  if (!user) return next(new AppError('The user not longer exists', 401));
  if (user.changedPassword(decoded.iat))
    return next(new AppError('The Token is not longer valid', 401));
  req.user = user;
  next();
});

//should have an user added to the req first
exports.restrictTo = (...roles) => (req, _res, next) => {
  console.log("Hola aparezco aca");
  //
  if (!req.user)
    return next(
      new Error('Not user in the request,need to protect route first', 401)
    );
  if (!roles.includes(req.user.role))
    return next(
      new AppError("Don't have permission to perform this action", 403)
    );
  next();
};


exports.resetPassword = catchAsync(async (req, res, next) => {
  //console.log('RESET PASSWORD');
  //console.log('El token es : ', req.params.token);
  //1)get user based in the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //console.log('El token hasheado es  : ', hashToken);
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });
  if (!user)
    return next(
      new AppError('Token is invalid or expired, please try again !', 400)
    );
  //2)if token has no expired set new password
  const { password, passwordConfirm } = req.body;
  if (!req.body.password || !req.body.passwordConfirm)
    return next(
      new AppError('Please  give a password and a passwordConfirm', 404)
    );
  if (req.body.password !== req.body.passwordConfirm)
    return next(
      new AppError('password and passwordConfirm are not the same', 404)
    );
  user.passwordChangedAt = Date.now() - 1000;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();
  createSendToken(user, 200, res);
});

exports.deleteUser = handlerFactory.deleteById(User);

exports.updatePassword = catchAsync(async (req, res, next) => {
  //console.log('Hi im on the update password route');
  //console.log(req);
  //1) Get user from collection
  const { user } = req;
  //2) check if posted password is correct
  const { oldPassword, password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm || !oldPassword)
    return next(
      new AppError(
        'Please  give a password, passwordConfirm and the old password',
        404
      )
    );
  if (password !== passwordConfirm)
    return next(
      new AppError('password and passwordConfirm are not the same', 404)
    );
  if (!(await user.comparePassword(oldPassword, user.password))) {
    return next(new AppError('Old password is not correct', 404));
  }
  //3)Update password
  user.password = password;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save({ validateBeforeSave: false });
  //4)Send Token
  createSendToken(user, 200, res);
});
