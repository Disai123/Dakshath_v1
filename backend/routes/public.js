const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// Public routes (no authentication required)
router.get('/top-students', publicController.getTopStudentsList);

module.exports = router;
