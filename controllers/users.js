const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../constants/jwt');

const BadRequest = require('../classErrors/BadRequest');
const NotFound = require('../classErrors/NotFound');
const UnAuthorized = require('../classErrors/UnAuthorized');
const Conflict = require('../classErrors/Conflict');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(200).send(user);
        })
        .catch((error) => {
          console.log(error)
          if (error.code === 11000) {
            next(new Conflict('Пользователь с таким электронным адресом уже зарегистрирован'));
          } else if (error.name === 'ValidationError') {
            next(new BadRequest('Невалидные данные'));
          } else {
            next(error)
          }
        });
    })
    .catch((error) => {
      next((error));
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnAuthorized('Неправильные почта или пароль');
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnAuthorized('Неправильные почта или пароль');
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });;
          return res.send({ JWT: token })
        });
    })
    .catch((error) => {
      next((error))
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error)
      if (error.name === 'ValidationError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error)
      }
    });
};

const getUserInfo = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ user });
      } else throw new NotFound('Пользователь с указанным id не найден');
    })
    .catch((error) => {
      console.log(error)
      next(error)
    });
};


const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(user);
    })
    .catch((error) => {
      console.log(error)
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error)
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
      if (!updatedUser) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(updatedUser);
    })
    .catch((error) => {
      console.log(error)
      next(error)
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
      if (!updatedUser) throw new NotFound('Пользователь с указанным id не найден');
      res.status(200).send(updatedUser);
    })
    .catch((error) => {
      console.log(error)
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error)
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
