const { getUserNotifications, markAsRead, markAllAsRead, getUnreadCount } = require('../services/notificationService');
const { formatResponse, paginate } = require('../utils/helpers');

/**
 * Get user notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, offset, getMeta } = paginate(req.query.page, req.query.limit);
    const { is_read } = req.query;

    const result = await getUserNotifications(req.user.id, limit, offset);

    // Filter by read status if provided
    let notifications = result.rows;
    if (is_read !== undefined) {
      const readFilter = is_read === 'true';
      notifications = notifications.filter(n => n.is_read === readFilter);
    }

    res.json(formatResponse(notifications, null, getMeta(result.count)));
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id, req.user.id);
    res.json(formatResponse(notification, 'Notification marked as read'));
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await markAllAsRead(req.user.id);
    res.json(formatResponse(null, 'All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread count
 */
const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const count = await getUnreadCount(req.user.id);
    res.json(formatResponse({ unread_count: count }));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount
};

