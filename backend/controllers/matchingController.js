const FarmerListing = require("../models/FarmerListing");
const BuyerRequirement = require("../models/BuyerRequirement");
const Match = require("../models/Match");

const { createMatch } = require("../utils/matchGenerator");


// ==========================================
// Find matches for logged-in farmer
// ==========================================

const findFarmerMatches = async (req, res) => {
  try {

    const farmerId = req.user.userId;

    // 1. Get farmer's active listings
    const listings = await FarmerListing.find({
      farmerId,
      status: "active"
    });

    if (listings.length === 0) {
      return res.status(200).json({
        message: "No active crop listings found",
        count: 0,
        matches: []
      });
    }


    // 2. Get all open buyer requirements
    const requirements = await BuyerRequirement.find({
      status: "open"
    });


    // 3. Generate matches
    for (const listing of listings) {

      for (const requirement of requirements) {

        await createMatch(
          listing,
          requirement
        );

      }
    }


    // 4. Get farmer's matches
    const matches = await Match.find({
      farmerId
    })
      .populate(
        "buyerId",
        "name companyName location phone email"
      )
      .populate("farmerListingId")
      .populate("buyerRequirementId")
      .sort({
        matchScore: -1
      });


    // 5. Return matches
    return res.status(200).json({
      count: matches.length,
      matches
    });


  } catch (error) {

    console.error(
      "Farmer matching error:",
      error
    );

    return res.status(500).json({
      message: "Error finding farmer matches",
      error: error.message
    });

  }
};



// ==========================================
// Find matches for logged-in buyer
// ==========================================

const findBuyerMatches = async (req, res) => {
  try {

    const buyerId = req.user.userId;

    // 1. Get buyer's open requirements
    const requirements = await BuyerRequirement.find({
      buyerId,
      status: "open"
    });

    if (requirements.length === 0) {
      return res.status(200).json({
        message: "No open buyer requirements found",
        count: 0,
        matches: []
      });
    }


    // 2. Get all active farmer listings
    const listings = await FarmerListing.find({
      status: "active"
    });


    // 3. Generate matches
    for (const requirement of requirements) {

      for (const listing of listings) {

        await createMatch(
          listing,
          requirement
        );

      }
    }


    // 4. Get buyer's matches
    const matches = await Match.find({
      buyerId
    })
      .populate(
        "farmerId",
        "name location phone email"
      )
      .populate("farmerListingId")
      .populate("buyerRequirementId")
      .sort({
        matchScore: -1
      });


    // 5. Return matches
    return res.status(200).json({
      count: matches.length,
      matches
    });


  } catch (error) {

    console.error(
      "Buyer matching error:",
      error
    );

    return res.status(500).json({
      message: "Error finding buyer matches",
      error: error.message
    });

  }
};


const contactMatch = async (req, res) => {
  try {

    const userId = req.user.userId;

    const { matchId } = req.params;


    // ==========================================
    // 1. Find match
    // ==========================================

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      });
    }


    // ==========================================
    // 2. Check whether user belongs to match
    // ==========================================

    const isFarmer =
      match.farmerId.toString() === userId;

    const isBuyer =
      match.buyerId.toString() === userId;


    if (!isFarmer && !isBuyer) {

      return res.status(403).json({
        message: "You are not part of this match"
      });

    }


    // ==========================================
    // 3. Check current status
    // ==========================================

    if (match.status === "rejected") {

      return res.status(400).json({
        message: "This match has been rejected"
      });

    }


    if (match.status === "accepted") {

      return res.status(400).json({
        message: "This match is already accepted"
      });

    }


    if (match.status === "contacted") {

      return res.status(400).json({
        message: "Connection request already sent"
      });

    }


    // ==========================================
    // 4. Save connection request
    // ==========================================

    match.status = "contacted";

    match.contactedBy = userId;

    await match.save();


    // ==========================================
    // 5. Return updated match
    // ==========================================

    const updatedMatch = await Match.findById(
      match._id
    )
      .populate(
        "farmerId",
        "name email phone location"
      )
      .populate(
        "buyerId",
        "name companyName email phone location"
      )
      .populate("farmerListingId")
      .populate("buyerRequirementId");


    return res.status(200).json({

      message: "Connection request sent successfully",

      match: updatedMatch

    });


  } catch (error) {

    console.error(
      "Contact match error:",
      error
    );

    return res.status(500).json({
      message: "Error sending connection request",
      error: error.message
    });

  }
};


const acceptMatch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { matchId } = req.params;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found"
      });
    }

    // Check that logged-in user belongs to this match
    const isFarmer =
      match.farmerId.toString() === userId;

    const isBuyer =
      match.buyerId.toString() === userId;

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({
        message: "You are not part of this match"
      });
    }

    // Must have a connection request first
    if (match.status !== "contacted") {
      return res.status(400).json({
        message: "There is no pending connection request"
      });
    }

    // The person who sent the request cannot accept their own request
    if (match.contactedBy.toString() === userId) {
      return res.status(403).json({
        message: "You cannot accept your own connection request"
      });
    }

    // Accept
    match.status = "accepted";

    await match.save();

    return res.status(200).json({
      message: "Connection accepted successfully",
      match
    });

  } catch (error) {

    console.error("Accept match error:", error);

    return res.status(500).json({
      message: "Error accepting connection",
      error: error.message
    });
  }
};









module.exports = {
  findFarmerMatches,
  findBuyerMatches,
  contactMatch,
  acceptMatch
};