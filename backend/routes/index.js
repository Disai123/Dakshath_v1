const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const jobRoutes = require('./jobs');
const applicationRoutes = require('./applications');
const studentRoutes = require('./students');
const companyRoutes = require('./companies');
const hrRoutes = require('./hr');
const adminRoutes = require('./admin');
const notificationRoutes = require('./notifications');
const hrRequestRoutes = require('./hrRequests');

// API routes
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/hr', hrRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);
router.use('/hr-requests', hrRequestRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Dakshath API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

