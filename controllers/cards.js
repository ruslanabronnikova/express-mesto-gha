const Card = require('../models/card');

const createCard = (req, res) => {
  console.log(req.user._id);
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
}

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
}

const deleteCardsId = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }

      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      res.status(400).send(error);
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
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    res.send(updatedCard);
  })
  .catch(error => {
    res.status(400).send(error);
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
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    res.send(updatedCard);
  })
  .catch(error => {
    res.status(400).send(error);
  });
};

module.exports = {
  createCard,
  getCards,
  deleteCardsId,
  likeCard,
  dislikeCard
}