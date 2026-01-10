module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // New comprehensive fields
    company_size: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    founded_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    headquarters: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    linkedin_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    twitter_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    specialties: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    company_culture: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    benefits: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    tech_stack: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    cover_image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gallery_images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    mission_statement: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vision_statement: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    values: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'suspended', 'rejected'),
      defaultValue: 'pending'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
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
    tableName: 'companies',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['approved_by']
      }
    ]
  });

  return Company;
};

