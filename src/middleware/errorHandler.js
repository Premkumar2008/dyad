const logger = require('../config/logger');

function handleCastErrorDB(err) {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`
  };
}

function handleDuplicateFieldsDB(err) {
  const duplicateValue = Object.values(err.keyValue || {}).join(', ');
  return {
    statusCode: 409,
    message: `Duplicate field value: ${duplicateValue}. Please use another value.`
  };
}

function handleValidationErrorDB(err) {
  const message = Object.values(err.errors)
    .map((val) => val.message)
    .join('. ');

  return {
    statusCode: 400,
    message: `Validation error: ${message}`
  };
}

function notFound(_req, res) {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
}

function globalErrorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    ({ statusCode, message } = handleCastErrorDB(err));
  } else if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateFieldsDB(err));
  } else if (err.name === 'ValidationError') {
    ({ statusCode, message } = handleValidationErrorDB(err));
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message
  });

  res.status(statusCode).json({
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message
  });
}

module.exports = {
  notFound,
  globalErrorHandler
};
