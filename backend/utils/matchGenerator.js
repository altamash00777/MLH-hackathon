const Match = require("../models/Match");
const calculateMatch = require("./matchingEngine");

const MIN_MATCH_SCORE = 70;


const createMatch = async (listing, requirement) => {

  // -----------------------------------------
  // 1. Calculate match score
  // -----------------------------------------

  const score = calculateMatch(
    listing,
    requirement
  );


  // -----------------------------------------
  // 2. Reject low-score matches
  // -----------------------------------------

  if (
    !score ||
    score.matchScore < MIN_MATCH_SCORE
  ) {
    return null;
  }


  // -----------------------------------------
  // 3. Check if match already exists
  // -----------------------------------------

  const existingMatch = await Match.findOne({
    farmerListingId: listing._id,
    buyerRequirementId: requirement._id
  });


  if (existingMatch) {
    return existingMatch;
  }


  // -----------------------------------------
  // 4. Create new match
  // -----------------------------------------

  const newMatch = await Match.create({

    farmerId: listing.farmerId,

    farmerListingId: listing._id,

    buyerId: requirement.buyerId,

    buyerRequirementId: requirement._id,

    cropScore: score.cropScore,

    quantityScore: score.quantityScore,

    qualityScore: score.qualityScore,

    gradeScore: score.gradeScore,

    locationScore: score.locationScore,

    priceScore: score.priceScore,

    matchScore: score.matchScore

  });


  return newMatch;
};


module.exports = {
  createMatch,
  MIN_MATCH_SCORE
};