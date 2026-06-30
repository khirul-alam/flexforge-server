const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// GET /api/classes
// Public - All Classes page. Only status: 'approved' shown.
// Challenge Requirement 1: search by name ($regex)
// Challenge Requirement 2: filter by category ($in)
// Challenge Requirement 4: server-side pagination
async function getAllClasses(req, res, next) {
  try {
    const db = getDB();
    const classesCollection = db.collection('classes');

    const { search = '', categories = '', page = 1, limit = 8 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { status: 'approved' };

    if (search) {
      query.className = { $regex: search, $options: 'i' };
    }

    if (categories) {
      const categoryArray = categories.split(',').filter(Boolean);
      if (categoryArray.length > 0) {
        query.category = { $in: categoryArray };
      }
    }

    const total = await classesCollection.countDocuments(query);
    const classes = await classesCollection
      .find(query)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    successResponse(res, 200, 'Classes fetched successfully', classes, {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/classes/all -> Admin: get ALL classes regardless of status (pending/approved/rejected)
async function getAllClassesForAdmin(req, res, next) {
  try {
    const db = getDB();
    const classes = await db.collection('classes').find().sort({ createdAt: -1 }).toArray();
    successResponse(res, 200, 'All classes fetched successfully', classes);
  } catch (error) {
    next(error);
  }
}

// GET /api/classes/featured -> Home page top classes by bookingCount
async function getFeaturedClasses(req, res, next) {
  try {
    const db = getDB();
    const classes = await db
      .collection('classes')
      .find({ status: 'approved' })
      .sort({ bookingCount: -1 })
      .limit(6)
      .toArray();
    successResponse(res, 200, 'Featured classes fetched successfully', classes);
  } catch (error) {
    next(error);
  }
}

// GET /api/classes/:id -> Class Details (Private)
async function getClassById(req, res, next) {
  try {
    const db = getDB();
    const classData = await db.collection('classes').findOne({ _id: new ObjectId(req.params.id) });
    if (!classData) return errorResponse(res, 404, 'Class not found');
    successResponse(res, 200, 'Class fetched successfully', classData);
  } catch (error) {
    next(error);
  }
}

// POST /api/classes -> Trainer: create new class (default status: pending)
async function createClass(req, res, next) {
  try {
    const db = getDB();
    const newClass = {
      ...req.body,
      status: 'pending',
      bookingCount: 0,
      createdAt: new Date(),
    };
    const result = await db.collection('classes').insertOne(newClass);
    successResponse(res, 201, 'Class submitted for approval', result);
  } catch (error) {
    next(error);
  }
}

// GET /api/classes/trainer/:email -> Trainer: my classes
async function getClassesByTrainer(req, res, next) {
  try {
    const db = getDB();
    const classes = await db
      .collection('classes')
      .find({ trainerEmail: req.params.email })
      .toArray();
    successResponse(res, 200, 'Trainer classes fetched successfully', classes);
  } catch (error) {
    next(error);
  }
}

// PATCH /api/classes/:id -> Trainer: update own class
async function updateClass(req, res, next) {
  try {
    const db = getDB();
    await db
      .collection('classes')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    successResponse(res, 200, 'Class updated successfully');
  } catch (error) {
    next(error);
  }
}

// DELETE /api/classes/:id -> Trainer/Admin: delete class
async function deleteClass(req, res, next) {
  try {
    const db = getDB();
    await db.collection('classes').deleteOne({ _id: new ObjectId(req.params.id) });
    successResponse(res, 200, 'Class deleted successfully');
  } catch (error) {
    next(error);
  }
}

// PATCH /api/classes/status/:id -> Admin: approve/reject class
async function updateClassStatus(req, res, next) {
  try {
    const db = getDB();
    const { status } = req.body; // 'approved' | 'rejected'
    await db
      .collection('classes')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status } });
    successResponse(res, 200, `Class ${status} successfully`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllClasses,
  getAllClassesForAdmin,
  getFeaturedClasses,
  getClassById,
  createClass,
  getClassesByTrainer,
  updateClass,
  deleteClass,
  updateClassStatus,
};