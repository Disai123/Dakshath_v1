const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const bcrypt = require('bcryptjs');
const { User, HRUser } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { AuthenticationError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Generate JWT token
 */
const generateToken = (user, hrUser = null) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  if (hrUser) {
    payload.company_id = hrUser.company_id;
    payload.hr_user_id = hrUser.id;
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'is_active', 'last_login']
    });

    let responseData = user.toJSON();

    // Add HR-specific data if user is HR
    if (user.role === 'hr') {
      const hrUser = await HRUser.findOne({
        where: { user_id: user.id, is_active: true },
        include: [{ association: 'company', attributes: ['id', 'company_name', 'logo_url'] }]
      });

      if (hrUser) {
        responseData.company = hrUser.company;
        responseData.hr_user_id = hrUser.id;
      }
    }

    res.json(formatResponse(responseData));
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth initiation
 */
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

/**
 * Google OAuth callback (Students only)
 */
const googleCallback = async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    try {
      // Google OAuth is only for students
      if (user.role !== 'student') {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_login_students_only`);
      }

      // Check if user is active
      if (!user.is_active) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=account_inactive`);
      }

      // Generate token
      const token = generateToken(user);

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * Student Login (using LMS credentials - email/password)
 */
const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    
    logger.info(`Student login attempt for email: ${email.toLowerCase().trim()}, user found: ${!!user}`);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is a student
    if (user.role !== 'student') {
      throw new AuthenticationError('This login is for students only');
    }

    // Check if user has a password set
    if (!user.password) {
      throw new AuthenticationError('Password not set. Please use Google login or contact admin.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated. Please contact admin.');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user);

    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      token
    };
    
    logger.info(`Student login successful for: ${user.email}`);
    res.json(formatResponse(responseData, 'Login successful'));
  } catch (error) {
    logger.error(`Student login error: ${error.message}`, { error: error.stack });
    next(error);
  }
};

/**
 * HR Login (email/password)
 */
const hrLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    
    logger.info(`HR login attempt for email: ${email.toLowerCase().trim()}, user found: ${!!user}`);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is HR
    if (user.role !== 'hr') {
      throw new AuthenticationError('This login is for HR users only');
    }

    // Check if user has a password set
    if (!user.password) {
      throw new AuthenticationError('Password not set. Please contact admin.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated. Please contact admin.');
    }

    // Get HR user data
    const hrUser = await HRUser.findOne({
      where: { user_id: user.id, is_active: true },
      include: [{ association: 'company', attributes: ['id', 'company_name', 'logo_url', 'status'] }]
    });

    if (!hrUser) {
      throw new AuthenticationError('HR user account not found or inactive');
    }

    // Check if company is active
    if (hrUser.company.status !== 'active') {
      const statusMessages = {
        pending: 'Your company registration is pending admin approval. Please wait for approval before logging in.',
        rejected: 'Your company registration has been rejected. Please contact admin for more information.',
        suspended: 'Your company account has been suspended. Please contact admin.'
      };
      throw new AuthenticationError(
        statusMessages[hrUser.company.status] || 'Company account is not active. Please contact admin.'
      );
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user, hrUser);

    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        company: hrUser.company
      },
      token
    };
    
    logger.info(`HR login successful for: ${user.email}, company: ${hrUser.company.company_name}`);
    res.json(formatResponse(responseData, 'Login successful'));
  } catch (error) {
    logger.error(`HR login error: ${error.message}`, { error: error.stack });
    next(error);
  }
};

/**
 * Admin Login (shared with LMS - email/password)
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    
    logger.info(`Admin login attempt for email: ${email.toLowerCase().trim()}, user found: ${!!user}`);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      throw new AuthenticationError('This login is for administrators only');
    }

    // Check if user has a password set
    if (!user.password) {
      throw new AuthenticationError('Password not set. Please contact system administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AuthenticationError('Account is deactivated.');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user);

    const responseData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      token
    };
    
    logger.info(`Admin login successful for: ${user.email}`);
    res.json(formatResponse(responseData, 'Login successful'));
  } catch (error) {
    logger.error(`Admin login error: ${error.message}`, { error: error.stack });
    next(error);
  }
};

/**
 * Logout (client-side token removal)
 */
const logout = (req, res) => {
  res.json(formatResponse(null, 'Logged out successfully'));
};

module.exports = {
  getCurrentUser,
  googleAuth,
  googleCallback,
  studentLogin,
  hrLogin,
  adminLogin,
  logout
};

