const FPO = require("../models/FPO");
const FarmerListing = require("../models/FarmerListing");
const FPOContribution = require("../models/FPOContribution");
const FPOPurchase = require("../models/FPOPurchase");

// ==========================================
// CREATE FPO
// ==========================================

const createFPO = async (req, res) => {
  try {
    const {
      listingId,
      name,
      targetQuantity
    } = req.body;

    // ==========================================
    // 1. VALIDATE INPUT
    // ==========================================

    if (!listingId || !name || !targetQuantity) {
      return res.status(400).json({
        message:
          "listingId, name and targetQuantity are required"
      });
    }

    // ==========================================
    // 2. FIND FARMER'S LISTING
    // ==========================================

    const listing = await FarmerListing.findOne({
      _id: listingId,
      farmerId: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        message:
          "Crop listing not found or does not belong to you"
      });
    }


    if (listing.status !== "active") {
      return res.status(400).json({
        message:
          "Only active crop listings can be used to create an FPO"
      });
    }

    if (Number(targetQuantity) <= 0) {
      return res.status(400).json({
        message:
          "Target quantity must be greater than 0"
      });
    }

    const fpo = await FPO.create({
      leaderId: req.user._id,

      name: name.trim(),

      cropName: listing.cropName,

      targetQuantity: Number(targetQuantity),

      collectedQuantity: 0,

      remainingQuantity: Number(targetQuantity),

      quality: listing.quality,

      grade: listing.grade,

      location: listing.sellingLocation,

      targetPrice: listing.expectedPrice,

      status: "open"
    });

    res.status(201).json({
      message: "FPO created successfully",
      fpo
    });

  } catch (error) {
    console.error("Create FPO error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ==========================================
// JOIN FPO
// ==========================================

const joinFPO = async (req, res) => {
  try {
    const { fpoId } = req.params;
    const { listingId, quantity } = req.body;

    // 1. Validate input
    if (!listingId || !quantity) {
      return res.status(400).json({
        message: "listingId and quantity are required"
      });
    }

    const contributionQuantity = Number(quantity);

    if (contributionQuantity <= 0) {
      return res.status(400).json({
        message: "Contribution quantity must be greater than 0"
      });
    }

    // 2. Find FPO
    const fpo = await FPO.findById(fpoId);

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    // 3. Check FPO status
    if (fpo.status !== "open") {
      return res.status(400).json({
        message: "This FPO is no longer accepting members"
      });
    }

    // 4. Find farmer's listing
    const listing = await FarmerListing.findOne({
      _id: listingId,
      farmerId: req.user._id
    });

    if (!listing) {
      return res.status(404).json({
        message:
          "Crop listing not found or does not belong to you"
      });
    }

    // 5. Listing must be active
    if (listing.status !== "active") {
      return res.status(400).json({
        message: "Only active crop listings can join an FPO"
      });
    }

    // 6. Crop must match FPO crop
    if (
      listing.cropName.toLowerCase() !==
      fpo.cropName.toLowerCase()
    ) {
      return res.status(400).json({
        message:
          `This FPO is for ${fpo.cropName}, but your listing is for ${listing.cropName}`
      });
    }

    // 7. Check FPO remaining quantity
    if (contributionQuantity > fpo.remainingQuantity) {
      return res.status(400).json({
        message:
          `Only ${fpo.remainingQuantity} quintals are required for this FPO`
      });
    }

    // 8. Check listing quantity
if (contributionQuantity > listing.availableQuantity) {
  return res.status(400).json({
    message:
      `Only ${listing.availableQuantity} quintals are available in this listing`
  });
}
    // 9. Create contribution
    const contribution = await FPOContribution.create({
      fpoId: fpo._id,
      farmerId: req.user._id,
      listingId: listing._id,
      quantity: contributionQuantity,
      status: "reserved"
    });
listing.availableQuantity -= contributionQuantity;
listing.reservedQuantity += contributionQuantity;

await listing.save();
    // 10. Update FPO quantities
    fpo.collectedQuantity += contributionQuantity;
    fpo.remainingQuantity -= contributionQuantity;

    // 11. If target reached, mark FPO as full
    if (fpo.remainingQuantity === 0) {
      fpo.status = "full";
    }

    await fpo.save();

    res.status(201).json({
      message: "Successfully joined FPO",
      contribution,
      fpo: {
        id: fpo._id,
        collectedQuantity: fpo.collectedQuantity,
        remainingQuantity: fpo.remainingQuantity,
        status: fpo.status
      }
    });

  } catch (error) {
    console.error("Join FPO error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getAvailableFPOs = async (req, res) => {
  try {
    // Get farmer's active listings
    const listings = await FarmerListing.find({
      farmerId: req.user._id,
      status: "active",
      availableQuantity: { $gt: 0 }
    });

    // If farmer has no available listings
    if (listings.length === 0) {
      return res.status(200).json({
        message: "No active crop listings available",
        fpos: []
      });
    }

    // Get crops the farmer currently has available
    const cropNames = listings.map(
      listing => listing.cropName.toLowerCase()
    );

    // Find open FPOs for those crops
    const fpos = await FPO.find({
      status: "open",
      remainingQuantity: { $gt: 0 }
    }).sort({ createdAt: -1 });

    // Only keep FPOs matching farmer's available crops
    const availableFPOs = fpos.filter(fpo =>
      cropNames.includes(fpo.cropName.toLowerCase())
    );

    res.status(200).json({
      count: availableFPOs.length,
      fpos: availableFPOs
    });

  } catch (error) {
    console.error("Get available FPOs error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const getFPOById = async (req, res) => {
  try {
    const { fpoId } = req.params;

    const fpo = await FPO.findById(fpoId)
      .populate("leaderId", "name email phone location");

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    res.status(200).json({
      fpo
    });

  } catch (error) {
    console.error("Get FPO details error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const getFPOContributions = async (req, res) => {
  try {
    const { fpoId } = req.params;

    const fpo = await FPO.findById(fpoId);

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    const contributions = await FPOContribution.find({
      fpoId: fpoId
    })
      .populate("farmerId", "name email phone location")
      .populate(
        "listingId",
        "cropName quantity availableQuantity reservedQuantity"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      fpo: {
        id: fpo._id,
        name: fpo.name,
        cropName: fpo.cropName,
        targetQuantity: fpo.targetQuantity,
        collectedQuantity: fpo.collectedQuantity,
        remainingQuantity: fpo.remainingQuantity,
        status: fpo.status
      },
      count: contributions.length,
      contributions
    });

  } catch (error) {
    console.error("Get FPO contributions error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
// buyerr
const getBuyerFPOs = async (req, res) => {
  try {
    const fpos = await FPO.find({
      collectedQuantity: { $gt: 0 },
      status: {
        $in: ["open", "full", "buyer_confirmed", "in_progress"]
      }
    })
      .populate("leaderId", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: fpos.length,
      fpos
    });

  } catch (error) {
    console.error("Get buyer FPOs error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getBuyerFPOById = async (req, res) => {
  try {
    const { fpoId } = req.params;

    const fpo = await FPO.findById(fpoId)
      .populate("leaderId", "name location");

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    if (fpo.collectedQuantity <= 0) {
      return res.status(400).json({
        message: "This FPO has no available produce"
      });
    }

    const contributionCount = await FPOContribution.countDocuments({
      fpoId: fpo._id
    });

    res.status(200).json({
      fpo: {
        id: fpo._id,
        name: fpo.name,
        cropName: fpo.cropName,
        targetQuantity: fpo.targetQuantity,
        availableQuantity: fpo.collectedQuantity,
        remainingTarget: fpo.remainingQuantity,
        quality: fpo.quality,
        grade: fpo.grade,
        location: fpo.location,
        targetPrice: fpo.targetPrice,
        status: fpo.status,
        memberCount: contributionCount,
        leader: fpo.leaderId
      }
    });

  } catch (error) {
    console.error("Get buyer FPO details error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const createFPOPurchase = async (req, res) => {
  try {
    const { fpoId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({
        message: "Quantity is required"
      });
    }

    const purchaseQuantity = Number(quantity);

    if (purchaseQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    const fpo = await FPO.findById(fpoId);

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    if (fpo.collectedQuantity <= 0) {
      return res.status(400).json({
        message: "This FPO has no available produce"
      });
    }

    if (purchaseQuantity > fpo.collectedQuantity) {
      return res.status(400).json({
        message:
          `Only ${fpo.collectedQuantity} quintals are available`
      });
    }

    const pricePerQuintal = fpo.targetPrice;

    const totalAmount =
      purchaseQuantity * pricePerQuintal;

    const purchase = await FPOPurchase.create({
      fpoId: fpo._id,
      buyerId: req.user._id,
      quantity: purchaseQuantity,
      pricePerQuintal,
      totalAmount,
      status: "pending"
    });

    res.status(201).json({
      message: "FPO purchase request created successfully",
      purchase
    });

  } catch (error) {
    console.error("Create FPO purchase error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const getFPOPurchases = async (req, res) => {
  try {
    const { fpoId } = req.params;

    const fpo = await FPO.findById(fpoId);

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    if (fpo.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the FPO leader can view purchase requests"
      });
    }

    const purchases = await FPOPurchase.find({
      fpoId: fpo._id
    })
      .populate("buyerId", "name email phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      fpo: {
        id: fpo._id,
        name: fpo.name,
        cropName: fpo.cropName,
        collectedQuantity: fpo.collectedQuantity
      },
      count: purchases.length,
      purchases
    });

  } catch (error) {
    console.error("Get FPO purchases error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateFPOPurchaseStatus = async (req, res) => {  try {
    const { fpoId, purchaseId } = req.params;
    const { action } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        message: "Action must be accept or reject"
      });
    }

    const fpo = await FPO.findById(fpoId);

    if (!fpo) {
      return res.status(404).json({
        message: "FPO not found"
      });
    }

    if (fpo.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the FPO leader can update purchase requests"
      });
    }

    const purchase = await FPOPurchase.findOne({
      _id: purchaseId,
      fpoId: fpoId
    });

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase request not found"
      });
    }

    if (purchase.status !== "pending") {
      return res.status(400).json({
        message: "This purchase request has already been processed"
      });
    }

    if (action === "reject") {
      purchase.status = "rejected";
      await purchase.save();

      return res.status(200).json({
        message: "Purchase request rejected",
        purchase
      });
    }

    if (purchase.quantity > fpo.collectedQuantity) {
      return res.status(400).json({
        message:
          `Only ${fpo.collectedQuantity} quintals are currently available`
      });
    }

    fpo.collectedQuantity -= purchase.quantity;

    purchase.status = "accepted";

    await fpo.save();
    await purchase.save();

    res.status(200).json({
      message: "Purchase request accepted",
      purchase,
      fpo: {
        id: fpo._id,
        collectedQuantity: fpo.collectedQuantity,
        remainingQuantity: fpo.remainingQuantity
      }
    });

  } catch (error) {
    console.error("Update FPO purchase status error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
const getMyFPOPurchases = async (req, res) => {
  try {
    const purchases = await FPOPurchase.find({
      buyerId: req.user._id
    })
      .populate(
        "fpoId",
        "name cropName location targetPrice status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: purchases.length,
      purchases
    });

  } catch (error) {
    console.error("Get my FPO purchases error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  createFPO,
  joinFPO,
  getAvailableFPOs,
  getFPOById,
  getFPOContributions,
  getBuyerFPOs,
  getBuyerFPOById,
  createFPOPurchase,
  getFPOPurchases,
  updateFPOPurchaseStatus,
  getMyFPOPurchases
};