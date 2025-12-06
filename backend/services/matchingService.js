const { JobListing, Application, sequelize } = require('../models');
const { getStudentScore } = require('./scoreService');
const { validateScoreRequirement } = require('../utils/helpers');

/**
 * Get jobs student qualifies for
 */
const getQualifiedJobs = async (studentId, filters = {}) => {
  try {
    // Get student score
    const scoreData = await getStudentScore(studentId);
    const studentScore = scoreData.overall_score || 0;

    // Build where clause
    const where = {
      status: 'active',
      required_score_min: {
        [sequelize.Op.lte]: studentScore
      }
    };

    // Apply filters
    if (filters.job_type) {
      where.job_type = filters.job_type;
    }

    if (filters.location) {
      where.location = {
        [sequelize.Op.iLike]: `%${filters.location}%`
      };
    }

    if (filters.company_id) {
      where.company_id = filters.company_id;
    }

    // Get jobs
    const jobs = await JobListing.findAll({
      where,
      include: [
        {
          association: 'company',
          attributes: ['id', 'company_name', 'logo_url', 'industry', 'location']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Check which jobs student has already applied to
    const applications = await Application.findAll({
      where: { student_id: studentId },
      attributes: ['job_listing_id']
    });

    const appliedJobIds = new Set(applications.map(app => app.job_listing_id));

    // Add qualification status to each job
    return jobs.map(job => {
      const jobData = job.toJSON();
      const qualification = validateScoreRequirement(studentScore, job.required_score_min);
      
      return {
        ...jobData,
        qualification_status: qualification.qualified ? 'qualified' : 'not_qualified',
        student_score: studentScore,
        has_applied: appliedJobIds.has(job.id)
      };
    });
  } catch (error) {
    console.error('Error getting qualified jobs:', error);
    throw error;
  }
};

/**
 * Check if student qualifies for a specific job
 */
const checkJobQualification = async (studentId, jobId) => {
  try {
    const job = await JobListing.findByPk(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    const scoreData = await getStudentScore(studentId);
    const studentScore = scoreData.overall_score || 0;

    return validateScoreRequirement(studentScore, job.required_score_min);
  } catch (error) {
    console.error('Error checking job qualification:', error);
    throw error;
  }
};

module.exports = {
  getQualifiedJobs,
  checkJobQualification
};

