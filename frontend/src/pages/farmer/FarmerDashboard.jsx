import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // MARKET PRICE STATES
  // =========================

  const [cropName, setCropName] = useState("");
  const [mandiName, setMandiName] = useState("");
  const [period, setPeriod] = useState("30");

  const [showMandiSuggestions, setShowMandiSuggestions] =
    useState(false);

  const [priceData, setPriceData] = useState([]);
  const [showPriceTrend, setShowPriceTrend] = useState(false);


  // =========================
  // PROTOTYPE MANDI DATA
  // =========================

  const mandiList = [
    "Varanasi",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Prayagraj",
    "Gorakhpur",
    "Ayodhya",
    "Meerut",
    "Bareilly",
    "Jaunpur",
  ];


  // =========================
  // FETCH FARMER CROPS
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchCrops();
  }, []);


  const fetchCrops = async () => {
    try {
      const response = await api.get("/farmer/listings");

      console.log("Dashboard crops:", response.data);

      const data = response.data.listings || response.data;

      setCrops(data);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // CALCULATE STATS
  // =========================

  const totalCrops = crops.length;

  const activeCrops = crops.filter(
    (crop) => crop.status === "active"
  ).length;

  const matchedCrops = crops.filter(
    (crop) => crop.status === "matched"
  ).length;

  const soldCrops = crops.filter(
    (crop) => crop.status === "sold"
  ).length;


  // =========================
  // FILTER MANDI SUGGESTIONS
  // =========================

  const filteredMandis = mandiList.filter((mandi) =>
    mandi.toLowerCase().includes(mandiName.toLowerCase())
  );


  // =========================
  // PROTOTYPE PRICE DATA
  // =========================

  const generatePriceData = () => {

    const data = [
      { date: "20 Aug", price: 2400 },
      { date: "21 Aug", price: 2500 },
      { date: "22 Aug", price: 2600 },
      { date: "23 Aug", price: 2550 },
      { date: "24 Aug", price: 2700 },
      { date: "25 Aug", price: 2800 },
    ];

    return data;
  };


  // =========================
  // VIEW PRICE TREND
  // =========================

  const handleViewPriceTrend = () => {

    if (!cropName.trim() || !mandiName.trim()) {
      return;
    }

    // Temporary prototype data
    const data = generatePriceData();

    setPriceData(data);
    setShowPriceTrend(true);

    console.log("Crop:", cropName);
    console.log("Mandi:", mandiName);
    console.log("Period:", period);
  };


  // =========================
  // GRAPH HELPERS
  // =========================

  const maxPrice =
    priceData.length > 0
      ? Math.max(...priceData.map((item) => item.price))
      : 0;

  const minPrice =
    priceData.length > 0
      ? Math.min(...priceData.map((item) => item.price))
      : 0;


  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* =========================
            HEADER
        ========================= */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome, {user?.name || "Farmer"} 👋
            </h1>

            <p>
              Manage your crops and connect with buyers.
            </p>

          </div>


          <div className="profile-circle">

            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "F"}

          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================= */}

        <div className="stats-grid">

          {/* Total */}

          <div className="stat-card">

            <div className="stat-icon">
              🌾
            </div>

            <div>

              <p>Total Crops</p>

              <h2>
                {loading ? "..." : totalCrops}
              </h2>

            </div>

          </div>


          {/* Active */}

          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>

              <p>Active Crops</p>

              <h2>
                {loading ? "..." : activeCrops}
              </h2>

            </div>

          </div>


          {/* Matched */}

          <div className="stat-card">

            <div className="stat-icon">
              🤝
            </div>

            <div>

              <p>Matched</p>

              <h2>
                {loading ? "..." : matchedCrops}
              </h2>

            </div>

          </div>


          {/* Sold */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <p>Sold</p>

              <h2>
                {loading ? "..." : soldCrops}
              </h2>

            </div>

          </div>

        </div>


        {/* =========================
            MARKET PRICE
        ========================= */}

        <div className="dashboard-section market-price-section">

          <div className="section-header">

            <h2>
              📈 Market Prices
            </h2>

            <p>
              Check current and historical mandi prices
              for your crop.
            </p>

          </div>


          <div className="market-price-card">


            <div className="market-price-icon">
              🌾
            </div>


            <div className="market-price-content">

              <h3>
                Check Crop Price
              </h3>

              <p>
                Enter a crop and mandi to view its
                historical market price trend.
              </p>


              <div className="market-price-form">


                {/* CROP */}

                <div className="market-price-input">

                  <label>
                    Enter Crop Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Wheat"
                    value={cropName}
                    onChange={(e) =>
                      setCropName(e.target.value)
                    }
                  />

                </div>


                {/* MANDI */}

                <div className="market-price-input mandi-input">

                  <label>
                    Enter Mandi
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Varanasi"
                    value={mandiName}
                    onChange={(e) => {
                      setMandiName(e.target.value);
                      setShowMandiSuggestions(true);
                    }}
                    onFocus={() =>
                      setShowMandiSuggestions(true)
                    }
                  />


                  {/* AUTOCOMPLETE */}

                  {showMandiSuggestions &&
                    mandiName &&
                    filteredMandis.length > 0 && (

                      <div className="mandi-suggestions">

                        {filteredMandis.map((mandi) => (

                          <div
                            key={mandi}
                            className="mandi-suggestion"
                            onClick={() => {

                              setMandiName(mandi);

                              setShowMandiSuggestions(false);

                            }}
                          >

                            📍 {mandi}

                          </div>

                        ))}

                      </div>

                    )}

                </div>


                {/* PERIOD */}

                <div className="market-price-input">

                  <label>
                    Price History
                  </label>

                  <select
                    value={period}
                    onChange={(e) =>
                      setPeriod(e.target.value)
                    }
                  >

                    <option value="7">
                      Last 7 Days
                    </option>

                    <option value="30">
                      Last 30 Days
                    </option>

                    <option value="90">
                      Last 3 Months
                    </option>

                  </select>

                </div>


                {/* BUTTON */}

                <button
                  className="market-price-button"
                  disabled={
                    !cropName.trim() ||
                    !mandiName.trim()
                  }
                  onClick={handleViewPriceTrend}
                >
                  View Price Trend →
                </button>


              </div>

            </div>

          </div>

        </div>


        {/* =========================
            PRICE TREND
        ========================= */}

        {showPriceTrend && priceData.length > 0 && (

          <div className="dashboard-section">

            <div className="section-header">

              <h2>
                {cropName} Price Trend
              </h2>

              <p>
                {mandiName} Mandi • Last {period === "7"
                  ? "7 Days"
                  : period === "30"
                  ? "30 Days"
                  : "3 Months"}
              </p>

            </div>


            <div className="price-trend-card">


              {/* PRICE SUMMARY */}

              <div className="price-summary">

                <div>

                  <span>
                    Latest Price
                  </span>

                  <strong>
                    ₹{priceData[priceData.length - 1].price}
                  </strong>

                  <small>
                    per quintal
                  </small>

                </div>


                <div>

                  <span>
                    Lowest
                  </span>

                  <strong>
                    ₹{minPrice}
                  </strong>

                </div>


                <div>

                  <span>
                    Highest
                  </span>

                  <strong>
                    ₹{maxPrice}
                  </strong>

                </div>

              </div>


              {/* GRAPH */}

              <div className="price-chart">

                <div className="chart-y-axis">

                  <span>
                    ₹2800
                  </span>

                  <span>
                    ₹2700
                  </span>

                  <span>
                    ₹2600
                  </span>

                  <span>
                    ₹2500
                  </span>

                  <span>
                    ₹2400
                  </span>

                </div>


                <div className="chart-area">

                  <div className="chart-grid-lines">

                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>

                  </div>


                  <div className="chart-points">

                    {priceData.map((item, index) => {

                      const range = maxPrice - minPrice || 1;

                      const bottom =
                        ((item.price - minPrice) / range) *
                        75 + 10;

                      const left =
                        (index /
                          (priceData.length - 1)) *
                        90 + 5;

                      return (

                        <div
                          key={item.date}
                          className="chart-point-wrapper"
                          style={{
                            left: `${left}%`,
                            bottom: `${bottom}%`,
                          }}
                        >

                          <div className="chart-point">

                            <span>
                              ₹{item.price}
                            </span>

                          </div>

                          <small>
                            {item.date}
                          </small>

                        </div>

                      );

                    })}

                  </div>

                </div>

              </div>


              <div className="chart-note">

                📊 Showing available market price
                observations for {mandiName}.

              </div>

            </div>

          </div>

        )}


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="dashboard-section">

          <div className="section-header">

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your marketplace activities.
            </p>

          </div>


          <div className="action-grid">


            {/* Add Crop */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/farmer/add-crop")
              }
            >

              <div className="action-icon">
                🌱
              </div>

              <h3>
                Add New Crop
              </h3>

              <p>
                List your crop and reach potential
                buyers.
              </p>

              <span>
                Add Crop →
              </span>

            </div>


            {/* My Crops */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/farmer/crops")
              }
            >

              <div className="action-icon">
                🌾
              </div>

              <h3>
                My Crops
              </h3>

              <p>
                View and manage your crop listings.
              </p>

              <span>
                View Crops →
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            RECENT CROPS
        ========================= */}

        <div className="dashboard-section">

          <div className="section-header">

            <h2>
              Recent Crops
            </h2>

            <p>
              Your latest crop listings.
            </p>

          </div>


          {crops.length === 0 && !loading && (

            <div className="empty-state">

              <div className="empty-icon">
                🌱
              </div>

              <h3>
                No crops yet
              </h3>

              <p>
                Add your first crop to get started.
              </p>

              <button
                onClick={() =>
                  navigate("/farmer/add-crop")
                }
              >
                Add Crop
              </button>

            </div>

          )}


          {crops.length > 0 && (

            <div className="my-crops-grid">

              {crops.slice(0, 3).map((crop) => (

                <div
                  className="my-crop-card"
                  key={crop._id}
                >

                  <div className="my-crop-top">

                    <div className="my-crop-icon">
                      🌾
                    </div>

                    <span className="my-crop-status">
                      {crop.status}
                    </span>

                  </div>


                  <h2>
                    {crop.cropName}
                  </h2>


                  <div className="my-crop-info">

                    <div className="my-crop-info-item">

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {crop.quantity} kg
                      </strong>

                    </div>


                    <div className="my-crop-info-item">

                      <span>
                        Expected Price
                      </span>

                      <strong>
                        ₹{crop.expectedPrice}/kg
                      </strong>

                    </div>


                    <div className="my-crop-info-item">

                      <span>
                        Quality
                      </span>

                      <strong>
                        {crop.quality}
                      </strong>

                    </div>


<div className="my-crop-info-item">

  <span>
    Grade
  </span>

  <strong>
    {crop.grade}
  </strong>

</div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =========================
            VIEW ALL
        ========================= */}

        {crops.length > 3 && (

          <button
            className="submit-button"
            onClick={() =>
              navigate("/farmer/crops")
            }
            style={{ marginTop: "20px" }}
          >
            View All Crops
          </button>

        )}

      </main>

    </div>
  );
}

export default FarmerDashboard;