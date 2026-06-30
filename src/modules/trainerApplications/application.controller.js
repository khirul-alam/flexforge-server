const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

async function applyAsTrainer(req, res, next) {
  try {
    const db = getDB();
    const { userEmail } = req.body;

    const newApplication = {
      ...req.body,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db.collection('trainerApplications').insertOne(newApplication);

    await db
      .collection('users')
      .updateOne({ email: userEmail }, { $set: { trainerApplicationStatus: 'pending' } });

    successResponse(res, 201, 'Trainer application submitted successfully', result);
  } catch (error) {
    next(error);
  }
}

async function getAllApplications(req, res, next) {
  try {
    const db = getDB();
    const applications = await db
      .collection('trainerApplications')
      .find({ status: 'pending' })
      .toArray();
    successResponse(res, 200, 'Applications fetched successfully', applications);
  } catch (error) {
    next(error);
  }
}

async function approveApplication(req, res, next) {
  try {
    const db = getDB();
    const application = await db
      .collection('trainerApplications')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!application) return errorResponse(res, 404, 'Application not found');

    await db
      .collection('trainerApplications')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'approved' } });

    await db.collection('users').updateOne(
      { email: application.userEmail },
      { $set: { role: 'trainer', trainerApplicationStatus: 'approved' } }
    );

    successResponse(res, 200, 'Trainer application approved');
  } catch (error) {
    next(error);
  }
}

async function rejectApplication(req, res, next) {
  try {
    const db = getDB();
    const { feedback } = req.body;

    const application = await db
      .collection('trainerApplications')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!application) return errorResponse(res, 404, 'Application not found');

    await db
      .collection('trainerApplications')
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: 'rejected', feedback } });

    await db.collection('users').updateOne(
      { email: application.userEmail },
      { $set: { trainerApplicationStatus: 'rejected', adminFeedback: feedback } }
    );

    successResponse(res, 200, 'Trainer application rejected');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  applyAsTrainer,
  getAllApplications,
  approveApplication,
  rejectApplication,
};