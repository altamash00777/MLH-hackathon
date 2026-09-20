const FarmerListing = require("../models/FarmerListing");
const BuyerRequirement = require("../models/BuyerRequirement");
const Match = require("../models/Match");
const Notification = require("../models/Notification");

const { createMatch } =
  require("../utils/matchGenerator");

const calculateNetRealization =
  require("../utils/netRealization");


// =====================================================
// FARMER MATCHES
// =====================================================

const findFarmerMatches = async (req, res) => {
  try {

    const listings =
      await FarmerListing.find({
        farmerId: req.user._id,
        status: "active"
      });

    const requirements =
      await BuyerRequirement.find({
        status: "open"
      });


    // =================================================
    // CREATE / REUSE MATCHES
    // =================================================

const matchPromises = [];

for (const listing of listings) {
  for (const requirement of requirements) {
    matchPromises.push(
      createMatch(listing, requirement)
    );
  }
}

await Promise.all(matchPromises);

    // =================================================
    // GET MATCHES
    // =================================================

    const matches =
      await Match.find({
        farmerListingId: {
          $in: listings.map(
            listing => listing._id
          )
        }
      })
        .populate("farmerListingId")
        .populate("buyerRequirementId");


    const result = [];


    // =================================================
    // CALCULATE DETAILS
    // =================================================

    for (const match of matches) {

      const listing =
        match.farmerListingId;

      const requirement =
        match.buyerRequirementId;


      if (!listing || !requirement) {
        continue;
      }


      // =================================================
      // MATCHED QUANTITY
      // =================================================

      const matchedQuantity =
        Math.min(
          listing.quantity,
          requirement.requiredQuantity
        );


      // =================================================
      // TEMPORARY LOGISTICS
      // DISTANCE API REMOVED
      // =================================================

      const distance = {

        origin:
          listing.sellingLocation,

        destination:
          requirement.location,

        distanceKm:
          0,

        durationMinutes:
          0

      };


      const transport = {

        quantity:
          matchedQuantity,

        distanceKm:
          0,

        vehicleCapacity:
          100,

        vehiclesRequired:
          0,

        costPerKm:
          50,

        transportCost:
          0

      };


      // =================================================
      // NET REALIZATION
      // =================================================

      const netRealization =
        calculateNetRealization({

          totalQuantity:
            listing.quantity,

          matchedQuantity:
            matchedQuantity,

          productionCostPerQuintal:
            listing.productionCostPerQuintal,

          otherExpenses:
            listing.otherExpenses || 0,

          sellingPrice:
            requirement.expectedPrice,

          transportCost:
            0,

          storageCost:
            0,

          marketCharges:
            0

        });


      // =================================================
      // ADD RESULT
      // =================================================

      result.push({

        match,

        matchedQuantity,

        distance,

        transport,

        netRealization

      });

    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      count:
        result.length,

      matches:
        result

    });

  } catch (error) {

    console.error(
      "Find Farmer Matches Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Error finding farmer matches",

      error:
        error.message

    });

  }

};


// =====================================================
// BUYER MATCHES
// =====================================================

const findBuyerMatches = async (req, res) => {

  try {

    const requirements =
      await BuyerRequirement.find({
        buyerId: req.user._id,
        status: "open"
      });


    const listings =
      await FarmerListing.find({
        status: "active"
      });


    // =================================================
    // CREATE / REUSE MATCHES
    // =================================================

const matchPromises = [];

for (const listing of listings) {
  for (const requirement of requirements) {
    matchPromises.push(
      createMatch(listing, requirement)
    );
  }
}

await Promise.all(matchPromises);


    // =================================================
    // GET MATCHES
    // =================================================

const matches =
  await Match.find({
    buyerRequirementId: {
      $in: requirements.map(
        requirement =>
          requirement._id
      )
    }
  })
    .populate("farmerId")
    .populate("farmerListingId")
    .populate("buyerRequirementId");

    const result = [];


    // =================================================
    // CALCULATE DETAILS
    // =================================================

    for (const match of matches) {

      const listing =
        match.farmerListingId;

      const requirement =
        match.buyerRequirementId;


      if (!listing || !requirement) {
        continue;
      }


      // =================================================
      // MATCHED QUANTITY
      // =================================================

      const matchedQuantity =
        Math.min(
          listing.quantity,
          requirement.requiredQuantity
        );


      // =================================================
      // TEMPORARY LOGISTICS
      // DISTANCE API REMOVED
      // =================================================

      const distance = {

        origin:
          listing.sellingLocation,

        destination:
          requirement.location,

        distanceKm:
          0,

        durationMinutes:
          0

      };


      const transport = {

        quantity:
          matchedQuantity,

        distanceKm:
          0,

        vehicleCapacity:
          100,

        vehiclesRequired:
          0,

        costPerKm:
          50,

        transportCost:
          0

      };


      // =================================================
      // NET REALIZATION
      // =================================================

      const netRealization =
        calculateNetRealization({

          totalQuantity:
            listing.quantity,

          matchedQuantity:
            matchedQuantity,

          productionCostPerQuintal:
            listing.productionCostPerQuintal,

          otherExpenses:
            listing.otherExpenses || 0,

          sellingPrice:
            requirement.expectedPrice,

          transportCost:
            0,

          storageCost:
            0,

          marketCharges:
            0

        });


      // =================================================
      // ADD RESULT
      // =================================================

      result.push({

        match,

        matchedQuantity,

        distance,

        transport,

        netRealization

      });

    }


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      count:
        result.length,

      matches:
        result

    });

  } catch (error) {

    console.error(
      "Find Buyer Matches Error:",
      error

    );

    return res.status(500).json({

      success: false,

      message:
        "Error finding buyer matches",

      error:
        error.message

    });

  }

};


// =====================================================
// CONTACT MATCH
// =====================================================

const contactMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    const loggedInUserId = req.user._id.toString();
    const farmerId = match.farmerId.toString();
    const buyerId = match.buyerId.toString();

    // =================================================
    // AUTHORIZATION
    // =================================================

    if (
      loggedInUserId !== farmerId &&
      loggedInUserId !== buyerId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // =================================================
    // DUPLICATE CONTACT
    // =================================================

    if (
      match.status === "contacted" ||
      match.status === "accepted"
    ) {
      return res.status(400).json({
        success: false,
        message: "This match has already been contacted"
      });
    }

    // =================================================
    // UPDATE MATCH
    // =================================================

    match.contactedBy = req.user._id;
    match.status = "contacted";

    await match.save();

    // =================================================
    // FIND RECEIVER
    // =================================================

    const receiverId =
      loggedInUserId === farmerId
        ? match.buyerId
        : match.farmerId;

    // =================================================
    // CREATE NOTIFICATION
    // =================================================

    await Notification.create({
      recipientId: receiverId,
      senderId: req.user._id,
      matchId: match._id,
      type: "connection_accepted",
      title: "New Connection Request",
      message: "A user is interested in your crop match.",
      isRead: false
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Contact request sent successfully",
      match
    });

  } catch (error) {
    console.error(
      "Contact Match Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error contacting match",
      error: error.message
    });
  }
};


// =====================================================
// ACCEPT MATCH
// =====================================================

const acceptMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    // =================================================
    // ONLY BUYER CAN ACCEPT
    // =================================================

    if (
      req.user._id.toString() !==
      match.buyerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the buyer can accept this match"
      });
    }

    // =================================================
    // UPDATE STATUS
    // =================================================

    match.status = "accepted";

    await match.save();

    // =================================================
    // NOTIFY FARMER
    // =================================================

    await Notification.create({
      recipientId: match.farmerId,
      senderId: req.user._id,
      matchId: match._id,
      type: "connection_accepted",
      title: "Connection Accepted",
      message: "Buyer accepted your crop match.",
      isRead: false
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Match accepted successfully",
      match
    });

  } catch (error) {
    console.error(
      "Accept Match Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error accepting match",
      error: error.message
    });
  }
};
// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  findFarmerMatches,

  findBuyerMatches,

  contactMatch,

  acceptMatch

};
