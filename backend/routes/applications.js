const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middleware/auth');
const { requireStudent, requireHR, requireAdmin } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

// Student routes
router.post(
  '/',
  authenticate,
  requireStudent,
  [
    body('job_listing_id').isInt().withMessage('Job listing ID is required')
  ],
  validate,
  applicationController.applyToJob
);

router.get('/student/all', authenticate, requireStudent, applicationController.getStudentApplications);
router.get('/student/:id', authenticate, requireStudent, applicationController.getApplicationById);

// HR routes
router.get('/hr/all', authenticate, requireHR, applicationController.getCompanyApplications);
router.get('/hr/job/:jobId', authenticate, requireHR, applicationController.getJobApplications);
router.get('/hr/:id', authenticate, requireHR, applicationController.getApplicationById);
router.put(
  '/hr/:id/status',
  authenticate,
  requireHR,
  [
    body('status').isIn(['applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected']).withMessage('Invalid status')
  ],
  validate,
  applicationController.updateApplicationStatus
);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, applicationController.getCompanyApplications);
router.get('/admin/:id', authenticate, requireAdmin, applicationController.getApplicationById);

module.exports = router;

