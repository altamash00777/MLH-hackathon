const FarmerListing = require("../models/FarmerListing");
const BuyerRequirement = require("../models/BuyerRequirement");
const Match = require("../models/Match");
const Notification = require("../models/Notification");

const { createMatch } =
  require("../utils/matchGenerator");

const calculateNetRealization =
  require("../utils/netRealization");

const calculateDistance =
  require("../utils/distanceCalculator");

const calculateTransportCost =
  require("../utils/transportCalculator");

const VEHICLE_CAPACITY = 100;
const COST_PER_KM = 50;


const findFarmerMatches = async (req, res) => {
  try {
    // const listings =
    //   await FarmerListing.find({
    //     farmerId: req.user._id,
    //     status: "active"
    //   });



console.log("LOGGED IN FARMER ID:", req.user._id);

const allListings =
  await FarmerListing.find({});

console.log("ALL FARMER LISTINGS:", allListings);

const listings =
  await FarmerListing.find({
    farmerId: req.user._id,
    status: "active"
  });

console.log("FILTERED LISTINGS:", listings);



    const requirements =
      await BuyerRequirement.find({
        status: "open"
      });

console.log("LISTINGS:", listings);
console.log("REQUIREMENTS:", requirements);


    for (const listing of listings) {
      for (const requirement of requirements) {
        await createMatch(
          listing,
          requirement
        );
      }
    }

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

    for (const match of matches) {

      const listing =
        match.farmerListingId;

      const requirement =
        match.buyerRequirementId;

      const matchedQuantity =
        Math.min(
          listing.quantity,
          requirement.requiredQuantity
        );

      const distance =
        await calculateDistance(
          listing.sellingLocation,
          requirement.location
        );

      const transport =
        calculateTransportCost({
          quantity: matchedQuantity,
          distanceKm: distance.distanceKm,
          vehicleCapacity: VEHICLE_CAPACITY,
          costPerKm: COST_PER_KM
        });

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
            transport.transportCost,

          storageCost: 0,

          marketCharges: 0
        });

      result.push({
        match,
        matchedQuantity,
        distance,
        transport,
        netRealization
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      matches: result
    });

  } catch (error) {

    console.error(
      "Find Farmer Matches Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error finding farmer matches",
      error: error.message
    });
  }
};


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

    for (const listing of listings) {
      for (const requirement of requirements) {
        await createMatch(
          listing,
          requirement
        );
      }
    }

    const matches =
      await Match.find({
        buyerRequirementId: {
          $in: requirements.map(
            requirement =>
              requirement._id
          )
        }
      })
        .populate("farmerListingId")
        .populate("buyerRequirementId");

    const result = [];

    for (const match of matches) {

      const listing =
        match.farmerListingId;

      const requirement =
        match.buyerRequirementId;

      const matchedQuantity =
        Math.min(
          listing.quantity,
          requirement.requiredQuantity
        );

      const distance =
        await calculateDistance(
          listing.sellingLocation,
          requirement.location
        );

      const transport =
        calculateTransportCost({
          quantity: matchedQuantity,
          distanceKm: distance.distanceKm,
          vehicleCapacity: VEHICLE_CAPACITY,
          costPerKm: COST_PER_KM
        });

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
            transport.transportCost,

          storageCost: 0,

          marketCharges: 0
        });

      result.push({
        match,
        matchedQuantity,
        distance,
        transport,
        netRealization
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      matches: result
    });

  } catch (error) {

    console.error(
      "Find Buyer Matches Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error finding buyer matches",
      error: error.message
    });
  }
};


const contactMatch = async (req, res) => {
  try {
    const { matchId } =
      req.params;

    const match =
      await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    if (
      req.user._id.toString() !==
        match.farmerId.toString() &&
      req.user._id.toString() !==
        match.buyerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    match.contactedBy =
      req.user._id;

    match.status =
      "contacted";

    await match.save();

    const receiverId =
      req.user._id.toString() ===
      match.farmerId.toString()
        ? match.buyerId
        : match.farmerId;

    await Notification.create({
      user: receiverId,
      message:
        "A user is interested in your crop match.",
      type: "match",
      match: match._id
    });

    res.status(200).json({
      success: true,
      message:
        "Contact request sent successfully",
      match
    });

  } catch (error) {

    console.error(
      "Contact Match Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error contacting match",
      error: error.message
    });
  }
};


const acceptMatch = async (req, res) => {
  try {
    const { matchId } =
      req.params;

    const match =
      await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    if (
      req.user._id.toString() !==
      match.buyerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the buyer can accept this match"
      });
    }

    match.status =
      "accepted";

    await match.save();

    await Notification.create({
      user: match.farmerId,
      message:
        "Buyer accepted your crop match.",
      type: "match",
      match: match._id
    });

    res.status(200).json({
      success: true,
      message:
        "Match accepted successfully",
      match
    });

  } catch (error) {

    console.error(
      "Accept Match Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error accepting match",
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

