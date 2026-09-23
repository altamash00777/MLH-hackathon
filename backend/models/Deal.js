const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    // ==========================================
    // MATCH REFERENCE
    // ==========================================

    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      unique: true
    },

    // ==========================================
    // FARMER & BUYER
    // ==========================================

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    farmerListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmerListing",
      required: true
    },

    buyerRequirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyerRequirement",
      required: true
    },

    // ==========================================
    // DEAL INFORMATION
    // ==========================================

    cropName: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    agreedPrice: {
      type: Number,
      required: true,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // ==========================================
    // DEAL STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "pickup_scheduled",
        "in_transit",
        "delivered",
        "payment_pending",
        "completed",
        "cancelled"
      ],
      default: "pending"
    },

    // ==========================================
    // TASKS / COORDINATION
    // ==========================================

    tasks: {
      farmer: {
        quantityConfirmed: {
          type: Boolean,
          default: false
        },

        produceReady: {
          type: Boolean,
          default: false
        }
      },

      buyer: {
        dealConfirmed: {
          type: Boolean,
          default: false
        },

        pickupConfirmed: {
          type: Boolean,
          default: false
        }
      },

      logistics: {
        pickupScheduled: {
          type: Boolean,
          default: false
        },

        pickupCompleted: {
          type: Boolean,
          default: false
        },

        deliveryCompleted: {
          type: Boolean,
          default: false
        }
      },

      payment: {
        completed: {
          type: Boolean,
          default: false
        }
      }
    },

    // ==========================================
    // TRANSPORT
    // ==========================================

    transport: {
      distanceKm: {
        type: Number,
        default: 0
      },

      vehicleCount: {
        type: Number,
        default: 0
      },

      estimatedCost: {
        type: Number,
        default: 0
      },

      pickupDate: {
        type: Date,
        default: null
      },

      pickupTime: {
        type: String,
        default: null
      },

      status: {
        type: String,
        enum: [
          "not_scheduled",
          "scheduled",
          "picked_up",
          "delivered"
        ],
        default: "not_scheduled"
      }
    },

    // ==========================================
    // PAYMENT
    // ==========================================

    payment: {
      amount: {
        type: Number,
        default: 0
      },

      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "completed",
          "failed"
        ],
        default: "pending"
      },

      paidAt: {
        type: Date,
        default: null
      }
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Deal", dealSchema);