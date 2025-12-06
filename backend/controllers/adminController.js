const { User, Company, JobListing, Application, HRUser } = require('../models');
const { formatResponse, paginate } = require('../utils/helpers');
const { NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get admin dashboard stats - Comprehensive view
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const Sequelize = require('sequelize');

    // Basic counts - count all, not just active
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalHR = await HRUser.count();
    const totalCompanies = await Company.count();
    const activeCompanies = await Company.count({ where: { status: 'active' } });
    const pendingCompanies = await Company.count({ where: { status: 'pending' } });
    const totalJobs = await JobListing.count();
    const activeJobs = await JobListing.count({ where: { status: 'active' } });
    const totalApplications = await Application.count();

    // Get all jobs with application counts
    let jobsWithStats = [];
    try {
      const allJobs = await JobListing.findAll({
        include: [
          {
            association: 'company',
            attributes: ['id', 'company_name', 'logo_url'],
            required: false
          },
          {
            association: 'applications',
            attributes: ['id', 'status'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Process jobs to add application counts
      jobsWithStats = allJobs.map(job => {
        const jobData = job.toJSON();
        const applications = jobData.applications || [];
        
        jobData.total_applications = applications.length;
        jobData.applications_by_status = {
          applied: applications.filter(a => a.status === 'applied').length,
          under_review: applications.filter(a => a.status === 'under_review').length,
          interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
          accepted: applications.filter(a => a.status === 'accepted').length,
          rejected: applications.filter(a => a.status === 'rejected').length
        };
        
        // Remove full applications array to reduce payload
        delete jobData.applications;
        
        return jobData;
      });
    } catch (err) {
      logger.error('Error fetching jobs:', { error: err.message, stack: err.stack });
    }

    // Get all applications with details
    let allApplications = [];
    try {
      const applicationsData = await Application.findAll({
        include: [
          {
            association: 'student',
            attributes: ['id', 'name', 'email', 'avatar'],
            required: false
          },
          {
            association: 'jobListing',
            include: [
              {
                association: 'company',
                attributes: ['id', 'company_name', 'logo_url'],
                required: false
              }
            ],
            attributes: ['id', 'title', 'job_type', 'location'],
            required: false
          }
        ],
        order: [['applied_at', 'DESC']],
        limit: 500 // Increased limit to show more applications
      });
      allApplications = applicationsData.map(app => app.toJSON());
    } catch (err) {
      logger.error('Error fetching applications:', { error: err.message, stack: err.stack });
    }

    // Get all students - show all, not just active
    let allStudents = [];
    try {
      const studentsData = await User.findAll({
        where: { role: 'student' },
        attributes: ['id', 'name', 'email', 'avatar', 'is_active', 'created_at', 'last_login'],
        order: [['created_at', 'DESC']]
      });
      allStudents = studentsData.map(student => student.toJSON());
    } catch (err) {
      logger.error('Error fetching students:', { error: err.message, stack: err.stack });
    }

    // Get all HR users with company info - show all, not just active
    let allHRUsers = [];
    try {
      const hrUsersData = await HRUser.findAll({
        include: [
          {
            association: 'user',
            attributes: ['id', 'name', 'email', 'avatar', 'is_active', 'created_at', 'last_login'],
            required: true
          },
          {
            association: 'company',
            attributes: ['id', 'company_name', 'logo_url'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']]
      });
      allHRUsers = hrUsersData.map(hrUser => {
        const hrUserData = hrUser.toJSON();
        return hrUserData;
      });
    } catch (err) {
      logger.error('Error fetching HR users:', { error: err.message, stack: err.stack });
    }

    // Get all companies with stats
    let companiesWithStats = [];
    try {
      const allCompanies = await Company.findAll({
        include: [
          {
            association: 'jobListings',
            attributes: ['id'],
            required: false
          },
          {
            association: 'hrUsers',
            attributes: ['id'],
            required: false
          }
        ],
        order: [['created_at', 'DESC']]
      });

      // Process companies to add stats
      companiesWithStats = allCompanies.map(company => {
        const companyData = company.toJSON();
        companyData.total_jobs = (companyData.jobListings || []).length;
        companyData.total_hr_users = (companyData.hrUsers || []).length;
        
        // Remove full arrays to reduce payload
        delete companyData.jobListings;
        delete companyData.hrUsers;
        
        return companyData;
      });
    } catch (err) {
      logger.error('Error fetching companies:', { error: err.message, stack: err.stack });
    }

    // Application status breakdown
    const applicationStatusBreakdown = await Application.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Jobs by status
    const jobsByStatus = await JobListing.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Companies by status
    const companiesByStatus = await Company.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const stats = {
      // User counts
      total_students: totalStudents,
      total_hr_users: totalHR,
      total_companies: totalCompanies,
      active_companies: activeCompanies,
      pending_companies: pendingCompanies,
      
      // Job counts
      total_jobs: totalJobs,
      active_jobs: activeJobs,
      jobs_by_status: jobsByStatus,
      
      // Application counts
      total_applications: totalApplications,
      applications_by_status: applicationStatusBreakdown,
      
      // Detailed data
      all_students: allStudents,
      all_hr_users: allHRUsers,
      all_jobs: jobsWithStats,
      all_applications: allApplications,
      all_companies: companiesWithStats,
      companies_by_status: companiesByStatus
    };

    res.json(formatResponse(stats));
  } catch (error) {
    logger.error('Admin dashboard error:', { 
      error: error.message, 
      stack: error.stack,
      name: error.name 
    });
    next(error);
  }
};

/**
 * Get all users (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { role, search } = req.query;

    const where = {};
    if (role) {
      where.role = role;
    }

    if (search) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at', 'last_login'],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json(formatResponse(rows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Create user (Admin)
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, role, company_id } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      role: role || 'student',
      is_active: true
    });

    // If HR role, create HR user
    if (role === 'hr' && company_id) {
      await HRUser.create({
        user_id: user.id,
        company_id,
        is_active: true
      });
    }

    const createdUser = await User.findByPk(user.id, {
      attributes: ['id', 'name', 'email', 'role', 'is_active', 'created_at']
    });

    res.status(201).json(formatResponse(createdUser, 'User created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new NotFoundError('User');
    }

    const { name, email, role, is_active } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;

    await user.save();

    res.json(formatResponse(user, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      throw new NotFoundError('User');
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform analytics (Admin)
 */
const getAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalHR = await User.count({ where: { role: 'hr' } });
    const totalCompanies = await Company.count();
    const activeCompanies = await Company.count({ where: { status: 'active' } });
    const totalJobs = await JobListing.count();
    const activeJobs = await JobListing.count({ where: { status: 'active' } });
    const totalApplications = await Application.count();

    // Application status breakdown
    const applicationStatuses = await Application.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['status']
    });

    const analytics = {
      users: {
        total_students: totalStudents,
        total_hr: totalHR,
        total: totalStudents + totalHR
      },
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        pending: await Company.count({ where: { status: 'pending' } })
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: await JobListing.count({ where: { status: 'closed' } })
      },
      applications: {
        total: totalApplications,
        by_status: applicationStatuses
      }
    };

    res.json(formatResponse(analytics));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAnalytics
};

