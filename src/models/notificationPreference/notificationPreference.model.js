const NotificationPreference = require('./notificationPreference.mongo');

async function createPreference(preferenceData) {
    const preference = new NotificationPreference(preferenceData);
    return await preference.save();
}

async function findPreferenceByUserId(userId) {
    return await NotificationPreference.findOne({ userId });
}

async function getOrCreatePreference(userId) {
    let preference = await NotificationPreference.findOne({ userId });
    
    if (!preference) {
        // Create default preferences
        preference = new NotificationPreference({
            userId,
            preferences: {
                parcel_update: ['email', 'in_app'],
                consolidation_update: ['email', 'in_app'],
                warehouse_update: ['in_app'],
                system_alert: ['email', 'in_app'],
                payment_update: ['email', 'in_app']
            },
            doNotDisturb: {
                enabled: false
            }
        });
        await preference.save();
    }
    
    return preference;
}

async function updatePreference(userId, updateData) {
    return await NotificationPreference.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true, upsert: true }
    );
}

async function updateNotificationTypePreference(userId, notificationType, channels) {
    const updateField = `preferences.${notificationType}`;
    
    return await NotificationPreference.findOneAndUpdate(
        { userId },
        { $set: { [updateField]: channels } },
        { new: true, runValidators: true }
    );
}

async function enableDoNotDisturb(userId, from, to) {
    return await NotificationPreference.findOneAndUpdate(
        { userId },
        {
            $set: {
                'doNotDisturb.enabled': true,
                'doNotDisturb.from': from,
                'doNotDisturb.to': to
            }
        },
        { new: true }
    );
}

async function disableDoNotDisturb(userId) {
    return await NotificationPreference.findOneAndUpdate(
        { userId },
        {
            $set: {
                'doNotDisturb.enabled': false
            }
        },
        { new: true }
    );
}

async function getChannelsForNotificationType(userId, notificationType) {
    const preference = await NotificationPreference.findOne({ userId });
    
    if (!preference) {
        // Return default channels if no preference exists
        return ['email', 'in_app'];
    }
    
    return preference.preferences[notificationType] || [];
}

async function isInDoNotDisturbPeriod(userId) {
    const preference = await NotificationPreference.findOne({ userId });
    
    if (!preference || !preference.doNotDisturb.enabled) {
        return false;
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { from, to } = preference.doNotDisturb;
    
    // Handle cases where DND spans midnight
    if (from < to) {
        return currentTime >= from && currentTime < to;
    } else {
        return currentTime >= from || currentTime < to;
    }
}

async function deletePreference(userId) {
    return await NotificationPreference.findOneAndDelete({ userId });
}

async function getAllPreferences() {
    return await NotificationPreference.find().populate('userId', 'name email');
}

async function resetToDefault(userId) {
    return await NotificationPreference.findOneAndUpdate(
        { userId },
        {
            $set: {
                preferences: {
                    parcel_update: ['email', 'in_app'],
                    consolidation_update: ['email', 'in_app'],
                    warehouse_update: ['in_app'],
                    system_alert: ['email', 'in_app'],
                    payment_update: ['email', 'in_app']
                },
                doNotDisturb: {
                    enabled: false
                }
            }
        },
        { new: true }
    );
}

module.exports = {
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
};