require("dotenv").config();

const https = require("https");

const API_KEY = process.env.MANDI_API_KEY;

const url =
  `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
  `?api-key=${API_KEY}` +
  `&format=json` +
  `&filters%5Bcommodity%5D=Rice` +
  `&limit=5`;

https.get(url, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const result = JSON.parse(data);

      console.log("API Status:", result.status);
      console.log("Total records:", result.total);
      console.log("Records received:", result.count);

      console.table(result.records);
    } catch (error) {
      console.error("❌ Failed to parse API response");
      console.error(error.message);
    }
  });
}).on("error", (error) => {
  console.error("❌ API request failed:");
  console.error(error.message);
});