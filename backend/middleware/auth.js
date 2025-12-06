const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authentication token required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Authentication token required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user still exists and is active
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (!user.is_active) {
        throw new AuthenticationError('User account is inactive');
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      // Add company_id for HR users
      if (user.role === 'hr') {
        const { HRUser } = require('../models');
        const hrUser = await HRUser.findOne({
          where: { user_id: user.id, is_active: true }
        });
        if (hrUser) {
          req.user.company_id = hrUser.company_id;
          req.user.hr_user_id = hrUser.id;
        }
      }

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Invalid or expired token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't throw error if no token
const authenticateOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(); // No token, continue without user
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user still exists and is active
      const user = await User.findByPk(decoded.id);
      
      if (user && user.is_active) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        };

        // Add company_id for HR users
        if (user.role === 'hr') {
          const { HRUser } = require('../models');
          const hrUser = await HRUser.findOne({
            where: { user_id: user.id, is_active: true }
          });
          if (hrUser) {
            req.user.company_id = hrUser.company_id;
            req.user.hr_user_id = hrUser.id;
          }
        }
      }
    } catch (error) {
      // Invalid token, but continue without user (don't throw error)
      // This allows public access to jobs
    }

    next();
  } catch (error) {
    next(); // Continue even on error for optional auth
  }
};

module.exports = authenticate;
module.exports.optional = authenticateOptional;

