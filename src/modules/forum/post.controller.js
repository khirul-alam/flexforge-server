const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

async function getAllPosts(req, res, next) {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const postsCollection = db.collection('forumPosts');
    const total = await postsCollection.countDocuments();
    const posts = await postsCollection.find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();

    successResponse(res, 200, 'Forum posts fetched successfully', posts, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

async function getLatestPosts(req, res, next) {
  try {
    const db = getDB();
    const posts = await db.collection('forumPosts').find().sort({ createdAt: -1 }).limit(4).toArray();
    successResponse(res, 200, 'Latest posts fetched successfully', posts);
  } catch (error) {
    next(error);
  }
}

async function getPostById(req, res, next) {
  try {
    const db = getDB();
    const post = await db.collection('forumPosts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return errorResponse(res, 404, 'Post not found');
    successResponse(res, 200, 'Post fetched successfully', post);
  } catch (error) {
    next(error);
  }
}

async function getPostsByAuthor(req, res, next) {
  try {
    const db = getDB();
    const posts = await db.collection('forumPosts').find({ authorEmail: req.params.email }).toArray();
    successResponse(res, 200, 'Author posts fetched successfully', posts);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const db = getDB();
    const newPost = {
      ...req.body,
      likes: [],
      dislikes: [],
      createdAt: new Date(),
    };
    const result = await db.collection('forumPosts').insertOne(newPost);
    successResponse(res, 201, 'Forum post created successfully', result);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const db = getDB();
    await db.collection('forumPosts').deleteOne({ _id: new ObjectId(req.params.id) });
    successResponse(res, 200, 'Post deleted successfully');
  } catch (error) {
    next(error);
  }
}

async function voteOnPost(req, res, next) {
  try {
    const db = getDB();
    const { userEmail, voteType } = req.body;
    const postId = new ObjectId(req.params.id);
    const postsCollection = db.collection('forumPosts');

    const post = await postsCollection.findOne({ _id: postId });
    if (!post) return errorResponse(res, 404, 'Post not found');

    const hasLiked = post.likes?.includes(userEmail);
    const hasDisliked = post.dislikes?.includes(userEmail);

    await postsCollection.updateOne(
      { _id: postId },
      { $pull: { likes: userEmail, dislikes: userEmail } }
    );

    if (voteType === 'like' && !hasLiked) {
      await postsCollection.updateOne({ _id: postId }, { $push: { likes: userEmail } });
    } else if (voteType === 'dislike' && !hasDisliked) {
      await postsCollection.updateOne({ _id: postId }, { $push: { dislikes: userEmail } });
    }

    successResponse(res, 200, 'Vote recorded successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPosts,
  getLatestPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  deletePost,
  voteOnPost,
};