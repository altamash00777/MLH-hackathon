const Match = require("../models/Match");
const calculateMatch = require("./matchingEngine");

const MIN_MATCH_SCORE = 70;

const createMatch = async (listing, requirement) => {

  // ==========================================
  // 1. CALCULATE MATCH SCORE
  // ==========================================

  const score = calculateMatch(
    listing,
    requirement
  );

  // ==========================================
  // 2. REJECT LOW-SCORE MATCHES
  // ==========================================

  if (
    !score ||
    score.matchScore < MIN_MATCH_SCORE
  ) {
    return null;
  }

  // ==========================================
  // 3. FIND EXISTING MATCH OR CREATE NEW ONE
  // ==========================================

  const match = await Match.findOneAndUpdate(
    {
      farmerListingId: listing._id,
      buyerRequirementId: requirement._id
    },
    {
      $setOnInsert: {
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
      }
    },
    {
  returnDocument: "after",
  upsert: true
}
  );

  return match;
};

module.exports = {
  createMatch,
  MIN_MATCH_SCORE
};