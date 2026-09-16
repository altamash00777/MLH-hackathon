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

      farmerId: req.user.userId,

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

      farmerId: req.user.userId

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


// ==========================================
// UPDATE CROP
// ==========================================

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

// ### 2. Now create the listing again in Postman

// Use:

// **POST**

// ```text
// http://localhost:5000/api/farmer/listings
// ```

// Body:

// ```json
// {
//   "cropName": "Wheat",
//   "quantity": 100,
//   "quality": "Good",
//   "grade": "A",
//   "harvestDate": "2026-09-15",
//   "sellingLocation": "Lucknow",
//   "expectedPrice": 3000,
//   "productionCostPerQuintal": 2500,
//   "otherExpenses": 10000
// }
// ```

// You should now see these two fields in the response:

// ```json
// "productionCostPerQuintal": 2500,
// "otherExpenses": 10000
// ```

// ### 3. Important

// Your **old listing**:

// ```text
// FoodBD/Wheat listing ID: 6aa9f9484b65893470cf5d3b
// ```

// doesn't contain the new expense fields.

// So either **delete it and create a new listing**, or use your `PUT /api/farmer/listings/:id` endpoint to update it.

// After that, run:

// ```text
// GET /api/matches/farmer
// ```

// Then we should finally see:

// ```text
// matchedQuantity
// netRealization
// profit
// breakEvenPrice
// profitPerQuintal
// ```

// **Do this first and send me the new `POST /api/farmer/listings` response.** Then we'll verify it before touching the matching/distance code.
