import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return date;
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const formatCurrency = (amount) => {
  if (!amount) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatScore = (score) => {
  if (score === null || score === undefined) return 'N/A';
  return parseFloat(score).toFixed(2);
};

export const getQualificationStatus = (studentScore, requiredScore) => {
  // Convert to numbers to ensure proper comparison
  const student = parseFloat(studentScore) || 0;
  const required = parseFloat(requiredScore) || 0;

  if (isNaN(student) && student !== 0) {
    return {
      status: 'not_qualified',
      message: 'Score not available',
      color: 'error'
    };
  }

  // Student qualifies if score >= required (including 0 >= 0)
  if (student >= required) {
    return {
      status: 'qualified',
      message: 'You qualify for this position',
      color: 'success'
    };
  }

  const difference = required - student;
  if (difference <= 5) {
    return {
      status: 'close',
      message: `You're close! Need ${difference.toFixed(1)} more points`,
      color: 'warning'
    };
  }

  return {
    status: 'not_qualified',
    message: `You need ${difference.toFixed(1)} more points to qualify`,
    color: 'error'
  };
};

export const clsx = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

