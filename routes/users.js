const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { CorrectUrl } = require('../constants/correctUrl');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

// Валидация запроса на получение информации о текущем пользователе
router.get('/me', getUserInfo);

// Остальные роуты без валидации
router.get('/', getUsers);

// Валидация запроса на обновление информации о пользователе
router.patch('/me', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

// Валидация запроса на обновление аватара пользователя
router.patch('/me/avatar', celebrate({
  body: Joi.object({
    avatar: Joi.string().pattern(CorrectUrl),
  }),
}), updateAvatar);

// Валидация запроса на получение пользователя по ID
router.get('/:id', celebrate({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

module.exports = router;
