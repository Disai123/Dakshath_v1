module.exports = {
  // User Roles
  ROLES: {
    STUDENT: 'student',
    HR: 'hr',
    ADMIN: 'admin'
  },

  // Company Status
  COMPANY_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    REJECTED: 'rejected'
  },

  // Job Status
  JOB_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CLOSED: 'closed'
  },

  // Job Types
  JOB_TYPES: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
    CONTRACT: 'contract'
  },

  // Application Status
  APPLICATION_STATUS: {
    APPLIED: 'applied',
    UNDER_REVIEW: 'under_review',
    INTERVIEW_SCHEDULED: 'interview_scheduled',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
  },

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Score Range
  MIN_SCORE: 0,
  MAX_SCORE: 100,

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  }
};

