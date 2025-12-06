const { HRRequest, Application, JobListing, User, Company, HRUser } = require('../models');
const { formatResponse, paginate } = require('../utils/helpers');
const { NotFoundError, AuthorizationError, ValidationError } = require('../utils/errors');
const { createNotification } = require('../services/notificationService');
const { Op } = require('sequelize');

/**
 * Create HR request (HR)
 */
const createHRRequest = async (req, res, next) => {
  try {
    const { application_id, request_type, requested_status, message } = req.body;

    // Validate required fields
    if (!application_id || !request_type || !message) {
      throw new ValidationError('application_id, request_type, and message are required');
    }

    // Check if application exists and belongs to HR's company
    const application = await Application.findByPk(application_id, {
      include: [
        {
          association: 'jobListing',
          include: [{ association: 'company' }]
        }
      ]
    });

    if (!application) {
      throw new NotFoundError('Application');
    }

    // Check authorization - HR can only create requests for their company's applications
    if (req.user.role !== 'admin' && application.jobListing.company_id !== req.user.company_id) {
      throw new AuthorizationError('Not authorized to create request for this application');
    }

    // Get HR user
    const hrUser = await HRUser.findOne({
      where: { user_id: req.user.id, company_id: req.user.company_id }
    });

    if (!hrUser) {
      throw new AuthorizationError('HR user not found');
    }

    // Create request
    const request = await HRRequest.create({
      application_id,
      hr_user_id: hrUser.id,
      request_type,
      requested_status: requested_status || null,
      message,
      status: 'pending'
    });

    // Notify all admins
    const admins = await User.findAll({
      where: { role: 'admin', is_active: true }
    });

    for (const admin of admins) {
      await createNotification(
        admin.id,
        'hr_request',
        'New HR Request',
        `HR from ${application.jobListing.company.company_name} has created a request for application #${application_id}`,
        `/admin/requests/${request.id}`
      );
    }

    const createdRequest = await HRRequest.findByPk(request.id, {
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [{ association: 'company' }]
            },
            {
              association: 'student',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          association: 'hrUser',
          include: [{ association: 'user', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    res.status(201).json(formatResponse(createdRequest, 'Request created successfully. Admin will review and process it.'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get all HR requests (Admin)
 */
const getAllHRRequests = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status, request_type, company_id } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (request_type) {
      where.request_type = request_type;
    }

    const { count, rows } = await HRRequest.findAndCountAll({
      where,
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [
                {
                  association: 'company',
                  attributes: ['id', 'company_name', 'logo_url']
                }
              ]
            },
            {
              association: 'student',
              attributes: ['id', 'name', 'email', 'avatar']
            }
          ]
        },
        {
          association: 'hrUser',
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email']
            },
            {
              association: 'company',
              attributes: ['id', 'company_name']
            }
          ]
        },
        {
          association: 'processedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Filter by company_id if provided
    let filteredRows = rows;
    if (company_id) {
      filteredRows = rows.filter(req => req.application?.jobListing?.company_id === parseInt(company_id));
    }

    res.json(formatResponse(filteredRows, null, getMeta(count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Get HR requests for a specific HR user
 */
const getHRUserRequests = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { status } = req.query;

    // Get HR user
    const hrUser = await HRUser.findOne({
      where: { user_id: req.user.id, company_id: req.user.company_id }
    });

    if (!hrUser) {
      throw new AuthorizationError('HR user not found');
    }

    const where = {
      hr_user_id: hrUser.id
    };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await HRRequest.findAndCountAll({
      where,
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [{ association: 'company' }]
            },
            {
              association: 'student',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          association: 'processedBy',
          attributes: ['id', 'name', 'email']
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
 * Get HR request by ID
 */
const getHRRequestById = async (req, res, next) => {
  try {
    const request = await HRRequest.findByPk(req.params.id, {
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [{ association: 'company' }]
            },
            {
              association: 'student',
              attributes: ['id', 'name', 'email', 'avatar']
            },
            {
              association: 'statusHistory',
              order: [['changed_at', 'DESC']]
            }
          ]
        },
        {
          association: 'hrUser',
          include: [
            {
              association: 'user',
              attributes: ['id', 'name', 'email']
            },
            {
              association: 'company',
              attributes: ['id', 'company_name']
            }
          ]
        },
        {
          association: 'processedBy',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!request) {
      throw new NotFoundError('HR Request');
    }

    // Check authorization
    if (req.user.role === 'hr') {
      const hrUser = await HRUser.findOne({
        where: { user_id: req.user.id, company_id: req.user.company_id }
      });
      if (request.hr_user_id !== hrUser.id) {
        throw new AuthorizationError('Not authorized to view this request');
      }
    } else if (req.user.role !== 'admin') {
      throw new AuthorizationError('Not authorized to view this request');
    }

    res.json(formatResponse(request));
  } catch (error) {
    next(error);
  }
};

/**
 * Process HR request (Admin)
 */
const processHRRequest = async (req, res, next) => {
  try {
    const { action, admin_notes, application_status } = req.body;

    if (!action || !['approve', 'reject'].includes(action)) {
      throw new ValidationError('action must be either "approve" or "reject"');
    }

    const request = await HRRequest.findByPk(req.params.id, {
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [{ association: 'company' }]
            },
            {
              association: 'student'
            }
          ]
        },
        {
          association: 'hrUser',
          include: [{ association: 'user' }]
        }
      ]
    });

    if (!request) {
      throw new NotFoundError('HR Request');
    }

    if (request.status !== 'pending') {
      throw new ValidationError('Request has already been processed');
    }

    // Update request status
    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.processed_by = req.user.id;
    request.processed_at = new Date();
    if (admin_notes) {
      request.admin_notes = admin_notes;
    }
    await request.save();

    // If approved and it's a status update request, update the application
    if (action === 'approve' && request.request_type === 'status_update' && request.requested_status) {
      const application = request.application;
      const ApplicationStatusHistory = require('../models').ApplicationStatusHistory;

      // Update application status
      application.status = request.requested_status;
      application.reviewed_by = request.hr_user_id;
      application.reviewed_at = new Date();
      await application.save();

      // Create status history
      await ApplicationStatusHistory.create({
        application_id: application.id,
        status: request.requested_status,
        changed_by: req.user.id,
        notes: `Status updated via HR request. Admin notes: ${admin_notes || 'N/A'}`
      });

      // Notify student (from admin)
      await createNotification(
        application.student_id,
        'application_status_update',
        'Application Status Updated',
        `Your application for ${application.jobListing.title} has been updated to ${request.requested_status.replace('_', ' ')}`,
        `/applications/${application.id}`
      );

      // Mark request as completed
      request.status = 'completed';
      await request.save();
    }

    // Notify HR user
    await createNotification(
      request.hrUser.user_id,
      'hr_request_processed',
      'HR Request Processed',
      `Your request for application #${request.application_id} has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      `/hr/requests/${request.id}`
    );

    const updatedRequest = await HRRequest.findByPk(request.id, {
      include: [
        {
          association: 'application',
          include: [
            {
              association: 'jobListing',
              include: [{ association: 'company' }]
            },
            {
              association: 'student',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          association: 'hrUser',
          include: [{ association: 'user', attributes: ['id', 'name', 'email'] }]
        },
        {
          association: 'processedBy',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(formatResponse(updatedRequest, `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHRRequest,
  getAllHRRequests,
  getHRUserRequests,
  getHRRequestById,
  processHRRequest
};

