const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const handleNotFound = require('./routes/errorHandler');
mongoose.connect(`mongodb://127.0.0.1:27017/mestodb`);

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64aad7f463a598b126857c8b'
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(handleNotFound);

app.listen(3000, () => {
  console.log('Привет, я сервер!')
})