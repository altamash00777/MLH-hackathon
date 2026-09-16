const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Farmer who receives the notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Buyer who accepted the connection
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Match related to this notification
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true
    },

    // Notification type
    type: {
      type: String,
      enum: ["connection_accepted"],
      required: true
    },

    // Notification heading
    title: {
      type: String,
      required: true
    },

    // Notification message
    message: {
      type: String,
      required: true
    },

    // Whether farmer has opened it
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
