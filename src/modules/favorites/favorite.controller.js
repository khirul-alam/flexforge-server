const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

async function checkFavoriteExists(req, res, next) {
  try {
    const db = getDB();
    const { classId, userEmail } = req.query;
    const existing = await db.collection('favorites').findOne({ classId, userEmail });
    successResponse(res, 200, 'Checked favorite status', { isFavorited: !!existing });
  } catch (error) {
    next(error);
  }
}

async function addFavorite(req, res, next) {
  try {
    const db = getDB();
    const { classId, userEmail } = req.body;

    const existing = await db.collection('favorites').findOne({ classId, userEmail });
    if (existing) {
      return errorResponse(res, 409, 'Already in your favorites');
    }

    const result = await db.collection('favorites').insertOne({ ...req.body, createdAt: new Date() });
    successResponse(res, 201, 'Successfully added to your favorites!', result);
  } catch (error) {
    next(error);
  }
}

async function getFavoritesByUser(req, res, next) {
  try {
    const db = getDB();
    const favorites = await db.collection('favorites').find({ userEmail: req.params.email }).toArray();
    successResponse(res, 200, 'Favorites fetched successfully', favorites);
  } catch (error) {
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const db = getDB();
    await db.collection('favorites').deleteOne({ _id: new ObjectId(req.params.id) });
    successResponse(res, 200, 'Removed from favorites');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkFavoriteExists,
  addFavorite,
  getFavoritesByUser,
  removeFavorite,
};