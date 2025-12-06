const crypto = require('crypto');
const { Company, HRUser, User, JobListing } = require('../models');
const { formatResponse, paginate } = require('../utils/helpers');
const { NotFoundError, AuthorizationError, ValidationError, ConflictError } = require('../utils/errors');
const { createNotification } = require('../services/notificationService');
const bcrypt = require('bcryptjs');

// Use Node.js built-in crypto.randomUUID() instead of uuid package
const uuidv4 = () => crypto.randomUUID();

/**
 * Register new company (Public - No auth required)
 * Similar to Naukri/Foundit company registration
 */
const registerCompany = async (req, res, next) => {
  try {
    const {
      // Company details
      company_name,
      description,
      website,
      industry,
      location,
      phone,
      employee_count,
      // Primary HR user details
      hr_name,
      hr_email,
      hr_password,
      hr_phone
    } = req.body;

    // Validate required fields
    if (!company_name || !hr_name || !hr_email || !hr_password) {
      throw new ValidationError('Company name, HR name, email, and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hr_email)) {
      throw new ValidationError('Invalid HR email format');
    }

    // Validate password strength
    if (hr_password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      where: { company_name: company_name.trim() }
    });

    if (existingCompany) {
      throw new ConflictError('Company with this name already exists');
    }

    // Check if HR user email already exists
    const existingUser = await User.findOne({
      where: { email: hr_email.toLowerCase().trim() }
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Create company with pending status
    // Use HR email as company email (required field)
    const company = await Company.create({
      company_name: company_name.trim(),
      email: hr_email.toLowerCase().trim(), // Use HR email as company email
      description: description?.trim() || null,
      website: website?.trim() || null,
      industry: industry?.trim() || null,
      location: location?.trim() || null,
      phone: phone?.trim() || null,
      employee_count: employee_count || null,
      status: 'pending' // Will be approved by admin
    });

    // Hash password for HR user
    const hashedPassword = await bcrypt.hash(hr_password, 12);

    // Create HR user account
    // Generate UUID for user id
    const hrUser = await User.create({
      id: uuidv4(),
      name: hr_name.trim(),
      email: hr_email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'hr',
      is_active: true
    });

    // Link HR user to company
    const hrUserRecord = await HRUser.create({
      user_id: hrUser.id,
      company_id: company.id,
      is_active: true
    });

    // Create notification for admin about new company registration
    const adminUsers = await User.findAll({
      where: { role: 'admin', is_active: true }
    });

    for (const admin of adminUsers) {
      await createNotification(
        admin.id,
        'new_company_registration',
        'New Company Registration',
        `New company "${company.company_name}" has registered and is pending approval.`,
        `/admin/companies`
      );
    }

    res.status(201).json(formatResponse({
      company: {
        id: company.id,
        company_name: company.company_name,
        status: company.status
      },
      hr_user: {
        id: hrUser.id,
        email: hrUser.email,
        name: hrUser.name
      },
      message: 'Company registration successful. Your account is pending admin approval. You will receive an email notification once approved.'
    }, 'Company registered successfully. Please wait for admin approval.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get company profile (HR)
 */
const getCompanyProfile = async (req, res, next) => {
  try {
    const companyId = req.params.id || req.user.company_id;

    // Check authorization
    if (req.user.role === 'hr' && companyId != req.user.company_id) {
      throw new AuthorizationError('Not authorized to view this company');
    }

    const company = await Company.findByPk(companyId, {
      include: [
        {
          association: 'hrUsers',
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email', 'avatar']
            }
          ]
        }
      ]
    });

    if (!company) {
      throw new NotFoundError('Company');
    }

    // Get job count
    const jobCount = await JobListing.count({
      where: { company_id: companyId }
    });

    const companyData = company.toJSON();
    companyData.job_count = jobCount;

    res.json(formatResponse(companyData));
  } catch (error) {
    next(error);
  }
};

/**
 * Update company profile (HR)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.user.company_id);

    if (!company) {
      throw new NotFoundError('Company');
    }

    // Only allow updating certain fields
    const allowedFields = ['description', 'website', 'logo_url', 'phone', 'location', 'industry'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await company.update(updateData);

    const updatedCompany = await Company.findByPk(company.id);

    res.json(formatResponse(updatedCompany, 'Company profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all companies (Admin)
 */
const getAllCompanies = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Company.findAndCountAll({
      where,
      include: [
        {
          association: 'hrUsers',
          attributes: ['id'],
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json(formatResponse(rows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get pending companies (Admin)
 */
const getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      where: { status: 'pending' },
      include: [
        {
          association: 'hrUsers',
          attributes: ['id'],
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json(formatResponse(companies));
  } catch (error) {
    next(error);
  }
};

/**
 * Approve company (Admin)
 */
const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      throw new NotFoundError('Company');
    }

    company.status = 'active';
    company.approved_by = req.user.id;
    company.approved_at = new Date();
    await company.save();

    // Create notification for company HR users
    const hrUsers = await HRUser.findAll({
      where: { company_id: company.id },
      include: [{ association: 'user' }]
    });

    for (const hrUser of hrUsers) {
      await createNotification(
        hrUser.user_id,
        'company_approved',
        'Company Approved',
        `Your company ${company.company_name} has been approved. You can now post jobs.`,
        '/hr/dashboard'
      );
    }

    res.json(formatResponse(company, 'Company approved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Reject company (Admin)
 */
const rejectCompany = async (req, res, next) => {
  try {
    const { rejection_reason } = req.body;

    if (!rejection_reason) {
      throw new ValidationError('Rejection reason is required');
    }

    const company = await Company.findByPk(req.params.id);

    if (!company) {
      throw new NotFoundError('Company');
    }

    company.status = 'rejected';
    company.approved_by = req.user.id;
    company.approved_at = new Date();
    company.rejection_reason = rejection_reason;
    await company.save();

    // Create notification for company HR users
    const hrUsers = await HRUser.findAll({
      where: { company_id: company.id },
      include: [{ association: 'user' }]
    });

    for (const hrUser of hrUsers) {
      await createNotification(
        hrUser.user_id,
        'company_rejected',
        'Company Rejected',
        `Your company ${company.company_name} has been rejected. Reason: ${rejection_reason}`,
        '/hr/dashboard'
      );
    }

    res.json(formatResponse(company, 'Company rejected'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  getAllCompanies,
  getPendingCompanies,
  approveCompany,
  rejectCompany
};

