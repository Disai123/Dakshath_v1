module.exports = (sequelize, DataTypes) => {
  const JobCategory = sequelize.define('JobCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'job_categories',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'job_categories',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        fields: ['parent_id']
      }
    ]
  });

  // Self-referential association
  JobCategory.hasMany(JobCategory, { foreignKey: 'parent_id', as: 'children' });
  JobCategory.belongsTo(JobCategory, { foreignKey: 'parent_id', as: 'parent' });

  return JobCategory;
};

