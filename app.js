const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const port = 3000;
const errorHandler = require('./controllers/errorController/errorController');

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

app.get('/', (req, res) => {
  res.status(200).send('hello from server');
});

app.listen(port, () => {
  console.log('Im running');
  console.log(process.env.PEP);
});

app.use(errorHandler);
