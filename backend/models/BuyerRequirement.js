const mongoose = require("mongoose");

const buyerRequirementSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cropName: {
      type: String,
      required: true,
      trim: true
    },

    requiredQuantity: {
      type: Number,
      required: true,
      min: 1
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

    expectedPrice: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["open", "matched", "closed", "inactive"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "BuyerRequirement",
  buyerRequirementSchema
);