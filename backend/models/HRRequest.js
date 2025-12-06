module.exports = (sequelize, DataTypes) => {
  const HRRequest = sequelize.define('HRRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'applications',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    hr_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hr_users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    request_type: {
      type: DataTypes.ENUM('status_update', 'interview_schedule', 'assignment', 'other'),
      allowNull: false
    },
    requested_status: {
      type: DataTypes.ENUM('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
      defaultValue: 'pending'
    },
    processed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'hr_requests',
    underscored: true,
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['application_id']
      },
      {
        fields: ['hr_user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['request_type']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  return HRRequest;
};

