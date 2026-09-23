const calculateTransportCost = ({
  quantity,
  distanceKm,
  vehicleCapacity,
  costPerKm
}) => {

  // Check inputs
  if (
    quantity <= 0 ||
    distanceKm < 0 ||
    vehicleCapacity <= 0 ||
    costPerKm < 0
  ) {
    throw new Error(
      "Invalid transport calculation inputs"
    );
  }


  // Calculate number of vehicles required
  const vehiclesRequired =
    Math.ceil(
      quantity / vehicleCapacity
    );


  // Calculate transport cost
  const transportCost =
    distanceKm *
    costPerKm *
    vehiclesRequired;


  return {

    quantity,

    distanceKm,

    vehicleCapacity,

    vehiclesRequired,

    costPerKm,

    transportCost:
      Number(
        transportCost.toFixed(2)
      )

  };

};


module.exports =
  calculateTransportCost;