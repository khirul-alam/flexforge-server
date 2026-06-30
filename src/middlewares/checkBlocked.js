const { getDB } = require('../config/db');

async function checkBlocked(req, res, next) {
  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: req.decoded?.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Action restricted by Admin',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = checkBlocked;