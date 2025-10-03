const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: [
            "parcel_update",
            "consolidation_update",

            "warehouse_update",
            "system_alert",
            "payment_update"
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    entityType: {
        type: String,
        enum: ["Parcel", "Consolidation", "Warehouse"]
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },

    channels: [
        {
            type: String,
            enum: ['email', 'sms', 'push', 'in_app']
        }
    ],
    isRead: {
        type: Boolean,
        default: false
    },
    isSent: {
        type: Boolean,
        default: false
    },
    sentAt: Date,
    readAt: Date,
    createdTimestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Notification", NotificationSchema)
