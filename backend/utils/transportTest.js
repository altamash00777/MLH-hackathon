const calculateTransportCost =
  require("./transportCalculator");


const result =
  calculateTransportCost({

    quantity: 80,

    distanceKm: 92.91,

    vehicleCapacity: 100,

    costPerKm: 50

  });


console.log(result);
