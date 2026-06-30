/**
 * classes collection — schema reference
 * {
 *   _id, className, image, category, difficultyLevel, duration,
 *   schedule: { days: [String], time: String },
 *   price, description, trainerEmail, trainerName,
 *   status: 'pending' | 'approved' | 'rejected',
 *   bookingCount, createdAt
 * }
 */
module.exports = { collectionName: 'classes' };