/**
 * users collection — schema reference
 * {
 *   _id, name, email, image,
 *   role: 'user' | 'trainer' | 'admin',
 *   status: 'active' | 'blocked',
 *   trainerApplicationStatus: 'none' | 'pending' | 'approved' | 'rejected',
 *   adminFeedback, createdAt
 * }
 */
module.exports = { collectionName: 'users' };