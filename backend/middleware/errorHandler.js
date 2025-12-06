const logger = require('../utils/logger');
const { formatErrorResponse } = require('../utils/helpers');
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.id
  });

  // Operational errors (known errors)
  if (err.isOperational) {
    const errorResponse = formatErrorResponse(err);
    // Include details if available (for ValidationError)
    if (err.details && Array.isArray(err.details)) {
      errorResponse.error.details = err.details;
    }
    return res.status(err.statusCode).json(errorResponse);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(formatErrorResponse({
      code: 'UNAUTHORIZED',
      message: 'Invalid token'
    }));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(formatErrorResponse({
      code: 'UNAUTHORIZED',
      message: 'Token expired'
    }));
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      }
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json(formatErrorResponse({
      code: 'CONFLICT',
      message: 'Resource already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    }));
  }

  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json(formatErrorResponse({
      code: 'VALIDATION_ERROR',
      message: 'Invalid reference'
    }));
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message
    }
  });
};

module.exports = errorHandler;

