const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
//const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name'],
  },
  lastName: {
    type: String,
    required: [true, 'A User must have a last names'],
  },
  
  email: {
    type: String,
    trim: true,
    lowercase: true, //not a validator
    unique: true,
    required: [true, 'Email address is required'],
    validate: [validator.isEmail, 'Please provide a valid email'],
    /*match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],*/
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user','admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  risk_status:{
    type:String,
    enum:['red','yellow','green'],
    default:'green'
  },
  currentLocation:{ 
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    }

  },
currentLocationDate:{
  type : Date
},
  locations : Array
  
});

userSchema.index({currentLocation : '2dsphere'});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// eslint-disable-next-line prefer-arrow-callback
userSchema.methods.comparePassword = async function comparePassword(
  password,
  userPassword
) {
  return bcrypt.compare(password, userPassword);
};

userSchema.methods.changedPassword = function (JWTTime) {
  let toR = false;
  if (JWTTime < this.passwordChangedAt.getTime() / 1000) toR = true;
  return toR;
};


userSchema.methods.createPasswordResetToken = function () {
  //Save the token hashed in the db and returns the resetToken
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  //Console logs for debug
  //console.log('El token hasheado es : ', this.passwordResetToken);
  //console.log('El token a retornar es : ', resetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
  