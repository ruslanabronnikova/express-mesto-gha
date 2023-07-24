const Card = require('../models/card');

const BadRequest = require('../classErrors/BadRequest');
const ForBidden = require('../classErrors/ForBidden');
const NotFound = require('../classErrors/NotFound');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      next(error);
    });
};

const deleteCardsId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) throw new NotFound('Карточка с указанным _id не найдена.');

      if (!card.owner.equals(userId)) throw new ForBidden('Нет прав доступа');

      // Удаляем карточку на втором этапе после проверки прав доступа
      return card.deleteOne();
    })
    .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) throw new NotFound('Передан несуществующий _id карточки.');
      res.send(updatedCard);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) throw new NotFound('Передан несуществующий _id карточки.');
      res.send(updatedCard);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardsId,
  likeCard,
  dislikeCard,
};
