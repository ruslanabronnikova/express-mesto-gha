const router = require('express').Router();

const { createCard, getCards, deleteCardsId, likeCard, dislikeCard } = require('../controllers/cards')

router.post('/', createCard);

router.get('/', getCards);

router.delete('/:cardId', deleteCardsId);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;