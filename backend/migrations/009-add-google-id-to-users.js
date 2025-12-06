'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get current table structure
    const tableDescription = await queryInterface.describeTable('users');
    
    // Add google_id column if it doesn't exist
    if (!tableDescription.google_id) {
      await queryInterface.addColumn('users', 'google_id', {
        type: Sequelize.STRING(255),
        allowNull: true
      });

      // Add unique index for google_id (only on non-null values)
      try {
        await queryInterface.sequelize.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id" 
          ON "users" ("google_id") 
          WHERE "google_id" IS NOT NULL;
        `);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }

    // Add avatar column if it doesn't exist
    if (!tableDescription.avatar) {
      await queryInterface.addColumn('users', 'avatar', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    // Add last_login column if it doesn't exist
    if (!tableDescription.last_login) {
      await queryInterface.addColumn('users', 'last_login', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }

    // Update role enum to include 'hr' if it doesn't exist
    try {
      // Check current enum values
      const enumCheck = await queryInterface.sequelize.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (
          SELECT oid 
          FROM pg_type 
          WHERE typname = 'enum_users_role'
        )
        ORDER BY enumsortorder;
      `, { type: Sequelize.QueryTypes.SELECT });

      const enumValues = enumCheck.map(row => row.enumlabel);
      
      // Add 'hr' to enum if it doesn't exist
      if (!enumValues.includes('hr')) {
        await queryInterface.sequelize.query(`
          ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'hr';
        `);
      }
    } catch (error) {
      // Enum might not exist or already have 'hr', continue
      console.log('Role enum update:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if columns exist before removing
    const tableDescription = await queryInterface.describeTable('users');
    
    // Remove last_login column if it exists
    if (tableDescription.last_login) {
      await queryInterface.removeColumn('users', 'last_login');
    }
    
    // Remove avatar column if it exists
    if (tableDescription.avatar) {
      await queryInterface.removeColumn('users', 'avatar');
    }
    
    // Remove google_id column if it exists
    if (tableDescription.google_id) {
      // Remove index first
      try {
        await queryInterface.removeIndex('users', 'users_google_id');
      } catch (error) {
        // Index might not exist, ignore error
      }
      
      // Remove column
      await queryInterface.removeColumn('users', 'google_id');
    }
    
    // Note: We don't remove 'hr' from enum as it might break existing data
  }
};

