const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

async function getCommentsByPost(req, res, next) {
  try {
    const db = getDB();
    const comments = await db
      .collection('comments')
      .find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .toArray();
    successResponse(res, 200, 'Comments fetched successfully', comments);
  } catch (error) {
    next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const db = getDB();
    const newComment = { ...req.body, createdAt: new Date() };
    const result = await db.collection('comments').insertOne(newComment);
    successResponse(res, 201, 'Comment added successfully', result);
  } catch (error) {
    next(error);
  }
}

async function updateComment(req, res, next) {
  try {
    const db = getDB();
    const { text, userEmail } = req.body;

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(req.params.id) });
    if (!comment) return errorResponse(res, 404, 'Comment not found');
    if (comment.userEmail !== userEmail) {
      return errorResponse(res, 403, 'You can only edit your own comments');
    }

    await db.collection('comments').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { text } });
    successResponse(res, 200, 'Comment updated successfully');
  } catch (error) {
    next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    const db = getDB();
    const { userEmail } = req.query;

    const comment = await db.collection('comments').findOne({ _id: new ObjectId(req.params.id) });
    if (!comment) return errorResponse(res, 404, 'Comment not found');
    if (comment.userEmail !== userEmail) {
      return errorResponse(res, 403, 'You can only delete your own comments');
    }

    await db.collection('comments').deleteOne({ _id: new ObjectId(req.params.id) });
    successResponse(res, 200, 'Comment deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
};