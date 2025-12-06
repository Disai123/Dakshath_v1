const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions || {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Company = require('./Company')(sequelize, Sequelize.DataTypes);
const HRUser = require('./HRUser')(sequelize, Sequelize.DataTypes);
const JobListing = require('./JobListing')(sequelize, Sequelize.DataTypes);
const Application = require('./Application')(sequelize, Sequelize.DataTypes);
const ApplicationStatusHistory = require('./ApplicationStatusHistory')(sequelize, Sequelize.DataTypes);
const StudentScore = require('./StudentScore')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
const JobCategory = require('./JobCategory')(sequelize, Sequelize.DataTypes);
const HRRequest = require('./HRRequest')(sequelize, Sequelize.DataTypes);

// Define associations
// Company associations
Company.hasMany(HRUser, { foreignKey: 'company_id', as: 'hrUsers' });
Company.hasMany(JobListing, { foreignKey: 'company_id', as: 'jobListings' });
HRUser.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// HR User associations
HRUser.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
HRUser.hasMany(JobListing, { foreignKey: 'posted_by', as: 'postedJobs' });

// Job Listing associations
JobListing.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
JobListing.belongsTo(HRUser, { foreignKey: 'posted_by', as: 'postedBy' });
JobListing.hasMany(Application, { foreignKey: 'job_listing_id', as: 'applications' });

// Application associations
Application.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
Application.belongsTo(JobListing, { foreignKey: 'job_listing_id', as: 'jobListing' });
Application.belongsTo(HRUser, { foreignKey: 'reviewed_by', as: 'reviewedBy' });
Application.hasMany(ApplicationStatusHistory, { foreignKey: 'application_id', as: 'statusHistory' });

// Application Status History associations
ApplicationStatusHistory.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });
ApplicationStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedBy' });

// HRRequest associations
HRRequest.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });
HRRequest.belongsTo(HRUser, { foreignKey: 'hr_user_id', as: 'hrUser' });
HRRequest.belongsTo(User, { foreignKey: 'processed_by', as: 'processedBy' });
Application.hasMany(HRRequest, { foreignKey: 'application_id', as: 'hrRequests' });
HRUser.hasMany(HRRequest, { foreignKey: 'hr_user_id', as: 'requests' });

// Student Score associations
StudentScore.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User associations (for LMS tables - read-only)
// Note: We don't define these associations here to avoid modifying LMS models
// We'll access them through raw queries or by reading the LMS models if available

module.exports = {
  sequelize,
  Sequelize,
  User,
  Company,
  HRUser,
  JobListing,
  Application,
  ApplicationStatusHistory,
  StudentScore,
  Notification,
  JobCategory,
  HRRequest
};

