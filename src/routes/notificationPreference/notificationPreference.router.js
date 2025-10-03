const express = require('express');
const {
    httpCreatePreference,
    httpGetPreferenceByUserId,
    httpGetAllPreferences,
    httpUpdatePreference,
    httpUpdateNotificationTypePreference,
    httpEnableDoNotDisturb,
    httpDisableDoNotDisturb,
    httpGetChannelsForNotificationType,
    httpCheckDoNotDisturbStatus,
    httpResetToDefault,
    httpDeletePreference
} = require('./notificationPreference.controller');

const notificationPreferenceRouter = express.Router();

// Get all preferences (admin)
notificationPreferenceRouter.get('/', httpGetAllPreferences);

// Create preference
notificationPreferenceRouter.post('/', httpCreatePreference);

// Get preference by user ID (will create default if not exists)
notificationPreferenceRouter.get('/user/:userId', httpGetPreferenceByUserId);

// Update preference
notificationPreferenceRouter.put('/user/:userId', httpUpdatePreference);

// Update specific notification type preference
notificationPreferenceRouter.patch('/user/:userId/type/:notificationType', httpUpdateNotificationTypePreference);

// Get channels for specific notification type
notificationPreferenceRouter.get('/user/:userId/type/:notificationType/channels', httpGetChannelsForNotificationType);

// Enable Do Not Disturb
notificationPreferenceRouter.post('/user/:userId/dnd/enable', httpEnableDoNotDisturb);

// Disable Do Not Disturb
notificationPreferenceRouter.post('/user/:userId/dnd/disable', httpDisableDoNotDisturb);

// Check if user is in Do Not Disturb period
notificationPreferenceRouter.get('/user/:userId/dnd/status', httpCheckDoNotDisturbStatus);

// Reset to default preferences
notificationPreferenceRouter.post('/user/:userId/reset', httpResetToDefault);

// Delete preference
notificationPreferenceRouter.delete('/user/:userId', httpDeletePreference);

module.exports = notificationPreferenceRouter;