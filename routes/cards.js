const router = require('express').Router();
const authMiddleW = require('../middlewares/authMiddleW')

const { createCard, getCards, deleteCardsId, likeCard, dislikeCard } = require('../controllers/cards')

router.post('/', authMiddleW, createCard);

router.get('/', authMiddleW, getCards);

router.delete('/:cardId', authMiddleW, deleteCardsId);

router.put('/:cardId/likes', authMiddleW, likeCard);

router.delete('/:cardId/likes', authMiddleW, dislikeCard);

module.exports = router;