const { sequelize } = require('../models');

/**
 * Get student score from LMS student_scores table
 */
const getStudentScore = async (studentId) => {
  try {
    // Query the LMS student_scores table directly
    const scores = await sequelize.query(
      `SELECT 
        student_id,
        total_points,
        total_course_points,
        total_project_points,
        total_hackathon_points,
        courses_completed_count,
        projects_approved_count,
        hackathons_approved_count,
        master_certificate_issued,
        master_certificate_issued_at,
        last_calculated_at
       FROM student_scores
       WHERE student_id = :studentId`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (scores && scores.length > 0) {
      const score = scores[0];
      return {
        total_points: parseInt(score.total_points) || 0,
        total_course_points: parseInt(score.total_course_points) || 0,
        total_project_points: parseInt(score.total_project_points) || 0,
        total_hackathon_points: parseInt(score.total_hackathon_points) || 0,
        courses_completed_count: parseInt(score.courses_completed_count) || 0,
        projects_approved_count: parseInt(score.projects_approved_count) || 0,
        hackathons_approved_count: parseInt(score.hackathons_approved_count) || 0,
        master_certificate_issued: score.master_certificate_issued || false,
        master_certificate_issued_at: score.master_certificate_issued_at,
        last_calculated_at: score.last_calculated_at
      };
    }

    // Return default if no score exists
    return {
      total_points: 0,
      total_course_points: 0,
      total_project_points: 0,
      total_hackathon_points: 0,
      courses_completed_count: 0,
      projects_approved_count: 0,
      hackathons_approved_count: 0,
      master_certificate_issued: false,
      master_certificate_issued_at: null,
      last_calculated_at: null
    };
  } catch (error) {
    console.error('Error getting student score:', error);
    return {
      total_points: 0,
      total_course_points: 0,
      total_project_points: 0,
      total_hackathon_points: 0,
      courses_completed_count: 0,
      projects_approved_count: 0,
      hackathons_approved_count: 0,
      master_certificate_issued: false,
      error: 'Unable to fetch score'
    };
  }
};

/**
 * Get top students by score
 */
const getTopStudents = async (limit = 10) => {
  try {
    const students = await sequelize.query(
      `SELECT 
        ss.student_id,
        u.name as student_name,
        u.email,
        u.avatar,
        ss.total_points,
        ss.total_course_points,
        ss.total_project_points,
        ss.total_hackathon_points,
        ss.courses_completed_count,
        ss.projects_approved_count,
        ss.hackathons_approved_count,
        ss.master_certificate_issued
       FROM student_scores ss
       JOIN users u ON ss.student_id = u.id
       WHERE u.role = 'student'
       ORDER BY ss.total_points DESC
       LIMIT :limit`,
      {
        replacements: { limit: parseInt(limit) },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return students;
  } catch (error) {
    console.error('Error getting top students:', error);
    return [];
  }
};

module.exports = {
  getStudentScore,
  getTopStudents
};

