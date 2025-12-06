const { Application, JobListing, User, Company, ApplicationStatusHistory } = require('../models');
const { formatResponse, paginate } = require('../utils/helpers');
const { NotFoundError, AuthorizationError, ConflictError, BusinessLogicError } = require('../utils/errors');
const { getStudentScore } = require('../services/scoreService');
const { checkJobQualification } = require('../services/matchingService');
const { createNotification } = require('../services/notificationService');

/**
 * Apply to job (Student)
 */
const applyToJob = async (req, res, next) => {
  try {
    const { job_listing_id, cover_letter, notes } = req.body;

    // Check if job exists
    const job = await JobListing.findByPk(job_listing_id, {
      include: [{ association: 'company' }]
    });

    if (!job) {
      throw new NotFoundError('Job');
    }

    if (job.status !== 'active') {
      throw new BusinessLogicError('Job is not accepting applications');
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        student_id: req.user.id,
        job_listing_id
      }
    });

    if (existingApplication) {
      throw new ConflictError('You have already applied to this job');
    }

    // Get student score and validate
    const scoreData = await getStudentScore(req.user.id);
    const studentScore = parseFloat(scoreData.overall_score) || 0;
    const requiredScore = parseFloat(job.required_score_min) || 0;

    // Student qualifies if score >= required (including 0 >= 0)
    const qualified = studentScore >= requiredScore;

    if (!qualified) {
      throw new BusinessLogicError(`You do not meet the minimum score requirement. Required: ${requiredScore}, Your score: ${studentScore}`);
    }

    // Create application
    const application = await Application.create({
      student_id: req.user.id,
      job_listing_id,
      score_at_application: studentScore,
      cover_letter: cover_letter || null,
      notes: notes || null,
      status: 'applied'
    });

    // Create status history
    await ApplicationStatusHistory.create({
      application_id: application.id,
      status: 'applied',
      changed_by: req.user.id
    });

    // Create notification for HR
    const hrUsers = await require('../models').HRUser.findAll({
      where: { company_id: job.company_id, is_active: true },
      include: [{ association: 'user' }]
    });

    for (const hrUser of hrUsers) {
      await createNotification(
        hrUser.user_id,
        'new_application',
        'New Application Received',
        `A new application has been received for ${job.title}`,
        `/hr/applications/${application.id}`
      );
    }

    const createdApplication = await Application.findByPk(application.id, {
      include: [
        {
          association: 'jobListing',
          include: [{ association: 'company', attributes: ['id', 'company_name', 'logo_url'] }]
        }
      ]
    });

    res.status(201).json(formatResponse(createdApplication, 'Application submitted successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get student's applications
 */
const getStudentApplications = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status } = req.query;

    const where = {
      student_id: req.user.id
    };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          association: 'jobListing',
          include: [
            {
              association: 'company',
              attributes: ['id', 'company_name', 'logo_url']
            }
          ],
          attributes: ['id', 'title', 'job_type', 'location', 'required_score_min']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit,
      offset
    });

    res.json(formatResponse(rows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get application by ID
 */
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          association: 'jobListing',
          include: [
            {
              association: 'company',
              attributes: ['id', 'company_name', 'logo_url', 'industry', 'location']
            }
          ]
        },
        {
          association: 'student',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          association: 'statusHistory',
          include: [
            {
              association: 'changedBy',
              attributes: ['id', 'name', 'email']
            }
          ],
          order: [['changed_at', 'DESC']]
        }
      ]
    });

    if (!application) {
      throw new NotFoundError('Application');
    }

    // Check authorization
    if (req.user.role === 'student' && application.student_id !== req.user.id) {
      throw new AuthorizationError('Not authorized to view this application');
    }

    if (req.user.role === 'hr' && application.jobListing.company_id !== req.user.company_id) {
      throw new AuthorizationError('Not authorized to view this application');
    }

    res.json(formatResponse(application));
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status (Admin only - HR must use requests)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, admin_notes } = req.body;

    // Only admin can directly update application status
    // HR users must create requests to admin
    if (req.user.role === 'hr') {
      throw new AuthorizationError('HR users cannot directly update application status. Please create a request to admin.');
    }

    const application = await Application.findByPk(req.params.id, {
      include: [
        {
          association: 'jobListing',
          include: [{ association: 'company' }]
        }
      ]
    });

    if (!application) {
      throw new NotFoundError('Application');
    }

    // Check authorization - admin can update any application
    if (req.user.role !== 'admin') {
      throw new AuthorizationError('Only admin can directly update application status');
    }

    // Update application
    application.status = status;
    application.reviewed_at = new Date();
    if (admin_notes) {
      application.hr_notes = (application.hr_notes || '') + '\n\nAdmin Notes: ' + admin_notes;
    }
    await application.save();

    // Create status history
    await ApplicationStatusHistory.create({
      application_id: application.id,
      status,
      changed_by: req.user.id,
      notes: admin_notes || null
    });

    // Create notification for student (from admin)
    await createNotification(
      application.student_id,
      'application_status_update',
      'Application Status Updated',
      `Your application for ${application.jobListing.title} has been updated to ${status.replace('_', ' ')}`,
      `/applications/${application.id}`
    );

    const updatedApplication = await Application.findByPk(application.id, {
      include: [
        {
          association: 'jobListing',
          include: [{ association: 'company' }]
        },
        {
          association: 'statusHistory',
          order: [['changed_at', 'DESC']]
        }
      ]
    });

    res.json(formatResponse(updatedApplication, 'Application status updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get applications for a job (HR)
 */
const getJobApplications = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status, min_score, max_score } = req.query;

    // Verify job belongs to company
    const job = await JobListing.findByPk(req.params.jobId);

    if (!job) {
      throw new NotFoundError('Job');
    }

    if (req.user.role !== 'admin' && job.company_id !== req.user.company_id) {
      throw new AuthorizationError('Not authorized to view applications for this job');
    }

    const where = {
      job_listing_id: req.params.jobId
    };

    if (status) {
      where.status = status;
    }

    if (min_score || max_score) {
      where.score_at_application = {};
      if (min_score) {
        where.score_at_application[require('sequelize').Op.gte] = parseFloat(min_score);
      }
      if (max_score) {
        where.score_at_application[require('sequelize').Op.lte] = parseFloat(max_score);
      }
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          association: 'student',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit,
      offset
    });

    res.json(formatResponse(rows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all company applications (HR) or all applications (Admin)
 */
const getCompanyApplications = async (req, res, next) => {
  try {
    const logger = require('../utils/logger');
    logger.info('getCompanyApplications called', {
      user_id: req.user.id,
      role: req.user.role,
      company_id: req.user.company_id
    });

    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status, job_id, company_id } = req.query;

    let where = {};

    // Admin can see all applications, HR can only see their company's applications
    if (req.user.role === 'admin') {
      // Admin can filter by company_id if provided
      if (company_id) {
        const jobs = await JobListing.findAll({
          where: { company_id },
          attributes: ['id']
        });
        const jobIds = jobs.map(job => job.id);
        if (jobIds.length > 0) {
          where.job_listing_id = { [require('sequelize').Op.in]: jobIds };
        } else {
          return res.json(formatResponse([], null, getMeta(0)));
        }
      }
      // If no company_id filter, admin sees all applications
    } else {
      // HR users - only their company's applications
      if (!req.user.company_id) {
        throw new AuthorizationError('HR user must be associated with a company');
      }

      const jobs = await JobListing.findAll({
        where: { company_id: req.user.company_id },
        attributes: ['id']
      });

      logger.info('HR company jobs found', {
        company_id: req.user.company_id,
        job_count: jobs.length,
        job_ids: jobs.map(j => j.id)
      });

      const jobIds = jobs.map(job => job.id);

      if (jobIds.length === 0) {
        logger.info('No jobs found for company, returning empty applications');
        return res.json(formatResponse([], null, getMeta(0)));
      }

      where.job_listing_id = { [require('sequelize').Op.in]: jobIds };
    }

    if (status) {
      where.status = status;
    }

    if (job_id) {
      where.job_listing_id = job_id;
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      include: [
        {
          association: 'jobListing',
          attributes: ['id', 'title', 'job_type'],
          include: [
            {
              association: 'company',
              attributes: ['id', 'company_name']
            }
          ]
        },
        {
          association: 'student',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['applied_at', 'DESC']],
      limit,
      offset
    });

    logger.info('Applications query result', {
      count,
      rows_returned: rows.length,
      where_clause: where
    });

    res.json(formatResponse(rows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getStudentApplications,
  getApplicationById,
  updateApplicationStatus,
  getJobApplications,
  getCompanyApplications
};

