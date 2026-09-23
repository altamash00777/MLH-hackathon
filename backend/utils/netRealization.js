const calculateNetRealization = ({
  totalQuantity,
  matchedQuantity,
  productionCostPerQuintal,
  otherExpenses = 0,
  sellingPrice,
  transportCost = 0,
  storageCost = 0,
  marketCharges = 0
}) => {

  // =====================================================
  // PRODUCTION COST
  // productionCostPerQuintal is per quintal
  // =====================================================

  const productionCost =
    totalQuantity * productionCostPerQuintal;


  // =====================================================
  // OTHER EXPENSES
  // otherExpenses is also per quintal
  // =====================================================

  const totalOtherExpenses =
    totalQuantity * otherExpenses;


  // =====================================================
  // TOTAL FARMER EXPENSE
  // =====================================================

  const totalExpense =
    productionCost + totalOtherExpenses;


  // =====================================================
  // EXPENSE ALLOCATED TO THIS DEAL
  // =====================================================

  const allocatedExpense =
    totalQuantity > 0
      ? totalExpense *
        (matchedQuantity / totalQuantity)
      : 0;


  // =====================================================
  // BREAK-EVEN PRICE
  // =====================================================

  const breakEvenPrice =
    totalQuantity > 0
      ? totalExpense / totalQuantity
      : 0;


  // =====================================================
  // GROSS REVENUE
  // =====================================================

  const grossRevenue =
    matchedQuantity * sellingPrice;


  // =====================================================
  // SELLING / LOGISTICS COST
  // =====================================================

  const totalSellingCost =
    transportCost +
    storageCost +
    marketCharges;


  // =====================================================
  // NET AMOUNT RECEIVED
  // =====================================================

  const netAmountReceived =
    grossRevenue - totalSellingCost;


  // =====================================================
  // PROFIT
  // =====================================================

  const profit =
    netAmountReceived - allocatedExpense;


  // =====================================================
  // PROFIT PER QUINTAL
  // =====================================================

  const profitPerQuintal =
    matchedQuantity > 0
      ? profit / matchedQuantity
      : 0;


  // =====================================================
  // RETURN RESULT
  // =====================================================

  return {

    totalQuantity,

    matchedQuantity,

    productionCost,

    otherExpenses:
      totalOtherExpenses,

    totalExpense,

    allocatedExpense,

    breakEvenPrice,

    sellingPrice,

    grossRevenue,

    transportCost,

    storageCost,

    marketCharges,

    totalSellingCost,

    netAmountReceived,

    profit,

    profitPerQuintal

  };
};


module.exports = calculateNetRealization;