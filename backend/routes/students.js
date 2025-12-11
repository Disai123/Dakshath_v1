const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/auth');
const { requireStudent, requireHR, requireAdmin } = require('../middleware/roleCheck');

// Public/HR/Admin routes (must be before /:id routes)
router.get('/top-scores', authenticate, studentController.getTopStudentsEndpoint);

// Student routes (own profile)
router.get('/profile', authenticate, requireStudent, studentController.getStudentProfile);
router.get('/score', authenticate, requireStudent, studentController.getStudentScoreEndpoint);
router.get('/achievements', authenticate, requireStudent, studentController.getStudentAchievements);
router.get('/courses', authenticate, requireStudent, studentController.getStudentCourses);
router.get('/certificates', authenticate, requireStudent, studentController.getStudentCertificates);

// HR/Admin routes (view student profiles)
router.get('/:id/profile', authenticate, requireHR, studentController.getStudentProfile);
router.get('/:id/score', authenticate, requireHR, studentController.getStudentScoreEndpoint);
router.get('/:id/achievements', authenticate, requireHR, studentController.getStudentAchievements);
router.get('/:id/courses', authenticate, requireHR, studentController.getStudentCourses);
router.get('/:id/certificates', authenticate, requireHR, studentController.getStudentCertificates);

module.exports = router;

