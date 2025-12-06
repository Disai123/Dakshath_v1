'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hr_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'applications',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      hr_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hr_users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      request_type: {
        type: Sequelize.ENUM('status_update', 'interview_schedule', 'assignment', 'other'),
        allowNull: false
      },
      requested_status: {
        type: Sequelize.ENUM('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'),
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
      },
      processed_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('hr_requests', ['application_id']);
    await queryInterface.addIndex('hr_requests', ['hr_user_id']);
    await queryInterface.addIndex('hr_requests', ['status']);
    await queryInterface.addIndex('hr_requests', ['request_type']);
    await queryInterface.addIndex('hr_requests', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hr_requests');
  }
};

