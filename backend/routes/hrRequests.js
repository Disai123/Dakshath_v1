const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hrRequestController = require('../controllers/hrRequestController');
const authenticate = require('../middleware/auth');
const { requireHR, requireAdmin } = require('../middleware/roleCheck');
const validate = require('../middleware/validation');

// HR routes
router.post(
  '/',
  authenticate,
  requireHR,
  [
    body('application_id').isInt().withMessage('application_id must be an integer'),
    body('request_type').isIn(['status_update', 'interview_schedule', 'assignment', 'other']).withMessage('Invalid request type'),
    body('message').notEmpty().trim().withMessage('message is required'),
    body('requested_status')
      .optional({ values: 'falsy' })
      .custom((value, { req }) => {
        // Only validate if request_type is 'status_update'
        if (req.body.request_type === 'status_update' && value) {
          const validStatuses = ['applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'];
          if (!validStatuses.includes(value)) {
            throw new Error('Invalid status');
          }
        }
        return true;
      })
      .withMessage('Invalid status')
  ],
  validate,
  hrRequestController.createHRRequest
);

router.get(
  '/hr/all',
  authenticate,
  requireHR,
  hrRequestController.getHRUserRequests
);

router.get(
  '/hr/:id',
  authenticate,
  requireHR,
  hrRequestController.getHRRequestById
);

// Admin routes
router.get(
  '/admin/all',
  authenticate,
  requireAdmin,
  hrRequestController.getAllHRRequests
);

router.get(
  '/admin/:id',
  authenticate,
  requireAdmin,
  hrRequestController.getHRRequestById
);

router.put(
  '/admin/:id/process',
  authenticate,
  requireAdmin,
  [
    body('action').isIn(['approve', 'reject']).withMessage('action must be either "approve" or "reject"'),
    body('admin_notes').optional().isString(),
    body('application_status').optional().isIn(['applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'])
  ],
  validate,
  hrRequestController.processHRRequest
);

module.exports = router;

