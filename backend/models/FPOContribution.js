const mongoose = require("mongoose");

const fpoContributionSchema = new mongoose.Schema(
  {
    // FPO to which this contribution belongs
    fpoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FPO",
      required: true
    },

    // Farmer who contributed
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Original farmer listing
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmerListing",
      required: true
    },

    // Quantity contributed from this listing
    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    // Contribution status
    status: {
      type: String,
      enum: [
        "reserved",
        "confirmed",
        "picked_up",
        "delivered",
        "paid"
      ],
      default: "reserved"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "FPOContribution",
  fpoContributionSchema
);