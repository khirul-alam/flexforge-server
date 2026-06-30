const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const checkBlocked = require('../../middlewares/checkBlocked');
const {
  checkBookingExists,
  createBooking,
  getBookingsByUser,
  getBookingsByClass,
} = require('./booking.controller');

const router = express.Router();

router.get('/check', verifyToken, checkBookingExists);
router.post('/', verifyToken, checkBlocked, createBooking);
router.get('/user/:email', verifyToken, getBookingsByUser);
router.get('/class/:classId', verifyToken, verifyRole(['trainer']), getBookingsByClass);

module.exports = router;