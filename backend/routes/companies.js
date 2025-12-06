const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const authenticate = require('../middleware/auth');
const { requireHR, requireAdmin } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

// Public routes (No authentication required)
router.post(
  '/register',
  [
    body('company_name').trim().notEmpty().withMessage('Company name is required'),
    body('hr_name').trim().notEmpty().withMessage('HR name is required'),
    body('hr_email').trim().isEmail().withMessage('Valid HR email is required'),
    body('hr_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('website').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid website URL'),
    body('hr_phone').optional({ checkFalsy: true }).trim().isMobilePhone().withMessage('Invalid phone number')
  ],
  validate,
  companyController.registerCompany
);

// HR routes
router.get('/hr/profile', authenticate, requireHR, companyController.getCompanyProfile);
router.put(
  '/hr/profile',
  authenticate,
  requireHR,
  [
    body('website').optional().isURL().withMessage('Invalid website URL')
  ],
  validate,
  companyController.updateCompanyProfile);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, companyController.getAllCompanies);
router.get('/admin/pending', authenticate, requireAdmin, companyController.getPendingCompanies);
router.get('/admin/:id', authenticate, requireAdmin, companyController.getCompanyProfile);
router.post(
  '/admin/:id/approve',
  authenticate,
  requireAdmin,
  companyController.approveCompany
);
router.post(
  '/admin/:id/reject',
  authenticate,
  requireAdmin,
  [
    body('rejection_reason').notEmpty().withMessage('Rejection reason is required')
  ],
  validate,
  companyController.rejectCompany
);

module.exports = router;

