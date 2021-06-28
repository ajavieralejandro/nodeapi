const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
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
