export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const ROLES = {
  STUDENT: 'student',
  HR: 'hr',
  ADMIN: 'admin'
};

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract'
};

export const JOB_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed'
};

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

export const COMPANY_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  REJECTED: 'rejected'
};

export const STATUS_LABELS = {
  [APPLICATION_STATUS.APPLIED]: 'Applied',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'Interview Scheduled',
  [APPLICATION_STATUS.ACCEPTED]: 'Accepted',
  [APPLICATION_STATUS.REJECTED]: 'Rejected'
};

export const STATUS_COLORS = {
  [APPLICATION_STATUS.APPLIED]: 'info',
  [APPLICATION_STATUS.UNDER_REVIEW]: 'warning',
  [APPLICATION_STATUS.INTERVIEW_SCHEDULED]: 'warning',
  [APPLICATION_STATUS.ACCEPTED]: 'success',
  [APPLICATION_STATUS.REJECTED]: 'error'
};

