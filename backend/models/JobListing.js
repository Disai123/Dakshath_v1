module.exports = (sequelize, DataTypes) => {
  const JobListing = sequelize.define('JobListing', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    job_type: {
      type: DataTypes.ENUM('full-time', 'part-time', 'internship', 'contract'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    required_score_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    required_score_max: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    skill_requirements: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    qualifications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    salary_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    salary_max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    experience_level: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    application_deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    number_of_positions: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    posted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hr_users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'closed'),
      defaultValue: 'draft'
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
    tableName: 'job_listings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['required_score_min']
      },
      {
        fields: ['job_type']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['company_id', 'status']
      }
    ]
  });

  return JobListing;
};

