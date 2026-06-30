const { generateToken, cookieOptions } = require('../../utils/generateToken');
const { getDB } = require('../../config/db');

async function issueJWT(req, res, next) {
  try {
    const { email } = req.body;
    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = generateToken({ email: user.email, role: user.role });

    res.cookie('token', token, cookieOptions).status(200).json({ success: true, message: 'JWT issued' });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res
      .clearCookie('token', { ...cookieOptions, maxAge: 0 })
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { issueJWT, logout };