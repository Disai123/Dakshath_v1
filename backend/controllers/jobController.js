const { JobListing, Company, HRUser, Application, User } = require('../models');
const { formatResponse, paginate } = require('../utils/helpers');
const { NotFoundError, AuthorizationError, ValidationError } = require('../utils/errors');
const { Op } = require('sequelize');
const { getStudentScore } = require('../services/scoreService');
const { checkJobQualification } = require('../services/matchingService');

/**
 * Get all active jobs (Student view)
 */
const getAllJobs = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { search, job_type, location, min_score, max_score } = req.query;

    const where = {
      status: 'active'
    };

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Job type filter
    if (job_type) {
      where.job_type = job_type;
    }

    // Location filter
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    // Score range filter
    if (min_score) {
      where.required_score_min = { [Op.gte]: parseFloat(min_score) };
    }

    if (max_score) {
      where.required_score_max = { [Op.lte]: parseFloat(max_score) };
    }

    const { count, rows } = await JobListing.findAndCountAll({
      where,
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url', 'industry', 'location']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Add qualification status if student is logged in
    let jobs = rows;
    if (req.user && req.user.role === 'student') {
      const scoreData = await getStudentScore(req.user.id);
      const studentScore = scoreData.overall_score || 0;

      jobs = rows.map(job => {
        const jobData = job.toJSON();
        // Student qualifies if score >= required (including 0 >= 0)
        const required = job.required_score_min || 0;
        const qualified = studentScore >= required;
        return {
          ...jobData,
          qualification_status: qualified ? 'qualified' : 'not_qualified',
          student_score: studentScore
        };
      });
    }

    res.json(formatResponse(jobs, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get job by ID
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await JobListing.findByPk(req.params.id, {
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url', 'industry', 'location', 'description', 'website']
        },
        {
          association: 'postedBy',
          attributes: ['id'],
          include: [{
            association: 'user',
            attributes: ['id', 'name', 'email']
          }]
        }
      ]
    });

    if (!job) {
      throw new NotFoundError('Job');
    }

    const jobData = job.toJSON();

    // Add qualification status if student is logged in
    if (req.user && req.user.role === 'student') {
      const qualification = await checkJobQualification(req.user.id, job.id);
      const scoreData = await getStudentScore(req.user.id);
      const studentScore = parseFloat(scoreData.overall_score) || 0;
      const requiredScore = parseFloat(job.required_score_min) || 0;
      
      // Student qualifies if score >= required (including 0 >= 0)
      const qualified = studentScore >= requiredScore;
      jobData.qualification_status = qualified ? 'qualified' : 'not_qualified';
      jobData.student_score = studentScore;
      jobData.qualification_message = qualification.reason;
    }

    res.json(formatResponse(jobData));
  } catch (error) {
    next(error);
  }
};

/**
 * Search jobs
 */
const searchJobs = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { q, job_type, location, min_score, max_score, company_id } = req.query;

    const where = {
      status: 'active'
    };

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ];
    }

    if (job_type) {
      where.job_type = job_type;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (min_score) {
      where.required_score_min = { [Op.gte]: parseFloat(min_score) };
    }

    if (max_score) {
      where.required_score_max = { [Op.lte]: parseFloat(max_score) };
    }

    if (company_id) {
      where.company_id = company_id;
    }

    const { count, rows } = await JobListing.findAndCountAll({
      where,
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url', 'industry', 'location']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Add qualification status if student is logged in
    let jobs = rows;
    if (req.user && req.user.role === 'student') {
      const scoreData = await getStudentScore(req.user.id);
      const studentScore = scoreData.overall_score || 0;

      jobs = rows.map(job => {
        const jobData = job.toJSON();
        // Student qualifies if score >= required (including 0 >= 0)
        const required = job.required_score_min || 0;
        const qualified = studentScore >= required;
        return {
          ...jobData,
          qualification_status: qualified ? 'qualified' : 'not_qualified',
          student_score: studentScore
        };
      });
    }

    res.json(formatResponse(jobs, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get qualified jobs for student
 */
const getQualifiedJobs = async (req, res, next) => {
  try {
    const { getQualifiedJobs: getQualified } = require('../services/matchingService');
    const { page, limit } = paginate(req.query.page, req.query.limit);

    const filters = {
      job_type: req.query.job_type,
      location: req.query.location
    };

    const jobs = await getQualified(req.user.id, filters);

    // Paginate results
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedJobs = jobs.slice(start, end);

    res.json(formatResponse(paginatedJobs, null, {
      page,
      limit,
      total: jobs.length,
      totalPages: Math.ceil(jobs.length / limit)
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * Create job (HR)
 */
const createJob = async (req, res, next) => {
  try {
    if (!req.user.company_id) {
      throw new AuthorizationError('HR user must be associated with a company');
    }

    // Get HR user
    const hrUser = await HRUser.findOne({
      where: { user_id: req.user.id, company_id: req.user.company_id, is_active: true }
    });

    if (!hrUser) {
      throw new AuthorizationError('HR user not found');
    }

    // Check company is active
    const company = await Company.findByPk(req.user.company_id);
    if (company.status !== 'active') {
      throw new AuthorizationError('Company must be active to post jobs');
    }

    const jobData = {
      ...req.body,
      company_id: req.user.company_id,
      posted_by: hrUser.id
    };

    const job = await JobListing.create(jobData);

    const createdJob = await JobListing.findByPk(job.id, {
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url']
        }
      ]
    });

    res.status(201).json(formatResponse(createdJob, 'Job created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update job (HR)
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await JobListing.findByPk(req.params.id);

    if (!job) {
      throw new NotFoundError('Job');
    }

    // Check authorization
    if (req.user.role !== 'admin' && job.company_id !== req.user.company_id) {
      throw new AuthorizationError('Not authorized to update this job');
    }

    await job.update(req.body);

    const updatedJob = await JobListing.findByPk(job.id, {
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url']
        }
      ]
    });

    res.json(formatResponse(updatedJob, 'Job updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job (HR)
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await JobListing.findByPk(req.params.id);

    if (!job) {
      throw new NotFoundError('Job');
    }

    // Check authorization
    if (req.user.role !== 'admin' && job.company_id !== req.user.company_id) {
      throw new AuthorizationError('Not authorized to delete this job');
    }

    await job.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get company's jobs (HR)
 */
const getCompanyJobs = async (req, res, next) => {
  try {
    const logger = require('../utils/logger');
    
    // Log for debugging
    logger.info('getCompanyJobs called', {
      user_id: req.user.id,
      company_id: req.user.company_id,
      hr_user_id: req.user.hr_user_id
    });
    
    if (!req.user.company_id) {
      logger.error('No company_id found for HR user', { user_id: req.user.id });
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_COMPANY',
          message: 'HR user is not associated with a company'
        }
      });
    }
    
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status } = req.query;

    const where = {
      company_id: req.user.company_id
    };

    if (status) {
      where.status = status;
    }

    // Get jobs without association to avoid potential issues
    const { count, rows } = await JobListing.findAndCountAll({
      where,
      attributes: ['id', 'title', 'description', 'job_type', 'location', 'status', 'required_score_min', 'required_score_max', 'created_at', 'updated_at', 'company_id'],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Add application count and company name for each job
    const jobs = await Promise.all(rows.map(async (job) => {
      const jobData = job.toJSON();
      
      // Get application count
      try {
        const applicationCount = await Application.count({
          where: { job_listing_id: job.id }
        });
        jobData.application_count = applicationCount;
      } catch (err) {
        jobData.application_count = 0;
      }
      
      // Get company name if needed
      if (job.company_id) {
        try {
          const company = await Company.findByPk(job.company_id, {
            attributes: ['id', 'company_name']
          });
          if (company) {
            jobData.company = {
              id: company.id,
              company_name: company.company_name
            };
          }
        } catch (err) {
          // Company not found, continue without it
        }
      }
      
      return jobData;
    }));

    logger.info('getCompanyJobs result', {
      company_id: req.user.company_id,
      count: count,
      jobs_returned: jobs.length
    });
    
    res.json(formatResponse(jobs, null, getMeta(count)));
  } catch (error) {
    logger.error('getCompanyJobs error', {
      error: error.message,
      stack: error.stack,
      user_id: req.user?.id,
      company_id: req.user?.company_id
    });
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  searchJobs,
  getQualifiedJobs,
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs
};

