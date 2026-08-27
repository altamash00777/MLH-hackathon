const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    // ==========================================
    // FARMER
    // ==========================================

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    farmerListingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmerListing",
      required: true
    },


    // ==========================================
    // BUYER
    // ==========================================

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    buyerRequirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyerRequirement",
      required: true
    },


    // ==========================================
    // MATCH SCORES
    // ==========================================

    cropScore: {
      type: Number,
      default: 0
    },

    quantityScore: {
      type: Number,
      default: 0
    },

    qualityScore: {
      type: Number,
      default: 0
    },

    gradeScore: {
      type: Number,
      default: 0
    },

    locationScore: {
      type: Number,
      default: 0
    },

    priceScore: {
      type: Number,
      default: 0
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },


    // ==========================================
    // CONNECTION
    // ==========================================

    contactedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },


    status: {
      type: String,
      enum: [
        "new",
        "viewed",
        "contacted",
        "accepted",
        "rejected"
      ],
      default: "new"
    }
  },

  {
    timestamps: true
  }
);


// ==========================================
// PREVENT DUPLICATE MATCHES
// ==========================================

matchSchema.index(
  {
    farmerListingId: 1,
    buyerRequirementId: 1
  },
  {
    unique: true
  }
);


module.exports = mongoose.model(
  "Match",
  matchSchema
);