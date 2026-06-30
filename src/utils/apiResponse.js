function successResponse(res, statusCode, message, data = null, extra = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  });
}

function errorResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { successResponse, errorResponse };