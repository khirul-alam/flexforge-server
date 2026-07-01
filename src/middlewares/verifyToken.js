const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Try cookie first, then Authorization header
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers?.authorization?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized access: No token provided' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized access: Invalid token' 
      });
    }
    req.decoded = decoded;
    next();
  });
}

module.exports = verifyToken;