const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// POST /api/users  -> create user on registration (default role: user)
async function createUser(req, res, next) {
  try {
    const userData = req.body;
    const db = getDB();
    const usersCollection = db.collection('users');

    const existing = await usersCollection.findOne({ email: userData.email });
    if (existing) {
      return successResponse(res, 200, 'User already exists', existing);
    }

    const newUser = {
      ...userData,
      role: 'user',
      status: 'active',
      trainerApplicationStatus: 'none',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    successResponse(res, 201, 'User created successfully', result);
  } catch (error) {
    next(error);
  }
}

// GET /api/users  -> Admin: get all users (with optional pagination)
async function getAllUsers(req, res, next) {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const usersCollection = db.collection('users');
    const total = await usersCollection.countDocuments();
    const users = await usersCollection.find().skip(skip).limit(limit).toArray();

    successResponse(res, 200, 'Users fetched successfully', users, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/users/:email -> get single user role/info
async function getUserByEmail(req, res, next) {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email: req.params.email });
    if (!user) return errorResponse(res, 404, 'User not found');
    successResponse(res, 200, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/block/:id -> Admin: block a user
async function blockUser(req, res, next) {
  try {
    const db = getDB();
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'blocked' } });
    successResponse(res, 200, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/unblock/:id -> Admin: unblock a user
async function unblockUser(req, res, next) {
  try {
    const db = getDB();
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'active' } });
    successResponse(res, 200, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/make-admin/:id -> Admin: promote user to admin
async function makeAdmin(req, res, next) {
  try {
    const db = getDB();
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role: 'admin' } });
    successResponse(res, 200, 'User promoted to Admin successfully');
  } catch (error) {
    next(error);
  }
}

// PATCH /api/users/demote/:id -> Admin: demote trainer back to user
async function demoteToUser(req, res, next) {
  try {
    const db = getDB();
    await db
      .collection('users')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role: 'user' } });
    successResponse(res, 200, 'Trainer demoted to User successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  blockUser,
  unblockUser,
  makeAdmin,
  demoteToUser,
};