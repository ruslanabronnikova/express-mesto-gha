const mongoose = require('mongoose');
const Card = require('../models/card');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

const createCard = (req, res) => {
  console.log(req.user._id);
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CODES.OK).send(card);
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_STATUS_CODES.OK).send(cards);
    })
    .catch((error) => {
      console.log(error)
      res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCardsId = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }

      const { owner: cardOwnerId } = card;
      if (cardOwnerId.valueOf() !== userId){
        return res.status(403).send({message: 'Нет прав доступа'});
      }
      res.send({ message: 'Карточка успешно удалена' });  
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send(updatedCard);
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      res.send(updatedCard);
    })
    .catch((error) => {
      console.log(error)
      if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send({ message: 'Невалидные данные' });
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
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
