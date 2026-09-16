import React from "react";
import Sidebar from "../../components/Sidebar";
import "./AIPricePrediction.css";

function AIPricePrediction() {
  const cropData = [
    {
      crop: "Wheat",
      emoji: "🌾",
      demand: "High",
      buyerAvailability: 82,
      qualityRequirement: "Premium",
      expectedPrice: 2400,
      marketPrice: 2350,
      aiRealization: 2420,
      priceRange: "₹2,350 - ₹2,500",
      confidence: 91,
      advice: "Good time to sell. Strong buyer demand may support a better price."
    },
    {
      crop: "Rice",
      emoji: "🍚",
      demand: "Very High",
      buyerAvailability: 91,
      qualityRequirement: "Grade A",
      expectedPrice: 3100,
      marketPrice: 3050,
      aiRealization: 3140,
      priceRange: "₹3,050 - ₹3,250",
      confidence: 94,
      advice: "High buyer availability creates a strong opportunity for premium pricing."
    },
    {
      crop: "Maize",
      emoji: "🌽",
      demand: "Medium",
      buyerAvailability: 68,
      qualityRequirement: "Standard",
      expectedPrice: 2100,
      marketPrice: 2050,
      aiRealization: 2080,
      priceRange: "₹2,000 - ₹2,150",
      confidence: 86,
      advice: "Demand is moderate. Consider comparing multiple buyers before selling."
    },
    {
      crop: "Potato",
      emoji: "🥔",
      demand: "High",
      buyerAvailability: 76,
      qualityRequirement: "Premium",
      expectedPrice: 1800,
      marketPrice: 1750,
      aiRealization: 1820,
      priceRange: "₹1,750 - ₹1,900",
      confidence: 89,
      advice: "Premium-quality potatoes can achieve better realization from verified buyers."
    }
  ];

  return (
    <div className="farmer-layout">
      
      <Sidebar />

      <main className="ai-price-page">

        {/* Header */}
        <div className="ai-price-header">
          <div>
            <div className="ai-title-row">
              <span className="ai-title-icon">🤖</span>

              <div>
                <h1>AI Price Prediction</h1>
                <p>
                  Smart pricing recommendations to help you get better value
                  for your crops.
                </p>
              </div>
            </div>
          </div>

          <div className="prediction-badge">
            ✨ AI Powered
          </div>
        </div>

        {/* Information Banner */}
        <div className="ai-info-banner">
          <div className="info-icon">💡</div>

          <div>
            <h3>Smart Selling Recommendation</h3>
            <p>
              Our AI analyzes market demand, buyer availability, quality
              requirements and expected market prices to suggest an
              estimated selling range.
            </p>
          </div>
        </div>

        {/* Prediction Summary */}
        <div className="prediction-summary">

          <div className="summary-card">
            <div className="summary-icon">🌾</div>
            <div>
              <span>Crops Analyzed</span>
              <strong>4</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📈</div>
            <div>
              <span>Market Outlook</span>
              <strong>Positive</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">👥</div>
            <div>
              <span>Buyer Activity</span>
              <strong>High</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div>
              <span>Prediction Confidence</span>
              <strong>90%</strong>
            </div>
          </div>

        </div>

        {/* Section Heading */}
        <div className="crop-section-heading">
          <div>
            <h2>Crop Price Predictions</h2>
            <p>
              Compare current market signals and AI-recommended selling prices.
            </p>
          </div>

          <span className="mock-data-label">
            Demo Data
          </span>
        </div>

        {/* Crop Cards */}
        <div className="crop-prediction-grid">

          {cropData.map((crop) => (
            <div className="crop-prediction-card" key={crop.crop}>

              {/* Card Header */}
              <div className="crop-card-header">

                <div className="crop-name-area">
                  <div className="crop-emoji">
                    {crop.emoji}
                  </div>

                  <div>
                    <h3>{crop.crop}</h3>
                    <span>Per Quintal</span>
                  </div>
                </div>

                <div
                  className={`demand-badge ${crop.demand
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {crop.demand} Demand
                </div>

              </div>

              {/* Factors */}
              <div className="crop-factors">

                <div className="factor-row">
                  <div className="factor-label">
                    <span>📊</span>
                    <span>Market Demand</span>
                  </div>

                  <strong>{crop.demand}</strong>
                </div>

                <div className="factor-row">
                  <div className="factor-label">
                    <span>👥</span>
                    <span>Buyer Availability</span>
                  </div>

                  <div className="availability-value">
                    <strong>{crop.buyerAvailability}%</strong>

                    <div className="availability-bar">
                      <div
                        className="availability-fill"
                        style={{
                          width: `${crop.buyerAvailability}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="factor-row">
                  <div className="factor-label">
                    <span>⭐</span>
                    <span>Quality Requirement</span>
                  </div>

                  <strong>{crop.qualityRequirement}</strong>
                </div>

              </div>

              {/* Price Information */}
              <div className="price-information">

                <div className="price-item">
                  <span>Expected Price</span>
                  <strong>
                    ₹{crop.expectedPrice.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="price-item">
                  <span>3-Day Market Price</span>
                  <strong>
                    ₹{crop.marketPrice.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

              {/* AI Net Realization */}
              <div className="ai-realization">

                <div>
                  <span>🤖 AI Net Realization</span>
                  <small>Estimated achievable price</small>
                </div>

                <strong>
                  ₹{crop.aiRealization.toLocaleString("en-IN")}
                </strong>

              </div>

              {/* Recommended Price */}
              <div className="recommended-price">

                <div className="recommended-heading">
                  <span>🎯 AI Recommended Price</span>

                  <span className="confidence">
                    {crop.confidence}% confidence
                  </span>
                </div>

                <div className="price-range">
                  {crop.priceRange}
                </div>

                <p>
                  Recommended selling range per quintal
                </p>

              </div>

              {/* Advice */}
              <div className="ai-advice">
                <span>💬</span>
                <p>{crop.advice}</p>
              </div>

            </div>
          ))}

        </div>

        {/* Footer Note */}
        <div className="ai-disclaimer">
          <span>ℹ️</span>
          <p>
            <strong>Demo Prediction:</strong> These values are mock data
            created for demonstration purposes. Actual predictions can later
            be connected to real market data and an AI/ML pricing model.
          </p>
        </div>

      </main>
    </div>
  );
}

export default AIPricePrediction;