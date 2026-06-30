function verifyRole(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.decoded?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden access: You do not have permission to perform this action',
      });
    }

    next();
  };
}

module.exports = verifyRole;