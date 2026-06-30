const jwt = require('jsonwebtoken');

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
};

module.exports = { generateToken, cookieOptions };