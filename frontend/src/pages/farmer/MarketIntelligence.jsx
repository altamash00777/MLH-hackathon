import React, { useEffect, useState } from "react";
import "./MarketIntelligence.css";
import Sidebar from "../../components/Sidebar";

const MarketIntelligence = () => {
  const [crops, setCrops] = useState([]);
  const [states, setStates] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");

  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Fetch Crops
  // =====================================================

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/market-intelligence/crops"
        );

        const data = await response.json();

        if (data.success) {
          setCrops(data.crops);
        } else {
          setError("Failed to load crops");
        }
      } catch (error) {
        console.error("Failed to fetch crops:", error);
        setError("Failed to load crops");
      }
    };

    fetchCrops();
  }, []);

  // =====================================================
  // Fetch States
  // =====================================================

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/market-intelligence/states"
        );

        const data = await response.json();

        if (data.success) {
          setStates(["All India", ...data.states]);
        } else {
          setError("Failed to load states");
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setError("Failed to load states");
      }
    };

    fetchStates();
  }, []);

  // =====================================================
  // Fetch Market Data
  // =====================================================

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError("");
        setMarketData(null);

        let url = `http://localhost:5000/api/market-intelligence/trend/${encodeURIComponent(
          selectedCrop
        )}`;

        if (selectedState !== "All India") {
          url += `?state=${encodeURIComponent(selectedState)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load market data"
          );
        }

        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError(
          error.message === "Failed to fetch"
            ? "Unable to connect to the server"
            : "Failed to load market data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedCrop) {
      fetchMarketData();
    }
  }, [selectedCrop, selectedState]);

  // =====================================================
  // Format Date
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // Safe Number Formatter
  // =====================================================

  const formatPrice = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "—";
    }

    return number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <>
      <Sidebar />

      <div className="market-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="market-header">

          <div>
            <span className="market-label">
              MARKET INTELLIGENCE
            </span>

            <h1>Current Mandi Prices</h1>

            <p>
              Compare current mandi prices and identify
              better market opportunities.
            </p>
          </div>

          <div className="market-source">
            <span className="source-dot"></span>
            Government Mandi Data
          </div>

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="market-filters">

          {/* Crop Filter */}

          <div className="filter-group">

            <label>Crop</label>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              disabled={loading}
            >
              {crops.length > 0 ? (
                crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))
              ) : (
                <option value="Rice">
                  Loading crops...
                </option>
              )}
            </select>

          </div>

          {/* State Filter */}

          <div className="filter-group">

            <label>State</label>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={loading}
            >
              {states.length > 0 ? (
                states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))
              ) : (
                <option value="Uttar Pradesh">
                  Loading states...
                </option>
              )}
            </select>

          </div>

          {/* Latest Data */}

          {marketData?.summary && (
            <div className="updated-info">

              <span>Latest available data</span>

              <strong>
                {formatDate(
                  marketData.summary.latestDate
                )}
              </strong>

            </div>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="market-loading">

            <div className="loading-spinner"></div>

            <p>
              Fetching current mandi prices...
            </p>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !loading && (
          <div className="market-error">
            {error}
          </div>
        )}

        {/* =================================================
            NO DATA
        ================================================= */}

        {marketData &&
          !loading &&
          !error &&
          (!marketData.latestMarkets ||
            marketData.latestMarkets.length === 0) && (

            <div className="market-error">

              No price data is currently available for{" "}
              <strong>
                {selectedCrop}
              </strong>{" "}
              in{" "}
              <strong>
                {selectedState}
              </strong>
              .

            </div>
          )}

        {/* =================================================
            MARKET DATA
        ================================================= */}

        {marketData &&
          !loading &&
          !error &&
          marketData.latestMarkets &&
          marketData.latestMarkets.length > 0 && (

            <>

              {/* =================================================
                  SUMMARY CARDS
              ================================================= */}

              <div className="price-summary">

                {/* Average */}

                <div className="price-card">

                  <div className="price-card-top">

                    <span>
                      Average Price
                    </span>

                    <div className="price-icon">
                      ₹
                    </div>

                  </div>

                  <h2>
                    ₹
                    {formatPrice(
                      marketData.summary.averagePrice
                    )}
                  </h2>

                  <p>
                    per quintal
                  </p>

                </div>

                {/* Lowest */}

                <div className="price-card">

                  <div className="price-card-top">

                    <span>
                      Lowest Price
                    </span>

                    <div className="price-icon">
                      ↓
                    </div>

                  </div>

                  <h2>
                    ₹
                    {formatPrice(
                      marketData.summary.minimumPrice
                    )}
                  </h2>

                  <p>
                    minimum modal price
                  </p>

                </div>

                {/* Highest */}

                <div className="price-card">

                  <div className="price-card-top">

                    <span>
                      Highest Price
                    </span>

                    <div className="price-icon">
                      ↑
                    </div>

                  </div>

                  <h2>
                    ₹
                    {formatPrice(
                      marketData.summary.maximumPrice
                    )}
                  </h2>

                  <p>
                    maximum modal price
                  </p>

                </div>

              </div>

              {/* =================================================
                  MARKET TABLE
              ================================================= */}

              <div className="markets-section">

                <div className="section-heading">

                  <div>

                    <span className="section-label">
                      MARKET COMPARISON
                    </span>

                    <h2>
                      Current {marketData.crop} Markets
                    </h2>

                  </div>

                  <span className="market-count">

                    {marketData.latestMarkets.length}{" "}
                    {marketData.latestMarkets.length === 1
                      ? "market"
                      : "markets"}

                  </span>

                </div>

                <div className="market-table-wrapper">

                  <table className="market-table">

                    <thead>

                      <tr>

                        <th>
                          Market
                        </th>

                        <th>
                          District
                        </th>

                        <th>
                          Variety
                        </th>

                        <th>
                          Min Price
                        </th>

                        <th>
                          Max Price
                        </th>

                        <th>
                          Modal Price
                        </th>

                        <th>
                          Price Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {marketData.latestMarkets.map(
                        (market, index) => (

                          <tr
                            key={`${market.MARKET}-${market.DISTRICT}-${index}`}
                          >

                            {/* Market */}

                            <td>

                              <div className="market-name">
                                {market.MARKET || "Unknown Market"}
                              </div>

                              <small>
                                {market.STATE || "—"}
                              </small>

                            </td>

                            {/* District */}

                            <td>
                              {market.DISTRICT || "—"}
                            </td>

                            {/* Variety */}

                            <td>
                              {market.VARIETY || "—"}
                            </td>

                            {/* Min Price */}

                            <td>
                              {market.MIN_PRICE !== null &&
                              market.MIN_PRICE !== undefined &&
                              market.MIN_PRICE !== "" ? (
                                <>
                                  ₹
                                  {formatPrice(
                                    market.MIN_PRICE
                                  )}
                                </>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* Max Price */}

                            <td>
                              {market.MAX_PRICE !== null &&
                              market.MAX_PRICE !== undefined &&
                              market.MAX_PRICE !== "" ? (
                                <>
                                  ₹
                                  {formatPrice(
                                    market.MAX_PRICE
                                  )}
                                </>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* Modal Price */}

                            <td>

                              {market.MODAL_PRICE !== null &&
                              market.MODAL_PRICE !== undefined &&
                              market.MODAL_PRICE !== "" ? (

                                <span className="modal-price">

                                  ₹
                                  {formatPrice(
                                    market.MODAL_PRICE
                                  )}

                                </span>

                              ) : (

                                <span>
                                  —
                                </span>

                              )}

                            </td>

                            {/* Price Date */}

                            <td>

                              <small className="price-date">

                                {formatDate(
                                  market.ARRIVAL_DATE
                                )}

                              </small>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =================================================
                  SOURCE
              ================================================= */}

              <div className="market-footer">

                <span>
                  Government of India Mandi Price Data
                </span>

                <span className="footer-divider">
                  •
                </span>

                <span>
                  Latest available price for each market
                </span>

                <span className="footer-divider">
                  •
                </span>

                <span>
                  Powered by Snowflake
                </span>

              </div>

            </>

          )}

      </div>
    </>
  );
};

export default MarketIntelligence;
