'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('applications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      job_listing_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'job_listings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'),
        defaultValue: 'applied'
      },
      score_at_application: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      cover_letter: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hr_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reviewed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'hr_users',
          key: 'id'
        }
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('applications', ['student_id', 'job_listing_id'], {
      unique: true,
      name: 'applications_student_job_unique'
    });
    await queryInterface.addIndex('applications', ['student_id']);
    await queryInterface.addIndex('applications', ['job_listing_id']);
    await queryInterface.addIndex('applications', ['status']);
    await queryInterface.addIndex('applications', ['applied_at']);
    await queryInterface.addIndex('applications', ['student_id', 'status']);
    await queryInterface.addIndex('applications', ['job_listing_id', 'status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('applications');
  }
};

