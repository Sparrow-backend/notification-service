const {
    createPreference,
    findPreferenceByUserId,
    getOrCreatePreference,
    updatePreference,
    updateNotificationTypePreference,
    enableDoNotDisturb,
    disableDoNotDisturb,
    getChannelsForNotificationType,
    isInDoNotDisturbPeriod,
    deletePreference,
    getAllPreferences,
    resetToDefault
} = require('../../models/notificationPreference/notificationPreference.model');

async function httpCreatePreference(req, res) {
    try {
        const preferenceData = req.body;
        
        if (!preferenceData.userId) {
            return res.status(400).json({
                error: 'User ID is required'
            });
        }
        
        // Check if preference already exists
        const existing = await findPreferenceByUserId(preferenceData.userId);
        if (existing) {
            return res.status(409).json({
                error: 'Preference already exists for this user'
            });
        }
        
        const preference = await createPreference(preferenceData);
        
        return res.status(201).json(preference);
    } catch (error) {
        console.error('Error creating preference:', error);
        return res.status(500).json({
            error: 'Failed to create preference',
            details: error.message
        });
    }
}

async function httpGetPreferenceByUserId(req, res) {
    try {
        const { userId } = req.params;
        
        const preference = await getOrCreatePreference(userId);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error fetching preference:', error);
        return res.status(500).json({
            error: 'Failed to fetch preference',
            details: error.message
        });
    }
}

async function httpGetAllPreferences(req, res) {
    try {
        const preferences = await getAllPreferences();
        
        return res.status(200).json(preferences);
    } catch (error) {
        console.error('Error fetching all preferences:', error);
        return res.status(500).json({
            error: 'Failed to fetch preferences',
            details: error.message
        });
    }
}

async function httpUpdatePreference(req, res) {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        
        // Remove userId from update data to prevent modification
        delete updateData.userId;
        
        const preference = await updatePreference(userId, updateData);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error updating preference:', error);
        return res.status(500).json({
            error: 'Failed to update preference',
            details: error.message
        });
    }
}

async function httpUpdateNotificationTypePreference(req, res) {
    try {
        const { userId, notificationType } = req.params;
        const { channels } = req.body;
        
        if (!Array.isArray(channels)) {
            return res.status(400).json({
                error: 'Channels must be an array'
            });
        }
        
        const validChannels = ['email', 'sms', 'push', 'in_app'];
        const invalidChannels = channels.filter(c => !validChannels.includes(c));
        
        if (invalidChannels.length > 0) {
            return res.status(400).json({
                error: `Invalid channels: ${invalidChannels.join(', ')}`
            });
        }
        
        const preference = await updateNotificationTypePreference(userId, notificationType, channels);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error updating notification type preference:', error);
        return res.status(500).json({
            error: 'Failed to update notification type preference',
            details: error.message
        });
    }
}

async function httpEnableDoNotDisturb(req, res) {
    try {
        const { userId } = req.params;
        const { from, to } = req.body;
        
        if (!from || !to) {
            return res.status(400).json({
                error: 'From and to times are required (format: HH:MM)'
            });
        }
        
        // Validate time format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(from) || !timeRegex.test(to)) {
            return res.status(400).json({
                error: 'Invalid time format. Use HH:MM (24-hour format)'
            });
        }
        
        const preference = await enableDoNotDisturb(userId, from, to);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error enabling do not disturb:', error);
        return res.status(500).json({
            error: 'Failed to enable do not disturb',
            details: error.message
        });
    }
}

async function httpDisableDoNotDisturb(req, res) {
    try {
        const { userId } = req.params;
        
        const preference = await disableDoNotDisturb(userId);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error disabling do not disturb:', error);
        return res.status(500).json({
            error: 'Failed to disable do not disturb',
            details: error.message
        });
    }
}

async function httpGetChannelsForNotificationType(req, res) {
    try {
        const { userId, notificationType } = req.params;
        
        const channels = await getChannelsForNotificationType(userId, notificationType);
        
        return res.status(200).json({ channels });
    } catch (error) {
        console.error('Error fetching channels:', error);
        return res.status(500).json({
            error: 'Failed to fetch channels',
            details: error.message
        });
    }
}

async function httpCheckDoNotDisturbStatus(req, res) {
    try {
        const { userId } = req.params;
        
        const isInDND = await isInDoNotDisturbPeriod(userId);
        
        return res.status(200).json({ isInDoNotDisturbPeriod: isInDND });
    } catch (error) {
        console.error('Error checking DND status:', error);
        return res.status(500).json({
            error: 'Failed to check DND status',
            details: error.message
        });
    }
}

async function httpResetToDefault(req, res) {
    try {
        const { userId } = req.params;
        
        const preference = await resetToDefault(userId);
        
        return res.status(200).json(preference);
    } catch (error) {
        console.error('Error resetting preference:', error);
        return res.status(500).json({
            error: 'Failed to reset preference',
            details: error.message
        });
    }
}

async function httpDeletePreference(req, res) {
    try {
        const { userId } = req.params;
        
        const preference = await deletePreference(userId);
        
        if (!preference) {
            return res.status(404).json({
                error: 'Preference not found'
            });
        }
        
        return res.status(200).json({
            message: 'Preference deleted successfully',
            preference
        });
    } catch (error) {
        console.error('Error deleting preference:', error);
        return res.status(500).json({
            error: 'Failed to delete preference',
            details: error.message
        });
    }
}

module.exports = {
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
};