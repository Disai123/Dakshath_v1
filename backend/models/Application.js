module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    job_listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'job_listings',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'),
      defaultValue: 'applied'
    },
    score_at_application: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    cover_letter: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hr_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'hr_users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    applied_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'applications',
    underscored: true,
    timestamps: false,
    createdAt: 'applied_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['student_id', 'job_listing_id']
      },
      {
        fields: ['student_id']
      },
      {
        fields: ['job_listing_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['applied_at']
      },
      {
        fields: ['student_id', 'status']
      },
      {
        fields: ['job_listing_id', 'status']
      }
    ]
  });

  return Application;
};

