const mongoose = require("mongoose");

const farmerListingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

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

    quality: {
      type: String,
      required: true
    },

    grade: {
      type: String,
      required: true
    },

    harvestDate: {
      type: Date,
      required: true
    },

    sellingLocation: {
      type: String,
      required: true
    },

    expectedPrice: {
      type: Number,
      required: true,
      min: 0
    },

productionCostPerQuintal: {
  type: Number,
  required: true,
  min: 0
},

otherExpenses: {
  type: Number,
  default: 0,
  min: 0
},







    status: {
      type: String,
      enum: ["active", "matched", "sold", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "FarmerListing",
  farmerListingSchema
);