const { HRUser, Company, JobListing, Application } = require('../models');
const { formatResponse } = require('../utils/helpers');

/**
 * Get HR dashboard stats
 */
const getHRDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.company_id;

    // Get stats
    const activeJobs = await JobListing.count({
      where: { company_id: companyId, status: 'active' }
    });

    const totalApplications = await Application.count({
      include: [
        {
          association: 'jobListing',
          where: { company_id: companyId }
        }
      ]
    });

    const pendingApplications = await Application.count({
      where: { status: 'under_review' },
      include: [
        {
          association: 'jobListing',
          where: { company_id: companyId }
        }
      ]
    });

    // Get recent applications
    const recentApplications = await Application.findAll({
      include: [
        {
          association: 'jobListing',
          where: { company_id: companyId },
          attributes: ['id', 'title']
        },
        {
          association: 'student',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit: 5
    });

    // Get recent jobs
    const recentJobs = await JobListing.findAll({
      where: { company_id: companyId },
      order: [['created_at', 'DESC']],
      limit: 5
    });

    const stats = {
      active_jobs: activeJobs,
      total_applications: totalApplications,
      pending_applications: pendingApplications,
      recent_applications: recentApplications,
      recent_jobs: recentJobs
    };

    res.json(formatResponse(stats));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHRDashboard
};

