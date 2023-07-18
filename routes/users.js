const router = require('express').Router();

const authMiddleW = require('../middlewares/authMiddleW')

const { getUsers, getUserById, updateUser, updateAvatar, getUserInfo } = require('../controllers/users')

router.get('/', authMiddleW, getUsers);

router.get('/:id', authMiddleW, getUserById);

router.get('/users/me', authMiddleW, getUserInfo)

router.patch('/me', authMiddleW, updateUser);

router.patch('/me/avatar', authMiddleW, updateAvatar);


module.exports = router;