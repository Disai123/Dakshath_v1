'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_scores', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      overall_score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      course_average: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      test_average: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      project_average: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      hackathon_average: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      last_calculated_at: {
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

    await queryInterface.addIndex('student_scores', ['student_id'], {
      unique: true
    });
    await queryInterface.addIndex('student_scores', ['overall_score']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_scores');
  }
};

