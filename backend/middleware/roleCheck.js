const { AuthorizationError } = require('../utils/errors');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthorizationError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

const requireStudent = requireRole('student');
const requireHR = requireRole('hr');
const requireAdmin = requireRole('admin');

module.exports = {
  requireRole,
  requireStudent,
  requireHR,
  requireAdmin
};

