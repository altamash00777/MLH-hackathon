const calculateMatch = (listing, requirement) => {

  let cropScore = 0;
  let quantityScore = 0;
  let qualityScore = 0;
  let gradeScore = 0;
  let locationScore = 0;
  let priceScore = 0;

  // ==========================================
  // 1. CROP MATCH - 30 POINTS
  // ==========================================

  if (
    listing.cropName?.trim().toLowerCase() ===
    requirement.cropName?.trim().toLowerCase()
  ) {
    cropScore = 30;
  }

  // Different crops can never match
  if (cropScore === 0) {
    return {
      cropScore: 0,
      quantityScore: 0,
      qualityScore: 0,
      gradeScore: 0,
      locationScore: 0,
      priceScore: 0,
      matchScore: 0
    };
  }


  // ==========================================
  // 2. QUANTITY MATCH - 15 POINTS
  // ==========================================

  const farmerQuantity = Number(listing.quantity);
  const buyerQuantity = Number(requirement.requiredQuantity);

  if (farmerQuantity >= buyerQuantity) {

    // Farmer has enough quantity
    quantityScore = 15;

  } else {

    // Partial score if farmer has less quantity
    quantityScore = Math.round(
      (farmerQuantity / buyerQuantity) * 15
    );

  }


  // ==========================================
  // 3. QUALITY MATCH - 15 POINTS
  // ==========================================

  if (
    listing.quality?.trim().toLowerCase() ===
    requirement.quality?.trim().toLowerCase()
  ) {
    qualityScore = 15;
  }


  // ==========================================
  // 4. GRADE MATCH - 10 POINTS
  // ==========================================

  if (
    listing.grade?.trim().toLowerCase() ===
    requirement.grade?.trim().toLowerCase()
  ) {
    gradeScore = 10;
  }


  // ==========================================
  // 5. LOCATION MATCH - 10 POINTS
  // ==========================================

  if (
    listing.sellingLocation?.trim().toLowerCase() ===
    requirement.location?.trim().toLowerCase()
  ) {
    locationScore = 10;
  }


  // ==========================================
  // 6. PRICE MATCH - 20 POINTS
  // ==========================================

  const farmerPrice = Number(listing.expectedPrice);
  const buyerPrice = Number(requirement.expectedPrice);

  if (farmerPrice <= buyerPrice) {

    // Farmer wants less than or equal to buyer's price
    priceScore = 20;

  } else {

    const difference = farmerPrice - buyerPrice;

    const percentageDifference =
      difference / buyerPrice;

    if (percentageDifference <= 0.05) {

      priceScore = 15;

    } else if (percentageDifference <= 0.10) {

      priceScore = 10;

    } else if (percentageDifference <= 0.20) {

      priceScore = 5;

    } else {

      priceScore = 0;

    }
  }


  // ==========================================
  // FINAL SCORE
  // ==========================================

  const matchScore =
    cropScore +
    quantityScore +
    qualityScore +
    gradeScore +
    locationScore +
    priceScore;


  return {
    cropScore,
    quantityScore,
    qualityScore,
    gradeScore,
    locationScore,
    priceScore,
    matchScore
  };
};


module.exports = calculateMatch;