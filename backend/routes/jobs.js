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

// Static path segments MUST be registered before /:id or they are shadowed
router.get('/company/all', authenticate, requireHR, jobController.getCompanyJobs);
router.get('/admin/all', authenticate, requireAdmin, jobController.getAllJobs);

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
    body('required_score_min').isFloat({ min: 0 }).withMessage('Minimum points must be 0 or greater')
  ],
  validate,
  jobController.createJob
);

router.put('/:id', authenticate, requireHR, jobController.updateJob);
router.delete('/:id', authenticate, requireHR, jobController.deleteJob);

module.exports = router;

