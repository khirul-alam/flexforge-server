const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const { getDB } = require('../../config/db');
const { successResponse } = require('../../utils/apiResponse');

const router = express.Router();

router.get('/user/:email', verifyToken, async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const totalBooked = await db.collection('bookings').countDocuments({ userEmail: email });
    const totalFavorites = await db.collection('favorites').countDocuments({ userEmail: email });
    successResponse(res, 200, 'User stats fetched successfully', { totalBooked, totalFavorites });
  } catch (error) {
    next(error);
  }
});

router.get('/trainer/:email', verifyToken, verifyRole(['trainer']), async (req, res, next) => {
  try {
    const db = getDB();
    const email = req.params.email;
    const totalClasses = await db.collection('classes').countDocuments({ trainerEmail: email });

    const trainerClasses = await db.collection('classes').find({ trainerEmail: email }).toArray();
    const classIds = trainerClasses.map((c) => c._id.toString());
    const totalStudents = await db
      .collection('bookings')
      .countDocuments({ classId: { $in: classIds } });

    successResponse(res, 200, 'Trainer stats fetched successfully', { totalClasses, totalStudents });
  } catch (error) {
    next(error);
  }
});

router.get('/admin', verifyToken, verifyRole(['admin']), async (req, res, next) => {
  try {
    const db = getDB();
    const totalUsers = await db.collection('users').countDocuments();
    const totalClasses = await db.collection('classes').countDocuments();
    const totalBookedClasses = await db.collection('bookings').countDocuments();

    successResponse(res, 200, 'Admin stats fetched successfully', {
      totalUsers,
      totalClasses,
      totalBookedClasses,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;