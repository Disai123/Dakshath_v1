const { Notification } = require('../models');

/**
 * Create notification
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string|null} link - Optional link
 * @param {Object|null} transaction - Optional Sequelize transaction
 */
const createNotification = async (userId, type, title, message, link = null, transaction = null) => {
  const options = transaction ? { transaction } : {};
  return await Notification.create({
    user_id: userId,
    type,
    title,
    message,
    link,
    is_read: false
  }, options);
};

/**
 * Get user notifications
 */
const getUserNotifications = async (userId, limit = 50, offset = 0) => {
  return await Notification.findAndCountAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId }
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  notification.is_read = true;
  await notification.save();

  return notification;
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (userId) => {
  return await Notification.update(
    { is_read: true },
    { where: { user_id: userId, is_read: false } }
  );
};

/**
 * Get unread count
 */
const getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { user_id: userId, is_read: false }
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};

