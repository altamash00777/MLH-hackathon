const mongoose = require("mongoose");

const fpoSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    cropName: {
      type: String,
      required: true,
      trim: true
    },

    targetQuantity: {
      type: Number,
      required: true,
      min: 1
    },

    collectedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },

    remainingQuantity: {
      type: Number,
      required: true,
      min: 0
    },

    quality: {
      type: String,
      required: true
    },

    grade: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },
    targetPrice: {
      type: Number,
      required: true,
      min: 0
    },
    maxMembers: {
      type: Number,
      default: 50,
      min: 1
    },

    status: {
      type: String,
      enum: [
        "open",
        "full",
        "buyer_confirmed",
        "in_progress",
        "completed",
        "cancelled"
      ],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FPO", fpoSchema);