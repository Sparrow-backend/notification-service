const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    preferences: {
      parcel_update: [{ type: String, enum: ["email", "sms", "push", "in_app"] }],
      consolidation_update: [{ type: String, enum: ["email", "sms", "push", "in_app"] }],
      warehouse_update: [{ type: String, enum: ["email", "sms", "push", "in_app"] }],
      system_alert: [{ type: String, enum: ["email", "sms", "push", "in_app"] }],
      payment_update: [{ type: String, enum: ["email", "sms", "push", "in_app"] }],
    },

    doNotDisturb: {
      enabled: { type: Boolean, default: false },
      from: String, // e.g. "22:00"
      to: String,   // e.g. "07:00"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationPreference", notificationPreferenceSchema);
