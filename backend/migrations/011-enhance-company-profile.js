'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('companies', 'company_size', {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Employee count range (e.g., 1-10, 11-50, 51-200, etc.)'
        });

        await queryInterface.addColumn('companies', 'founded_year', {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: 'Year company was founded'
        });

        await queryInterface.addColumn('companies', 'company_type', {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Type: Startup, SME, MNC, Government, Non-profit'
        });

        await queryInterface.addColumn('companies', 'headquarters', {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Full headquarters address'
        });

        await queryInterface.addColumn('companies', 'linkedin_url', {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'LinkedIn company profile URL'
        });

        await queryInterface.addColumn('companies', 'twitter_url', {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Twitter/X profile URL'
        });

        await queryInterface.addColumn('companies', 'specialties', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Array of company specialties/focus areas'
        });

        await queryInterface.addColumn('companies', 'company_culture', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Description of company culture and work environment'
        });

        await queryInterface.addColumn('companies', 'benefits', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Array of employee benefits'
        });

        await queryInterface.addColumn('companies', 'tech_stack', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Technologies and tools used'
        });

        await queryInterface.addColumn('companies', 'cover_image_url', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Cover/banner image URL'
        });

        await queryInterface.addColumn('companies', 'gallery_images', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Array of company gallery image URLs'
        });

        await queryInterface.addColumn('companies', 'mission_statement', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Company mission statement'
        });

        await queryInterface.addColumn('companies', 'vision_statement', {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Company vision statement'
        });

        await queryInterface.addColumn('companies', 'values', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Core company values'
        });

        await queryInterface.addColumn('companies', 'certifications', {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true,
            defaultValue: [],
            comment: 'Industry certifications and awards'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('companies', 'company_size');
        await queryInterface.removeColumn('companies', 'founded_year');
        await queryInterface.removeColumn('companies', 'company_type');
        await queryInterface.removeColumn('companies', 'headquarters');
        await queryInterface.removeColumn('companies', 'linkedin_url');
        await queryInterface.removeColumn('companies', 'twitter_url');
        await queryInterface.removeColumn('companies', 'specialties');
        await queryInterface.removeColumn('companies', 'company_culture');
        await queryInterface.removeColumn('companies', 'benefits');
        await queryInterface.removeColumn('companies', 'tech_stack');
        await queryInterface.removeColumn('companies', 'cover_image_url');
        await queryInterface.removeColumn('companies', 'gallery_images');
        await queryInterface.removeColumn('companies', 'mission_statement');
        await queryInterface.removeColumn('companies', 'vision_statement');
        await queryInterface.removeColumn('companies', 'values');
        await queryInterface.removeColumn('companies', 'certifications');
    }
};
