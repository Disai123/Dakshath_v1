const { User, sequelize } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { NotFoundError, AuthorizationError } = require('../utils/errors');
const { getStudentScore, getTopStudents } = require('../services/scoreService');

/**
 * Get student profile
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Check authorization
    if (req.user.role === 'student' && studentId != req.user.id) {
      throw new AuthorizationError('Not authorized to view this profile');
    }

    const user = await User.findByPk(studentId, {
      attributes: ['id', 'name', 'email', 'avatar', 'role', 'created_at']
    });

    if (!user) {
      throw new NotFoundError('Student');
    }

    // Get student score
    const scoreData = await getStudentScore(studentId);

    // Get course enrollments (from LMS)
    const enrollments = await sequelize.query(
      `SELECT 
        e.id,
        e.progress,
        e.status,
        e.enrolled_at,
        e.completed_at,
        c.id as course_id,
        c.title as course_title,
        c.description as course_description
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = :studentId
       ORDER BY e.enrolled_at DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get test attempts (from LMS)
    const testAttempts = await sequelize.query(
      `SELECT 
        ta.id,
        ta.score,
        ta.earned_points,
        ta.total_points,
        ta.completed_at,
        ct.id as test_id,
        ct.title as test_title
       FROM test_attempts ta
       JOIN course_tests ct ON ta.test_id = ct.id
       WHERE ta.student_id = :studentId AND ta.status = 'completed'
       ORDER BY ta.completed_at DESC
       LIMIT 20`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get certificates (from LMS) - fixed column names
    const certificates = await sequelize.query(
      `SELECT 
        c.id,
        c.course_id,
        co.title as course_title,
        c.certificate_url,
        c.issued_date as issued_at,
        c.is_valid
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.student_id = :studentId AND c.is_valid = true
       ORDER BY c.issued_date DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get achievements (from LMS student_achievements table)
    const achievements = await sequelize.query(
      `SELECT 
        sa.id,
        sa.achievement_type,
        sa.source_id,
        sa.source_type,
        sa.points_awarded,
        sa.awarded_at,
        sa.metadata,
        sa.is_active
       FROM student_achievements sa
       WHERE sa.student_id = :studentId AND sa.is_active = true
       ORDER BY sa.awarded_at DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Get hackathon participation (from LMS)
    const hackathons = await sequelize.query(
      `SELECT 
        hp.id,
        hp.score,
        h.id as hackathon_id,
        h.name as hackathon_title,
        h.start_date,
        h.end_date
       FROM hackathon_participants hp
       JOIN hackathons h ON hp.hackathon_id = h.id
       WHERE hp.student_id = :studentId
       ORDER BY h.start_date DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const profile = {
      ...user.toJSON(),
      score: scoreData,
      courses: enrollments,
      tests: testAttempts,
      certificates,
      achievements,
      hackathons
    };

    res.json(formatResponse(profile));
  } catch (error) {
    next(error);
  }
};

/**
 * Get student score
 */
const getStudentScoreEndpoint = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Check authorization
    if (req.user.role === 'student' && studentId != req.user.id) {
      throw new AuthorizationError('Not authorized');
    }

    const scoreData = await getStudentScore(studentId);

    res.json(formatResponse(scoreData));
  } catch (error) {
    next(error);
  }
};

/**
 * Get student courses
 */
const getStudentCourses = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Check authorization
    if (req.user.role === 'student' && studentId != req.user.id) {
      throw new AuthorizationError('Not authorized');
    }

    const courses = await sequelize.query(
      `SELECT 
        e.id,
        e.progress,
        e.status,
        e.enrolled_at,
        e.completed_at,
        e.rating,
        c.id as course_id,
        c.title,
        c.description,
        c.category,
        c.difficulty
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = :studentId
       ORDER BY e.enrolled_at DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(formatResponse(courses));
  } catch (error) {
    next(error);
  }
};

/**
 * Get student achievements
 */
const getStudentAchievements = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Check authorization
    if (req.user.role === 'student' && studentId != req.user.id) {
      throw new AuthorizationError('Not authorized');
    }

    const achievements = await sequelize.query(
      `SELECT 
        sa.id,
        sa.achievement_type,
        sa.source_id,
        sa.source_type,
        sa.points_awarded,
        sa.awarded_at,
        sa.metadata,
        sa.is_active
       FROM student_achievements sa
       WHERE sa.student_id = :studentId AND sa.is_active = true
       ORDER BY sa.awarded_at DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Group by achievement type
    const grouped = achievements.reduce((acc, achievement) => {
      const type = achievement.achievement_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(achievement);
      return acc;
    }, {});

    const totalPoints = achievements.reduce((sum, a) => sum + (parseInt(a.points_awarded) || 0), 0);

    res.json(formatResponse({
      achievements,
      grouped,
      total_count: achievements.length,
      total_points: totalPoints
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * Get student certificates
 */
const getStudentCertificates = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Check authorization
    if (req.user.role === 'student' && studentId != req.user.id) {
      throw new AuthorizationError('Not authorized');
    }

    const certificates = await sequelize.query(
      `SELECT 
        c.id,
        c.course_id,
        co.title as course_title,
        c.certificate_url,
        c.issued_date as issued_at,
        c.is_valid
       FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.student_id = :studentId AND c.is_valid = true
       ORDER BY c.issued_date DESC`,
      {
        replacements: { studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    res.json(formatResponse(certificates));
  } catch (error) {
    next(error);
  }
};

/**
 * Get top students by score
 */
const getTopStudentsEndpoint = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const students = await getTopStudents(limit);
    res.json(formatResponse(students));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentProfile,
  getStudentScoreEndpoint,
  getStudentAchievements,
  getStudentCourses,
  getStudentCertificates,
  getTopStudentsEndpoint
};

