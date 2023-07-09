const User = require('../models/user');

const createUser = (req, res) => {
  const {name, about, avatar} = req.body; 
  User.create({ name, about, avatar })
  .then((user) => {
    res.send(user)
  })
  .catch((error) => {
    res.status(400).send(error)
  })
}

const getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    res.send(users);
  })
  .catch((error) => {
    res.status(400).send(error);
  });
}

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }

      res.send(user);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }

      res.send(updatedUser);
    })
    .catch(error => {
      res.status(400).send(error);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true }
  )
    .then(updateAvatar => {
      if (!updateAvatar) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.send(updateAvatar);
    })
    .catch(error => {
      res.status(400).send(error);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar
}