module.exports = (sequelize, DataTypes) => {
  const StudentScore = sequelize.define('StudentScore', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    overall_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    course_average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    test_average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    project_average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    hackathon_average: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    last_calculated_at: {
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
    tableName: 'student_scores',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['student_id']
      },
      {
        fields: ['overall_score']
      }
    ]
  });

  return StudentScore;
};

