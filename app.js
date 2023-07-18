const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const handleNotFound = require('./routes/errorHandler');
mongoose.connect(`mongodb://127.0.0.1:27017/mestodb`);
const authMiddleW = require('./middlewares/authMiddleW')
const cookieParser = require('cookie-parser');
const {createUser, loginUser} = require('./controllers/users');

app.use(bodyParser.json());

app.use(cookieParser());
app.post('/signin', loginUser);
app.post('/signup', createUser);

app.use(authMiddleW);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(handleNotFound);

app.listen(3000, () => {
  console.log('Привет, я сервер!')
})