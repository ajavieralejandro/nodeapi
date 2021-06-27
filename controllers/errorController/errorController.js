const AppError = require('../../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err
  });
};

const handleJWTError = () =>
  new AppError('Invalid Token, please login again.', 401);
const handleJWTExpiredError = () =>
  new AppError('Expired, please login again.', 401);
const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data : ${errors.join(', ')}`;
  return new AppError(message, 404);
};

const handleCastErrorDb = err => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value : ${value}`;
  return new AppError(message, 400);
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  else {
    console.error('ERROR : ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //console.log('Hola estoy entrando acá');
    //console.log(err);
    //console.log(err.name);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    // eslint-disable-next-line no-constant-condition
    if (err.name === 'CastError') error = handleCastErrorDb(error);
    if (err.code === 11000) error = handleDuplicateFieldsDb(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(error);
    //Invalid Token signature
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    //Expired Token
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProduction(error, res);
  }

  next();
};
