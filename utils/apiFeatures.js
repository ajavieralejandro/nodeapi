class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //console.log('Hola esty en el metodo');
    //console.log(this.queryString);
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    //console.log(queryObject);
    const excludeField = ['page', 'sort', 'limit', 'fields'];
    excludeField.forEach(el => delete queryObject[el]);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    if (queryObject.sort) {
      //let sortString = JSON.stringify(req.query.sort);
      //sortString = sortString.replace(',', ' ');
      const sortBy = queryObject.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      //We still wanting to sorting the query
      this.query.sort('-createdAt');
    }

    return this;
  }

  pagination() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    const page = queryObject.page * 1 || 1;
    const limit = queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }

  limitingFields() {
    //3) Limiting fields
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    if (queryObject.fields) {
      const fields = queryObject.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      //I want to exclude internal moongosse from the schema
      this.query.select('-__v');
    }
    return this;
  }

  deleteById = Model =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc)
        return next(new AppError("Doesn't found a document with that id", 404));
      res.status(204).send();
    });
}

module.exports = APIFeatures;
