const { User } = require('../models');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
// const { AppError } = require('../middleware/errorHandler');

// Setup AppError class if not available
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Request password reset - sends email with reset link
 */
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400);
        }

        // Find user by email
        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

        // Only send email if user exists, has a password (not just OAuth), and is active
        // Allowing 'hr', 'hr_manager', 'student', 'admin' - basically anyone who can login to Dakshath
        // But specifically targeting HR use case requested
        if (user && user.password && user.is_active) {
            // Generate reset token
            const resetToken = await user.generatePasswordResetToken();

            // Send reset email
            try {
                await emailService.sendPasswordResetEmail(email, resetToken, user.name);
                logger.info(`Password reset email sent to ${email}`);
            } catch (emailError) {
                logger.error('Failed to send password reset email:', emailError);
                // Clear the token if email fails
                await user.clearResetToken();
                throw new AppError('Failed to send reset email. Please try again later.', 500);
            }
        } else {
            // Log for debugging but don't reveal user existence
            logger.info(`Password reset requested for email: ${email} (User found: ${!!user})`);
        }

        // Always return success message (security best practice)
        res.json({
            success: true,
            message: 'If your email is registered, you will receive a password reset link shortly.'
        });
    } catch (error) {
        logger.error('Password reset request error:', error);
        next(error);
    }
};

/**
 * Validate reset token
 */
const validateResetToken = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            throw new AppError('Reset token is required', 400);
        }

        const user = await User.findByResetToken(token);

        if (!user || !user.isResetTokenValid()) {
            return res.json({
                success: false,
                valid: false,
                message: 'Invalid or expired reset token'
            });
        }

        res.json({
            success: true,
            valid: true,
            message: 'Token is valid'
        });
    } catch (error) {
        logger.error('Token validation error:', error);
        next(error);
    }
};

/**
 * Get user info for reset token
 */
const getResetTokenInfo = async (req, res, next) => {
    try {
        const { token } = req.params;

        if (!token) {
            throw new AppError('Reset token is required', 400);
        }

        const user = await User.findByResetToken(token);

        if (!user || !user.isResetTokenValid()) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        // Return masked email
        const email = user.email;
        const [localPart, domain] = email.split('@');
        const maskedEmail = localPart.length > 3
            ? `${localPart.substring(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`
            : `${localPart[0]}${'*'.repeat(localPart.length - 1)}@${domain}`;

        res.json({
            success: true,
            data: {
                email: maskedEmail,
                name: user.name
            }
        });
    } catch (error) {
        logger.error('Get reset token info error:', error);
        next(error);
    }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new AppError('Token and new password are required', 400);
        }

        if (newPassword.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }

        const user = await User.findByResetToken(token);

        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        if (!user.isResetTokenValid()) {
            throw new AppError('Reset token has expired', 400);
        }

        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            throw new AppError('New password must be different from your current password', 400);
        }

        // Update password
        const bcrypt = require('bcryptjs');
        user.password = await bcrypt.hash(newPassword, 12);

        // Clear token
        await user.clearResetToken();

        // Send confirmation
        try {
            await emailService.sendPasswordResetConfirmation(user.email, user.name);
        } catch (emailError) {
            logger.error('Failed to send password reset confirmation email:', emailError);
        }

        res.json({
            success: true,
            message: 'Password has been reset successfully.'
        });
    } catch (error) {
        logger.error('Password reset error:', error);
        next(error);
    }
};

module.exports = {
    requestPasswordReset,
    validateResetToken,
    getResetTokenInfo,
    resetPassword
};
