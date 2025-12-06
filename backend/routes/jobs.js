const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/auth');
const { requireStudent, requireHR, requireAdmin } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

// Public/Student routes (optional auth for qualification status)
router.get('/', authenticate.optional, jobController.getAllJobs);
router.get('/search', authenticate.optional, jobController.searchJobs);
router.get('/qualified', authenticate, requireStudent, jobController.getQualifiedJobs);
router.get('/:id', authenticate.optional, jobController.getJobById);

// HR routes
router.post(
  '/',
  authenticate,
  requireHR,
  [
    body('title').notEmpty().withMessage('Job title is required'),
    body('description').notEmpty().withMessage('Job description is required'),
    body('job_type').isIn(['full-time', 'part-time', 'internship', 'contract']).withMessage('Invalid job type'),
    body('required_score_min').isFloat({ min: 0, max: 100 }).withMessage('Minimum score must be between 0 and 100')
  ],
  validate,
  jobController.createJob
);

router.get('/company/all', authenticate, requireHR, jobController.getCompanyJobs);
router.put('/:id', authenticate, requireHR, jobController.updateJob);
router.delete('/:id', authenticate, requireHR, jobController.deleteJob);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, jobController.getAllJobs);

module.exports = router;

