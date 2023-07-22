const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { CorrectUrl } = require('../constants/correctUrl');
const {
  createCard,
  getCards,
  deleteCardsId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
// Валидация запроса на создание карточки
router.post('/', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(CorrectUrl),
  }),
}), createCard);

// Валидация запроса на удаление карточки
router.delete('/:cardId', celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), deleteCardsId);

// Валидация запроса на добавление лайка на карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);

// Валидация запроса на удаление лайка с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

// Остальные роуты без валидации
router.get('/', getCards);

module.exports = router;
