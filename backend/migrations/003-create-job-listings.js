'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_listings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      job_type: {
        type: Sequelize.ENUM('full-time', 'part-time', 'internship', 'contract'),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      required_score_min: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      required_score_max: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      skill_requirements: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      qualifications: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      salary_min: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      salary_max: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      experience_level: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      application_deadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      number_of_positions: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      posted_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hr_users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'closed'),
        defaultValue: 'draft'
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

    await queryInterface.addIndex('job_listings', ['company_id']);
    await queryInterface.addIndex('job_listings', ['status']);
    await queryInterface.addIndex('job_listings', ['required_score_min']);
    await queryInterface.addIndex('job_listings', ['job_type']);
    await queryInterface.addIndex('job_listings', ['created_at']);
    await queryInterface.addIndex('job_listings', ['company_id', 'status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('job_listings');
  }
};

