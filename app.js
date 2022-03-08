const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const errorHandler = require('./controllers/errorController/errorController');
var bodyParser = require('body-parser');

//require routes

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const friendsRouter = require('./routes/friendRoutes');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

dotenv.config({
  path: './config.env'
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log(con);
    console.log('Database connected');
  });

//app.use('/api/v1/users', userRouter);
//app.use('/api/v1/admin',adminRouter);
//app.use('/api/v1/friends',friendsRouter);

app.get('/', (req, res) => {
  res.status(200).send('hello from server');
});

app.listen(PORT, () => {
  console.log('Im running');
  console.log(process.env.PEP);
});

app.use(errorHandler);
