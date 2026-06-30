const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

async function checkBookingExists(req, res, next) {
  try {
    const db = getDB();
    const { classId, userEmail } = req.query;
    const existing = await db.collection('bookings').findOne({ classId, userEmail });
    successResponse(res, 200, 'Checked booking status', { alreadyBooked: !!existing });
  } catch (error) {
    next(error);
  }
}

async function createBooking(req, res, next) {
  try {
    const db = getDB();
    const bookingData = req.body;

    const existing = await db
      .collection('bookings')
      .findOne({ classId: bookingData.classId, userEmail: bookingData.userEmail });

    if (existing) {
      return errorResponse(res, 409, 'You have already booked this class');
    }

    const result = await db.collection('bookings').insertOne({
      ...bookingData,
      createdAt: new Date(),
    });

    await db
      .collection('classes')
      .updateOne({ _id: new ObjectId(bookingData.classId) }, { $inc: { bookingCount: 1 } });

    successResponse(res, 201, 'Class booked successfully', result);
  } catch (error) {
    next(error);
  }
}

async function getBookingsByUser(req, res, next) {
  try {
    const db = getDB();
    const bookings = await db.collection('bookings').find({ userEmail: req.params.email }).toArray();
    successResponse(res, 200, 'Bookings fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
}

async function getBookingsByClass(req, res, next) {
  try {
    const db = getDB();
    const bookings = await db.collection('bookings').find({ classId: req.params.classId }).toArray();
    successResponse(res, 200, 'Attendees fetched successfully', bookings);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkBookingExists,
  createBooking,
  getBookingsByUser,
  getBookingsByClass,
};