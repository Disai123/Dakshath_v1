module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define('ApplicationStatusHistory', {
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
    status: {
      type: DataTypes.ENUM('applied', 'under_review', 'interview_scheduled', 'accepted', 'rejected'),
      allowNull: false
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'application_status_history',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        fields: ['application_id']
      },
      {
        fields: ['changed_at']
      }
    ]
  });

  return ApplicationStatusHistory;
};

