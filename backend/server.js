const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const farmerRoutes = require("./routes/farmerRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const mandiRoutes = require("./routes/mandiRoutes");
const dealRoutes = require("./routes/dealRoutes");
const marketIntelligenceRoutes = require("./routes/marketIntelligenceRoutes");
const chatbotRoutes = require("./routes/chatbot");


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ==========================================
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/matches", matchingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/market-intelligence", marketIntelligenceRoutes);
app.use("/api/chatbot", chatbotRoutes);



app.get("/", (req, res) => {
  res.json({
    message: "Farmer Marketplace API is running",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});