/**
 * Pagination helper
 */
const paginate = (page = 1, limit = 20, maxLimit = 100) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    offset,
    getMeta: (total) => ({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    })
  };
};

/**
 * Format response
 */
const formatResponse = (data, message = null, meta = null) => {
  const response = {
    success: true,
    data
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Format error response
 */
const formatErrorResponse = (error) => {
  return {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An error occurred',
      ...(error.details && { details: error.details })
    }
  };
};

/**
 * Calculate student score (temporary until official scoring system)
 */
const calculateTemporaryScore = async (studentId, sequelize) => {
  try {
    // Get test scores
    const testScores = await sequelize.query(
      `SELECT AVG(score) as avg_score, COUNT(*) as test_count
       FROM test_attempts
       WHERE student_id = :studentId AND score IS NOT NULL`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get course completion rate
    const courseProgress = await sequelize.query(
      `SELECT AVG(progress) as avg_progress, COUNT(*) as course_count
       FROM enrollments
       WHERE student_id = :studentId`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get hackathon scores
    const hackathonScores = await sequelize.query(
      `SELECT AVG(score) as avg_score, COUNT(*) as hackathon_count
       FROM hackathon_participants
       WHERE student_id = :studentId AND score IS NOT NULL`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const testAvg = parseFloat(testScores[0]?.avg_score) || 0;
    const courseAvg = parseFloat(courseProgress[0]?.avg_progress) || 0;
    const hackathonAvg = parseFloat(hackathonScores[0]?.avg_score) || 0;

    // Weighted calculation (temporary)
    // Test scores: 50%, Course progress: 30%, Hackathon: 20%
    const overallScore = (testAvg * 0.5) + (courseAvg * 0.3) + (hackathonAvg * 0.2);

    return {
      overall_score: Math.round(overallScore * 100) / 100,
      test_average: Math.round(testAvg * 100) / 100,
      course_average: Math.round(courseAvg * 100) / 100,
      hackathon_average: Math.round(hackathonAvg * 100) / 100,
      is_temporary: true
    };
  } catch (error) {
    console.error('Error calculating temporary score:', error);
    return {
      overall_score: 0,
      test_average: 0,
      course_average: 0,
      hackathon_average: 0,
      is_temporary: true,
      error: 'Unable to calculate score'
    };
  }
};

/**
 * Validate score requirement
 */
const validateScoreRequirement = (studentScore, requiredScore) => {
  // Handle null/undefined student score
  if (studentScore === null || studentScore === undefined) {
    return {
      qualified: false,
      reason: 'Score not available'
    };
  }

  // Ensure both are numbers for comparison
  const student = parseFloat(studentScore) || 0;
  const required = parseFloat(requiredScore) || 0;

  // Student qualifies if score >= required (including 0 >= 0)
  const qualified = student >= required;
  
  return {
    qualified,
    reason: qualified
      ? 'Score requirement met'
      : `Score ${student} is below required ${required}`
  };
};

/**
 * Sanitize input
 */
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

module.exports = {
  paginate,
  formatResponse,
  formatErrorResponse,
  calculateTemporaryScore,
  validateScoreRequirement,
  sanitizeInput
};

