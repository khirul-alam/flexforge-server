const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const verifyRole = require('../../middlewares/verifyRole');
const checkBlocked = require('../../middlewares/checkBlocked');

const {
  getAllPosts,
  getLatestPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  deletePost,
  voteOnPost,
} = require('./post.controller');

const {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
} = require('./comment.controller');

const router = express.Router();

router.get('/posts', getAllPosts);
router.get('/posts/latest', getLatestPosts);
router.get('/posts/author/:email', verifyToken, verifyRole(['trainer']), getPostsByAuthor);
router.get('/posts/:id', verifyToken, getPostById);
router.post('/posts', verifyToken, verifyRole(['trainer', 'admin']), createPost);
router.delete('/posts/:id', verifyToken, verifyRole(['trainer', 'admin']), deletePost);
router.patch('/posts/:id/vote', verifyToken, checkBlocked, voteOnPost);

router.get('/comments/:postId', verifyToken, getCommentsByPost);
router.post('/comments', verifyToken, checkBlocked, addComment);
router.patch('/comments/:id', verifyToken, updateComment);
router.delete('/comments/:id', verifyToken, deleteComment);

module.exports = router;