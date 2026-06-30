const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const checkBlocked = require('../../middlewares/checkBlocked');
const {
  createPaymentIntent,
  saveTransaction,
  getAllTransactions,
} = require('./payment.controller');

const router = express.Router();

router.post('/create-payment-intent', verifyToken, checkBlocked, createPaymentIntent);
router.post('/', verifyToken, checkBlocked, saveTransaction);
router.get('/', verifyToken, verifyRole(['admin']), getAllTransactions);

module.exports = router;