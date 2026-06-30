/**
 * forumPosts collection: { _id, title, image, description, authorEmail,
 *   authorName, authorRole, likes: [String], dislikes: [String], createdAt }
 * comments collection: { _id, postId, userEmail, userName, userImage,
 *   text, parentCommentId, createdAt }
 */
module.exports = {
  postsCollection: 'forumPosts',
  commentsCollection: 'comments',
};