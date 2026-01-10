const { getTopStudents } = require('../services/scoreService');
const { formatResponse } = require('../utils/helpers');

/**
 * Get top students by total points (public endpoint)
 */
const getTopStudentsList = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const students = await getTopStudents(limit);

        res.json(formatResponse(students));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTopStudentsList
};
