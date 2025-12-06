const express = require('express');
const router = express.Router();
const hrController = require('../controllers/hrController');
const authenticate = require('../middleware/auth');
const { requireHR } = require('../middleware/roleCheck');

router.get('/dashboard', authenticate, requireHR, hrController.getHRDashboard);

module.exports = router;

