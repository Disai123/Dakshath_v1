const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

router.get('/dashboard', authenticate, requireAdmin, adminController.getAdminDashboard);
router.get('/analytics', authenticate, requireAdmin, adminController.getAnalytics);

// User management
router.get('/users', authenticate, requireAdmin, adminController.getAllUsers);
router.post(
  '/users',
  authenticate,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['student', 'hr', 'admin']).withMessage('Invalid role')
  ],
  validate,
  adminController.createUser
);
router.get('/users/:id', authenticate, requireAdmin, adminController.getAllUsers);
router.put('/users/:id', authenticate, requireAdmin, adminController.updateUser);
router.delete('/users/:id', authenticate, requireAdmin, adminController.deleteUser);

module.exports = router;

