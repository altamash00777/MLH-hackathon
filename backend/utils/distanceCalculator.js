const axios = require("axios");

const calculateDistance = async (origin, destination) => {
  try {

    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: origin,
          size: 1
        }
      }
    );

    const originFeature = response.data.features[0];

    if (!originFeature) {
      throw new Error(`Location not found: ${origin}`);
    }

    const originCoordinates =
      originFeature.geometry.coordinates;


console.log("ORIGIN:", origin);
console.log("ORIGIN COORDINATES:", originCoordinates);




    const destinationResponse = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          text: destination,
          size: 1
        }
      }
    );

    const destinationFeature =
      destinationResponse.data.features[0];

    if (!destinationFeature) {
      throw new Error(
        `Location not found: ${destination}`
      );
    }

    const destinationCoordinates =
      destinationFeature.geometry.coordinates;

console.log("DESTINATION:", destination);
console.log(
  "DESTINATION COORDINATES:",
  destinationCoordinates
);





    // ORS uses [longitude, latitude]
    const routeResponse = await axios.get(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        params: {
          api_key: process.env.ORS_API_KEY,

          start:
            `${originCoordinates[0]},${originCoordinates[1]}`,

          end:
            `${destinationCoordinates[0]},${destinationCoordinates[1]}`
        }
      }
    );


    const route =
      routeResponse.data.features[0];

console.log(
  "ROUTE DISTANCE METERS:",
  route.properties.summary.distance
);

console.log(
  "ROUTE DURATION SECONDS:",
  route.properties.summary.duration
);


    if (!route) {
      throw new Error(
        "Could not calculate route"
      );
    }


    const distanceMeters =
      route.properties.summary.distance;

    const durationSeconds =
      route.properties.summary.duration;


    const distanceKm =
      distanceMeters / 1000;

    const durationMinutes =
      durationSeconds / 60;


    return {
      origin,
      destination,

      distanceKm:
        Number(distanceKm.toFixed(2)),

      durationMinutes:
        Number(durationMinutes.toFixed(2))
    };

  } catch (error) {

    console.error(
      "Distance calculation error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


module.exports = calculateDistance;