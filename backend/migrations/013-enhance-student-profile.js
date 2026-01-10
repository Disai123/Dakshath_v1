'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Personal Information
        await queryInterface.addColumn('users', 'phone', {
            type: Sequelize.STRING(20),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'date_of_birth', {
            type: Sequelize.DATE,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'gender', {
            type: Sequelize.STRING(20),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'address', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'city', {
            type: Sequelize.STRING(100),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'state', {
            type: Sequelize.STRING(100),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'country', {
            type: Sequelize.STRING(100),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'pincode', {
            type: Sequelize.STRING(20),
            allowNull: true
        });

        // Education
        await queryInterface.addColumn('users', 'current_education', {
            type: Sequelize.STRING(100),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'institution', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'graduation_year', {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'cgpa', {
            type: Sequelize.DECIMAL(4, 2),
            allowNull: true
        });

        // Professional
        await queryInterface.addColumn('users', 'skills', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: []
        });

        await queryInterface.addColumn('users', 'bio', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('users', 'linkedin_url', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'github_url', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        await queryInterface.addColumn('users', 'portfolio_url', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        // Documents
        await queryInterface.addColumn('users', 'resume_url', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        // Profile completion tracking
        await queryInterface.addColumn('users', 'profile_completed', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });

        await queryInterface.addColumn('users', 'profile_completed_at', {
            type: Sequelize.DATE,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'phone');
        await queryInterface.removeColumn('users', 'date_of_birth');
        await queryInterface.removeColumn('users', 'gender');
        await queryInterface.removeColumn('users', 'address');
        await queryInterface.removeColumn('users', 'city');
        await queryInterface.removeColumn('users', 'state');
        await queryInterface.removeColumn('users', 'country');
        await queryInterface.removeColumn('users', 'pincode');
        await queryInterface.removeColumn('users', 'current_education');
        await queryInterface.removeColumn('users', 'institution');
        await queryInterface.removeColumn('users', 'graduation_year');
        await queryInterface.removeColumn('users', 'cgpa');
        await queryInterface.removeColumn('users', 'skills');
        await queryInterface.removeColumn('users', 'bio');
        await queryInterface.removeColumn('users', 'linkedin_url');
        await queryInterface.removeColumn('users', 'github_url');
        await queryInterface.removeColumn('users', 'portfolio_url');
        await queryInterface.removeColumn('users', 'resume_url');
        await queryInterface.removeColumn('users', 'profile_completed');
        await queryInterface.removeColumn('users', 'profile_completed_at');
    }
};
