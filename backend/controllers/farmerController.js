const FarmerListing = require("../models/FarmerListing");

// ==========================================
// CREATE CROP LISTING
// ==========================================

const createListing = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      quality,
      grade,
      harvestDate,
      sellingLocation,
      expectedPrice,
      productionCostPerQuintal,
      otherExpenses
    } = req.body;

    // Check required fields
    if (
      !cropName ||
      !quantity ||
      !quality ||
      !grade ||
      !harvestDate ||
      !sellingLocation ||
      expectedPrice === undefined ||
      productionCostPerQuintal === undefined
    ) {
      return res.status(400).json({
        message: "All required fields are required"
      });
    }

    // Create listing
    const listing = await FarmerListing.create({
      // IMPORTANT: farmer ID comes from authenticated user
      farmerId: req.user._id,

      cropName,
      quantity,
      quality,
      grade,
      harvestDate,
      sellingLocation,
      expectedPrice,
      productionCostPerQuintal,
      otherExpenses: otherExpenses || 0
    });

    res.status(201).json({
      message: "Crop listing created successfully",
      listing
    });

  } catch (error) {
    console.error("Create listing error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ==========================================
// GET ALL CROPS OF LOGGED-IN FARMER
// ==========================================

const getMyListings = async (req, res) => {
  try {
    const listings = await FarmerListing.find({
      farmerId: req.user._id
    }).sort({
      createdAt: -1
    });

    res.status(200).json({
      count: listings.length,
      listings
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// GET SINGLE CROP
// ==========================================

const getListingById = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        message: "Crop listing not found"
      });
    }

    res.status(200).json({
      listing
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// UPDATE CROP
// ==========================================

const updateListing = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        message: "Crop listing not found"
      });
    }

    const {
      cropName,
      quantity,
      quality,
      grade,
      harvestDate,
      sellingLocation,
      expectedPrice,
      productionCostPerQuintal,
      otherExpenses,
      status
    } = req.body;

    listing.cropName =
      cropName ?? listing.cropName;

    listing.quantity =
      quantity ?? listing.quantity;

    listing.quality =
      quality ?? listing.quality;

    listing.grade =
      grade ?? listing.grade;

    listing.harvestDate =
      harvestDate ?? listing.harvestDate;

    listing.sellingLocation =
      sellingLocation ?? listing.sellingLocation;

    listing.expectedPrice =
      expectedPrice ?? listing.expectedPrice;

    listing.productionCostPerQuintal =
      productionCostPerQuintal ??
      listing.productionCostPerQuintal;

    listing.otherExpenses =
      otherExpenses ?? listing.otherExpenses;

    listing.status =
      status ?? listing.status;

    await listing.save();

    res.status(200).json({
      message: "Crop listing updated successfully",
      listing
    });

  } catch (error) {
    console.error("Update listing error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ==========================================
// DELETE CROP
// ==========================================

const deleteListing = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        message: "Crop listing not found"
      });
    }

    await FarmerListing.deleteOne({
      _id: listing._id
    });

    res.status(200).json({
      message: "Crop listing deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing
};
