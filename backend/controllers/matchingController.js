const FarmerListing = require("../models/FarmerListing");
const BuyerRequirement = require("../models/BuyerRequirement");
const Match = require("../models/Match");
const Notification = require("../models/Notification");
const Deal = require("../models/Deal");

const calculateDistance =
  require("../utils/distanceCalculator");

const calculateTransportCost =
  require("../utils/transportCalculator");

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
      // DISTANCE
      // =================================================

      const distance =
        await calculateDistance(
          listing.sellingLocation,
          requirement.location
        );


      // =================================================
      // TRANSPORT
      // =================================================

      const transport =
        calculateTransportCost({

          quantity:
            matchedQuantity,

          distanceKm:
            distance.distanceKm,

          vehicleCapacity:
            100,

          costPerKm:
            50

        });


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
            transport.transportCost,

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
      // DISTANCE
      // =================================================

      const distance =
        await calculateDistance(
          listing.sellingLocation,
          requirement.location
        );


      // =================================================
      // TRANSPORT
      // =================================================

      const transport =
        calculateTransportCost({

          quantity:
            matchedQuantity,

          distanceKm:
            distance.distanceKm,

          vehicleCapacity:
            100,

          costPerKm:
            50

        });


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
            transport.transportCost,

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

    const { matchId } =
      req.params;


    const match =
      await Match.findById(matchId);


    if (!match) {

      return res.status(404).json({

        success: false,

        message:
          "Match not found"

      });

    }


    const loggedInUserId =
      req.user._id.toString();

    const farmerId =
      match.farmerId.toString();

    const buyerId =
      match.buyerId.toString();


    // =================================================
    // AUTHORIZATION
    // =================================================

    if (
      loggedInUserId !== farmerId &&
      loggedInUserId !== buyerId
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Not authorized"

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

        message:
          "This match has already been contacted"

      });

    }


    // =================================================
    // UPDATE MATCH
    // =================================================

    match.contactedBy =
      req.user._id;

    match.status =
      "contacted";

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

      recipientId:
        receiverId,

      senderId:
        req.user._id,

      matchId:
        match._id,

      type:
        "connection_accepted",

      title:
        "New Connection Request",

      message:
        "A user is interested in your crop match.",

      isRead:
        false

    });


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

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

    return res.status(500).json({

      success: false,

      message:
        "Error contacting match",

      error:
        error.message

    });

  }

};


// =====================================================
// ACCEPT MATCH
// =====================================================

const acceptMatch = async (req, res) => {

  try {

    const { matchId } =
      req.params;


    // =================================================
    // FIND MATCH
    // =================================================

    const match =
      await Match.findById(matchId);


    if (!match) {

      return res.status(404).json({

        success: false,

        message:
          "Match not found"

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

        message:
          "Only the buyer can accept this match"

      });

    }


    // =================================================
    // CHECK IF ALREADY ACCEPTED
    // =================================================

    if (
      match.status === "accepted"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "This match has already been accepted"

      });

    }


    // =================================================
    // GET LISTING
    // =================================================

    const listing =
      await FarmerListing.findById(
        match.farmerListingId
      );


    if (!listing) {

      return res.status(404).json({

        success: false,

        message:
          "Farmer listing not found"

      });

    }


    // =================================================
    // GET BUYER REQUIREMENT
    // =================================================

    const requirement =
      await BuyerRequirement.findById(
        match.buyerRequirementId
      );


    if (!requirement) {

      return res.status(404).json({

        success: false,

        message:
          "Buyer requirement not found"

      });

    }


    // =================================================
    // CALCULATE DEAL QUANTITY
    // =================================================

    const dealQuantity =
      Math.min(
        listing.quantity,
        requirement.requiredQuantity
      );


    // =================================================
    // CALCULATE DISTANCE
    // =================================================

    const distanceData =
      await calculateDistance(

        listing.sellingLocation,

        requirement.location

      );


    // =================================================
    // CALCULATE TRANSPORT
    // =================================================

    const transportData =
      calculateTransportCost({

        quantity:
          dealQuantity,

        distanceKm:
          distanceData.distanceKm,

        vehicleCapacity:
          100,

        costPerKm:
          50

      });


    // =================================================
    // AGREED PRICE
    // =================================================

    const agreedPrice =
      requirement.expectedPrice;


    const totalAmount =
      dealQuantity *
      agreedPrice;


    // =================================================
    // UPDATE MATCH
    // =================================================

    match.status =
      "accepted";

    await match.save();


    // =================================================
    // CREATE DEAL
    // =================================================

    const deal =
      await Deal.create({

        matchId:
          match._id,

        farmerId:
          match.farmerId,

        buyerId:
          match.buyerId,

        farmerListingId:
          match.farmerListingId,

        buyerRequirementId:
          match.buyerRequirementId,

        cropName:
          listing.cropName,

        quantity:
          dealQuantity,

        agreedPrice:
          agreedPrice,

        totalAmount:
          totalAmount,

        status:
          "confirmed",


        // =============================================
        // TASKS
        // =============================================

        tasks: {

          farmer: {

            quantityConfirmed:
              false,

            produceReady:
              false

          },

          buyer: {

            dealConfirmed:
              true,

            pickupConfirmed:
              false

          },

          logistics: {

            pickupScheduled:
              false,

            pickupCompleted:
              false,

            deliveryCompleted:
              false

          },

          payment: {

            completed:
              false

          }

        },


        // =============================================
        // TRANSPORT
        // =============================================

        transport: {

          distanceKm:
            distanceData.distanceKm,

          vehicleCount:
            transportData.vehiclesRequired,

          estimatedCost:
            transportData.transportCost,

          pickupDate:
            null,

          pickupTime:
            null,

          status:
            "not_scheduled"

        },


        // =============================================
        // PAYMENT
        // =============================================

        payment: {

          amount:
            totalAmount,

          status:
            "pending",

          paidAt:
            null

        }

      });


    // =================================================
    // NOTIFY FARMER
    // =================================================

    await Notification.create({

      recipientId:
        match.farmerId,

      senderId:
        req.user._id,

      matchId:
        match._id,

      type:
        "connection_accepted",

      title:
        "Deal Created",

      message:
        `Buyer accepted your ${listing.cropName} match. Deal #${deal._id} has been created.`,

      isRead:
        false

    });


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      success:
        true,

      message:
        "Match accepted and deal created successfully",

      match,

      deal

    });

  } catch (error) {

    console.error(
      "Accept Match Error:",
      error
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Error accepting match",

      error:
        error.message

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
