const {
    createNotification,
    createBulkNotifications,
    findNotificationById,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    markAsSent,
    deleteNotification,
    deleteUserNotifications,
    getPendingNotifications,
    getNotificationsByEntity,
    updateNotification,
    getNotificationStats
} = require('../../models/notification/notification.model');

async function httpCreateNotification(req, res) {
    try {
        const notificationData = req.body;
        
        // Validate required fields
        if (!notificationData.userId) {
            return res.status(400).json({
                error: 'User ID is required'
            });
        }
        
        if (!notificationData.type) {
            return res.status(400).json({
                error: 'Notification type is required'
            });
        }
        
        if (!notificationData.title || !notificationData.message) {
            return res.status(400).json({
                error: 'Title and message are required'
            });
        }
        
        const notification = await createNotification(notificationData);
        
        return res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({
            error: 'Failed to create notification',
            details: error.message
        });
    }
}

async function httpCreateBulkNotifications(req, res) {
    try {
        const { notifications } = req.body;
        
        if (!Array.isArray(notifications) || notifications.length === 0) {
            return res.status(400).json({
                error: 'Notifications array is required'
            });
        }
        
        const createdNotifications = await createBulkNotifications(notifications);
        
        return res.status(201).json({
            count: createdNotifications.length,
            notifications: createdNotifications
        });
    } catch (error) {
        console.error('Error creating bulk notifications:', error);
        return res.status(500).json({
            error: 'Failed to create bulk notifications',
            details: error.message
        });
    }
}

async function httpGetNotificationById(req, res) {
    try {
        const { id } = req.params;
        
        const notification = await findNotificationById(id);
        
        if (!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }
        
        return res.status(200).json(notification);
    } catch (error) {
        console.error('Error fetching notification:', error);
        return res.status(500).json({
            error: 'Failed to fetch notification',
            details: error.message
        });
    }
}

async function httpGetUserNotifications(req, res) {
    try {
        const { userId } = req.params;
        const filters = {
            isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
            type: req.query.type,
            isSent: req.query.isSent === 'true' ? true : req.query.isSent === 'false' ? false : undefined,
            limit: parseInt(req.query.limit) || 50,
            skip: parseInt(req.query.skip) || 0
        };
        
        const notifications = await getUserNotifications(userId, filters);
        
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching user notifications:', error);
        return res.status(500).json({
            error: 'Failed to fetch user notifications',
            details: error.message
        });
    }
}

async function httpGetUnreadCount(req, res) {
    try {
        const { userId } = req.params;
        
        const count = await getUnreadCount(userId);
        
        return res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return res.status(500).json({
            error: 'Failed to fetch unread count',
            details: error.message
        });
    }
}

async function httpMarkAsRead(req, res) {
    try {
        const { id } = req.params;
        
        const notification = await markAsRead(id);
        
        if (!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }
        
        return res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
            error: 'Failed to mark notification as read',
            details: error.message
        });
    }
}

async function httpMarkAllAsRead(req, res) {
    try {
        const { userId } = req.params;
        
        const result = await markAllAsRead(userId);
        
        return res.status(200).json({
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            error: 'Failed to mark all notifications as read',
            details: error.message
        });
    }
}

async function httpMarkAsSent(req, res) {
    try {
        const { id } = req.params;
        
        const notification = await markAsSent(id);
        
        if (!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }
        
        return res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as sent:', error);
        return res.status(500).json({
            error: 'Failed to mark notification as sent',
            details: error.message
        });
    }
}

async function httpDeleteNotification(req, res) {
    try {
        const { id } = req.params;
        
        const notification = await deleteNotification(id);
        
        if (!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }
        
        return res.status(200).json({
            message: 'Notification deleted successfully',
            notification
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({
            error: 'Failed to delete notification',
            details: error.message
        });
    }
}

async function httpDeleteUserNotifications(req, res) {
    try {
        const { userId } = req.params;
        const olderThanDays = parseInt(req.query.olderThanDays) || 30;
        
        const result = await deleteUserNotifications(userId, olderThanDays);
        
        return res.status(200).json({
            message: 'Old notifications deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting user notifications:', error);
        return res.status(500).json({
            error: 'Failed to delete user notifications',
            details: error.message
        });
    }
}

async function httpGetPendingNotifications(req, res) {
    try {
        const channel = req.query.channel;
        
        const notifications = await getPendingNotifications(channel);
        
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching pending notifications:', error);
        return res.status(500).json({
            error: 'Failed to fetch pending notifications',
            details: error.message
        });
    }
}

async function httpGetNotificationsByEntity(req, res) {
    try {
        const { entityType, entityId } = req.params;
        
        const notifications = await getNotificationsByEntity(entityType, entityId);
        
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications by entity:', error);
        return res.status(500).json({
            error: 'Failed to fetch notifications by entity',
            details: error.message
        });
    }
}

async function httpUpdateNotification(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Prevent updating certain fields
        delete updateData._id;
        delete updateData.userId;
        
        const notification = await updateNotification(id, updateData);
        
        if (!notification) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }
        
        return res.status(200).json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        return res.status(500).json({
            error: 'Failed to update notification',
            details: error.message
        });
    }
}

async function httpGetNotificationStats(req, res) {
    try {
        const { userId } = req.params;
        
        const stats = await getNotificationStats(userId);
        
        return res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching notification stats:', error);
        return res.status(500).json({
            error: 'Failed to fetch notification stats',
            details: error.message
        });
    }
}

module.exports = {
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
};