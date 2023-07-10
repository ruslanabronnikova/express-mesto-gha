const mongoose = require('mongoose');
const User = require('../models/user');

const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(HTTP_STATUS_CODES.OK).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_CODES.OK).send(users);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
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
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
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
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
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
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
