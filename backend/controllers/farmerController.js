const FarmerListing = require("../models/FarmerListing");

// Create crop listing
const createListing = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      quality,
      grade,
      harvestDate,
      sellingLocation,
      expectedPrice
    } = req.body;

    if (
      !cropName ||
      !quantity ||
      !quality ||
      !grade ||
      !harvestDate ||
      !sellingLocation ||
      !expectedPrice
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const listing = await FarmerListing.create({
      farmerId: req.user.userId,
      cropName,
      quantity,
      quality,
      grade,
      harvestDate,
      sellingLocation,
      expectedPrice
    });

    res.status(201).json({
      message: "Crop listing created successfully",
      listing
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get all crops of logged-in farmer
const getMyListings = async (req, res) => {
  try {
    const listings = await FarmerListing.find({
      farmerId: req.user.userId
    }).sort({ createdAt: -1 });

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


// Get single crop
const getListingById = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user.userId
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


// Update crop
const updateListing = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user.userId
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
      status
    } = req.body;

    listing.cropName = cropName ?? listing.cropName;
    listing.quantity = quantity ?? listing.quantity;
    listing.quality = quality ?? listing.quality;
    listing.grade = grade ?? listing.grade;
    listing.harvestDate = harvestDate ?? listing.harvestDate;
    listing.sellingLocation =
      sellingLocation ?? listing.sellingLocation;
    listing.expectedPrice =
      expectedPrice ?? listing.expectedPrice;
    listing.status = status ?? listing.status;

    await listing.save();

    res.status(200).json({
      message: "Crop listing updated successfully",
      listing
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete crop
const deleteListing = async (req, res) => {
  try {
    const listing = await FarmerListing.findOne({
      _id: req.params.id,
      farmerId: req.user.userId
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


module.exports = {
  createListing,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing
};