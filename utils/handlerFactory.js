const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const APIFeatures = require('./apiFeatures');

exports.deleteById = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError("Doesn't found a document with that id", 404));
    res.status(204).send();
  });

exports.UpdateById = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc)
      return next(new AppError("Doesn't found a document with that id", 404));
    res.status(200).send({
      message: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).send({
      message: 'success',
      data: doc
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No Document found with that ID', 404));
    }
    res.status(200).json({
      status: 'succsess',
      resoults: doc.length,
      data: { doc }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //To allow for nested getReviews on Tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitingFields()
      .pagination();
    const doc = await features.query;
    res.status(200).json({
      status: 'succsess',
      resoults: doc.length,
      data: doc
    });
  });
