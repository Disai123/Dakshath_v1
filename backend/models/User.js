module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    google_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
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
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'student', 'hr'),
      allowNull: false,
      defaultValue: 'student'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Personal Information
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pincode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    // Education
    current_education: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    graduation_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cgpa: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true
    },
    // Professional
    skills: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: []
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedin_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    github_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    portfolio_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // Documents
    resume_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Profile completion
    profile_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    profile_completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Don't try to sync the table - it already exists
    freezeTableName: true
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function (candidatePassword) {
    if (!this.password) {
      return false;
    }
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generatePasswordResetToken = async function () {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token and expiration (1 hour from now)
    this.reset_password_token = hashedToken;
    this.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour

    await this.save();

    // Return the unhashed token to send via email
    return resetToken;
  };

  User.prototype.isResetTokenValid = function () {
    if (!this.reset_password_token || !this.reset_password_expires) {
      return false;
    }
    return new Date() < new Date(this.reset_password_expires);
  };

  User.prototype.clearResetToken = async function () {
    this.reset_password_token = null;
    this.reset_password_expires = null;
    await this.save();
  };

  // Class methods
  User.findByResetToken = async function (token) {
    const bcrypt = require('bcryptjs');
    const { Op } = require('sequelize');

    // Find all users with non-null reset tokens that haven't expired
    const users = await this.findAll({
      where: {
        reset_password_token: { [Op.ne]: null },
        reset_password_expires: { [Op.gt]: new Date() }
      }
    });

    // Check each user's hashed token against the provided token
    for (const user of users) {
      const isMatch = await bcrypt.compare(token, user.reset_password_token);
      if (isMatch) {
        return user;
      }
    }

    return null;
  };

  // Instance method to get public profile
  User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
