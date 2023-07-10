const Card = require('../models/card');
const mongoose = require('mongoose');

const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CODES.OK).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_STATUS_CODES.OK).send(cards);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
      }
    });
};

const deleteCardsId = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }

      res.send({ message: 'Карточка успешно удалена' });
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
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else if (error instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(error);
      } else {
        res.status(HTTP_STATUS_CODES.SERVER_ERROR).send(error);
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
  createCard,
  getCards,
  deleteCardsId,
  likeCard,
  dislikeCard,
};
