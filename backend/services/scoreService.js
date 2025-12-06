const { StudentScore, sequelize } = require('../models');
const { calculateTemporaryScore } = require('../utils/helpers');

/**
 * Get or calculate student score
 */
const getStudentScore = async (studentId) => {
  try {
    // First, try to get from student_scores table
    let studentScore = await StudentScore.findOne({
      where: { student_id: studentId }
    });

    // If score exists and is recent (within 24 hours), return it
    if (studentScore && studentScore.last_calculated_at) {
      const hoursSinceCalculation = (new Date() - new Date(studentScore.last_calculated_at)) / (1000 * 60 * 60);
      if (hoursSinceCalculation < 24) {
        return {
          overall_score: parseFloat(studentScore.overall_score) || 0,
          course_average: parseFloat(studentScore.course_average) || 0,
          test_average: parseFloat(studentScore.test_average) || 0,
          project_average: parseFloat(studentScore.project_average) || 0,
          hackathon_average: parseFloat(studentScore.hackathon_average) || 0,
          last_calculated_at: studentScore.last_calculated_at,
          is_temporary: false
        };
      }
    }

    // Calculate temporary score from LMS data
    const tempScore = await calculateTemporaryScore(studentId, sequelize);

    // Save to database (upsert)
    await StudentScore.upsert({
      student_id: studentId,
      overall_score: tempScore.overall_score,
      course_average: tempScore.course_average,
      test_average: tempScore.test_average,
      project_average: tempScore.project_average || 0,
      hackathon_average: tempScore.hackathon_average,
      last_calculated_at: new Date()
    });

    return tempScore;
  } catch (error) {
    console.error('Error getting student score:', error);
    // Return default score if calculation fails
    return {
      overall_score: 0,
      course_average: 0,
      test_average: 0,
      project_average: 0,
      hackathon_average: 0,
      is_temporary: true,
      error: 'Unable to calculate score'
    };
  }
};

/**
 * Update student score (for when official scoring system is implemented)
 */
const updateStudentScore = async (studentId, scoreData) => {
  const [studentScore] = await StudentScore.upsert({
    student_id: studentId,
    overall_score: scoreData.overall_score,
    course_average: scoreData.course_average,
    test_average: scoreData.test_average,
    project_average: scoreData.project_average,
    hackathon_average: scoreData.hackathon_average,
    last_calculated_at: new Date()
  }, {
    returning: true
  });

  return studentScore;
};

module.exports = {
  getStudentScore,
  updateStudentScore
};

