const { generateToken } = require('../../utils/generateToken');
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

    // Production: send token in response body
    // Development: also set cookie
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!isProduction) {
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'JWT issued',
      token: token  // send in body for production
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res
      .clearCookie('token', { httpOnly: true })
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { issueJWT, logout };