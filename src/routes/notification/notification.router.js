const express = require('express');
const {
    httpCreateNotification,
    httpCreateBulkNotifications,
    httpGetNotificationById,
    httpGetUserNotifications,
    httpGetUnreadCount,
    httpMarkAsRead,
    httpMarkAllAsRead,
    httpMarkAsSent,
    httpDeleteNotification,
    httpDeleteUserNotifications,
    httpGetPendingNotifications,
    httpGetNotificationsByEntity,
    httpUpdateNotification,
    httpGetNotificationStats
} = require('./notification.controller');

const notificationRouter = express.Router();

// Get pending notifications (for processing)
notificationRouter.get('/pending', httpGetPendingNotifications);

// Create a single notification
notificationRouter.post('/', httpCreateNotification);

// Create bulk notifications
notificationRouter.post('/bulk', httpCreateBulkNotifications);

// Get notification by ID
notificationRouter.get('/:id', httpGetNotificationById);

// Get notifications by user ID
notificationRouter.get('/user/:userId', httpGetUserNotifications);

// Get unread count for a user
notificationRouter.get('/user/:userId/unread-count', httpGetUnreadCount);

// Get notification stats for a user
notificationRouter.get('/user/:userId/stats', httpGetNotificationStats);

// Mark notification as read
notificationRouter.patch('/:id/read', httpMarkAsRead);

// Mark all notifications as read for a user
notificationRouter.patch('/user/:userId/read-all', httpMarkAllAsRead);

// Mark notification as sent
notificationRouter.patch('/:id/sent', httpMarkAsSent);

// Get notifications by entity
notificationRouter.get('/entity/:entityType/:entityId', httpGetNotificationsByEntity);

// Update notification
notificationRouter.put('/:id', httpUpdateNotification);

// Delete notification
notificationRouter.delete('/:id', httpDeleteNotification);

// Delete old user notifications
notificationRouter.delete('/user/:userId/cleanup', httpDeleteUserNotifications);

module.exports = notificationRouter;