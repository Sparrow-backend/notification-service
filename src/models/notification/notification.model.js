const Notification = require('./notification.mongo');

async function createNotification(notificationData) {
    const notification = new Notification(notificationData);
    return await notification.save();
}

async function createBulkNotifications(notificationsArray) {
    return await Notification.insertMany(notificationsArray);
}

async function findNotificationById(id) {
    return await Notification.findById(id).populate('userId', 'name email');
}

async function getUserNotifications(userId, filters = {}) {
    const query = { userId };
    
    if (filters.isRead !== undefined) {
        query.isRead = filters.isRead;
    }
    
    if (filters.type) {
        query.type = filters.type;
    }
    
    if (filters.isSent !== undefined) {
        query.isSent = filters.isSent;
    }
    
    const limit = filters.limit || 50;
    const skip = filters.skip || 0;
    
    return await Notification.find(query)
        .sort({ createdTimestamp: -1 })
        .limit(limit)
        .skip(skip);
}

async function getUnreadCount(userId) {
    return await Notification.countDocuments({
        userId,
        isRead: false
    });
}

async function markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
        notificationId,
        {
            $set: {
                isRead: true,
                readAt: new Date()
            }
        },
        { new: true }
    );
}

async function markAllAsRead(userId) {
    return await Notification.updateMany(
        { userId, isRead: false },
        {
            $set: {
                isRead: true,
                readAt: new Date()
            }
        }
    );
}

async function markAsSent(notificationId) {
    return await Notification.findByIdAndUpdate(
        notificationId,
        {
            $set: {
                isSent: true,
                sentAt: new Date()
            }
        },
        { new: true }
    );
}

async function deleteNotification(id) {
    return await Notification.findByIdAndDelete(id);
}

async function deleteUserNotifications(userId, olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    return await Notification.deleteMany({
        userId,
        createdTimestamp: { $lt: cutoffDate },
        isRead: true
    });
}

async function getPendingNotifications(channel = null) {
    const query = { isSent: false };
    
    if (channel) {
        query.channels = channel;
    }
    
    return await Notification.find(query)
        .populate('userId', 'name email phone')
        .sort({ createdTimestamp: 1 })
        .limit(100);
}

async function getNotificationsByEntity(entityType, entityId) {
    return await Notification.find({
        entityType,
        entityId
    })
        .populate('userId', 'name email')
        .sort({ createdTimestamp: -1 });
}

async function updateNotification(id, updateData) {
    return await Notification.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
}

async function getNotificationStats(userId) {
    const stats = await Notification.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$type',
                total: { $sum: 1 },
                unread: {
                    $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
                }
            }
        }
    ]);
    
    return stats;
}

module.exports = {
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
};