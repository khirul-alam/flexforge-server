const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const checkBlocked = require('../../middlewares/checkBlocked');
const {
  checkFavoriteExists,
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
} = require('./favorite.controller');

const router = express.Router();

router.get('/check', verifyToken, checkFavoriteExists);
router.post('/', verifyToken, checkBlocked, addFavorite);
router.get('/user/:email', verifyToken, getFavoritesByUser);
router.delete('/:id', verifyToken, removeFavorite);

module.exports = router;