const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../constants/jwt')
const { HTTP_STATUS_CODES } = require('../constants/httpStatusCodes')

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(HTTP_STATUS_CODES.OK).send(user);
        })
        .catch((error) => {
          console.log(error)
          if (error.code === 11000) {
            res.status(HTTP_STATUS_CODES.CONFLICT).send({ message: 'Пользователь с таким электронным адресом уже зарегистрирован' });
          } else if (err.name === 'ValidationError') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
          } else {
            res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
          }
        });
    })
    .catch((err) => {
      next((err));
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: "Неправильные почта или пароль" })
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: "Неправильные почта или пароль" })
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });;
          return res.send({ JWT: token })
        });
    })
    .catch((err) => {
      next((err))
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_CODES.OK).send(users);
    })
    .catch((error) => {
      console.log(error)
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const getUserInfo = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ user });
      } else {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' });
      }
    })
    .catch((error) => {
      // Обработка ошибок базы данных или других ошибок
      return res.status(500).send({ message: 'Произошла ошибка при получении информации о пользователе' });
    });
};


const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }

      res.status(HTTP_STATUS_CODES.OK).send(user);
    })
    .catch((error) => {
      console.log(error)
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }

      res.status(HTTP_STATUS_CODES.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error)
      res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(HTTP_STATUS_CODES.OK).send(updatedUser);
    })
    .catch((error) => {
      console.log(error)
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  loginUser,
  getUserInfo
};
