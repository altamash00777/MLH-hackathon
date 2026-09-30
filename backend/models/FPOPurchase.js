const mongoose = require("mongoose");

const fpoPurchaseSchema = new mongoose.Schema(
  {
    fpoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FPO",
      required: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    pricePerQuintal: {
      type: Number,
      required: true,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "FPOPurchase",
  fpoPurchaseSchema
);