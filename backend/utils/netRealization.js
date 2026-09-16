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
  const productionCost =
    totalQuantity * productionCostPerQuintal;

  const totalExpense =
    productionCost + otherExpenses;

  const allocatedExpense =
    totalExpense *
    (matchedQuantity / totalQuantity);

  const breakEvenPrice =
    totalExpense / totalQuantity;

  const grossRevenue =
    matchedQuantity * sellingPrice;

  const totalSellingCost =
    transportCost +
    storageCost +
    marketCharges;

  const netAmountReceived =
    grossRevenue - totalSellingCost;

  const profit =
    netAmountReceived - allocatedExpense;

  const profitPerQuintal =
    matchedQuantity > 0
      ? profit / matchedQuantity
      : 0;

  return {
    totalQuantity,
    matchedQuantity,
    productionCost,
    otherExpenses,
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

