const express = require('express');
const passwordResetController = require('../controllers/passwordResetController');
const router = express.Router();

// Request password reset (send email)
router.post('/request', passwordResetController.requestPasswordReset);

// Validate reset token
router.get('/validate/:token', passwordResetController.validateResetToken);

// Get user info for reset token
router.get('/token-info/:token', passwordResetController.getResetTokenInfo);

// Reset password with token
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;
