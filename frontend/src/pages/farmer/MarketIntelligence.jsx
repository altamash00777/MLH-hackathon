// import React, { useEffect, useState } from "react";
// import "./MarketIntelligence.css";
// import Sidebar from "../../components/Sidebar";

// const MarketIntelligence = () => {
// const [crops, setCrops] = useState([]);
// const [selectedCrop, setSelectedCrop] = useState("Rice");
// const [selectedState, setSelectedState] = useState("Uttar Pradesh");

//   const [marketData, setMarketData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const states = [
//     "All India",
//     "Uttar Pradesh",
//   ];

//   // =====================================================
//   // Fetch Crops
//   // =====================================================

//   useEffect(() => {
//     const fetchCrops = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/market-intelligence/crops"
//         );

//         const data = await response.json();

//         if (data.success) {
//           setCrops(data.crops);
//         }
//       } catch (error) {
//         console.error("Failed to fetch crops:", error);
//         setError("Failed to load crops");
//       }
//     };

//     fetchCrops();
//   }, []);

//   // =====================================================
//   // Fetch Market Data
//   // =====================================================

//   useEffect(() => {
//     const fetchMarketData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         let url = `http://localhost:5000/api/market-intelligence/trend/${selectedCrop}`;

//         if (selectedState !== "All India") {
//           url += `?state=${encodeURIComponent(selectedState)}`;
//         }

//         const response = await fetch(url);
//         const data = await response.json();

//         if (!data.success) {
//           throw new Error(data.message);
//         }

//         setMarketData(data);
//       } catch (error) {
//         console.error("Failed to fetch market data:", error);
//         setError("Failed to load market data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (selectedCrop) {
//       fetchMarketData();
//     }
//   }, [selectedCrop, selectedState]);

//   return (
//     <>

// <Sidebar />




//     <div className="market-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="market-header">
//         <div>
//           <span className="market-label">
//             MARKET INTELLIGENCE
//           </span>

//           <h1>Current Mandi Prices</h1>

//           <p>
//             Compare current mandi prices and identify
//             better market opportunities.
//           </p>
//         </div>

//         <div className="market-source">
//           <span className="source-dot"></span>
//           Live Market Data
//         </div>
//       </div>

//       {/* =================================================
//           FILTERS
//       ================================================= */}

//       <div className="market-filters">

//         <div className="filter-group">
//           <label>Crop</label>

//           <select
//             value={selectedCrop}
//             onChange={(e) => setSelectedCrop(e.target.value)}
//           >
//             {crops.map((crop) => (
//               <option key={crop} value={crop}>
//                 {crop}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-group">
//           <label>State</label>

//           <select
//             value={selectedState}
//             onChange={(e) => setSelectedState(e.target.value)}
//           >
//             {states.map((state) => (
//               <option key={state} value={state}>
//                 {state}
//               </option>
//             ))}
//           </select>
//         </div>

//         {marketData && (
//           <div className="updated-info">
//             <span>Latest data</span>
//             <strong>{marketData.summary.latestDate}</strong>
//           </div>
//         )}

//       </div>

//       {/* =================================================
//           LOADING
//       ================================================= */}

//       {loading && (
//         <div className="market-loading">
//           <div className="loading-spinner"></div>
//           <p>Fetching current mandi prices...</p>
//         </div>
//       )}

//       {/* =================================================
//           ERROR
//       ================================================= */}

//       {error && !loading && (
//         <div className="market-error">
//           {error}
//         </div>
//       )}

//       {/* =================================================
//           MARKET DATA
//       ================================================= */}

//       {marketData && !loading && (

//         <>

//           {/* SUMMARY CARDS */}

//           <div className="price-summary">

//             <div className="price-card">
//               <div className="price-card-top">
//                 <span>Average Price</span>
//                 <div className="price-icon">₹</div>
//               </div>

//               <h2>
//                 ₹{marketData.summary.averagePrice.toLocaleString(
//                   "en-IN",
//                   {
//                     maximumFractionDigits: 2,
//                   }
//                 )}
//               </h2>

//               <p>per quintal</p>
//             </div>

//             <div className="price-card">
//               <div className="price-card-top">
//                 <span>Lowest Price</span>
//                 <div className="price-icon">↓</div>
//               </div>

//               <h2>
//                 ₹{marketData.summary.minimumPrice.toLocaleString(
//                   "en-IN"
//                 )}
//               </h2>

//               <p>minimum modal range</p>
//             </div>

//             <div className="price-card">
//               <div className="price-card-top">
//                 <span>Highest Price</span>
//                 <div className="price-icon">↑</div>
//               </div>

//               <h2>
//                 ₹{marketData.summary.maximumPrice.toLocaleString(
//                   "en-IN"
//                 )}
//               </h2>

//               <p>maximum modal range</p>
//             </div>

//           </div>

//           {/* =================================================
//               MARKET TABLE
//           ================================================= */}

//           <div className="markets-section">

//             <div className="section-heading">

//               <div>
//                 <span className="section-label">
//                   MARKET COMPARISON
//                 </span>

//                 <h2>
//                   Current {marketData.crop} Markets
//                 </h2>
//               </div>

//               <span className="market-count">
//                 {marketData.latestMarkets.length} markets
//               </span>

//             </div>

//             <div className="market-table-wrapper">

//               <table className="market-table">

//                 <thead>
//                   <tr>
//                     <th>Market</th>
//                     <th>District</th>
//                     <th>Variety</th>
//                     <th>Min Price</th>
//                     <th>Max Price</th>
//                     <th>Modal Price</th>
//                   </tr>
//                 </thead>

//                 <tbody>

//                   {marketData.latestMarkets.map(
//                     (market, index) => (

//                       <tr key={index}>

//                         <td>
//                           <div className="market-name">
//                             {market.MARKET}
//                           </div>

//                           <small>
//                             {market.STATE}
//                           </small>
//                         </td>

//                         <td>
//                           {market.DISTRICT}
//                         </td>

//                         <td>
//                           {market.VARIETY || "—"}
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             market.MIN_PRICE
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             market.MAX_PRICE
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td>
//                           <span className="modal-price">
//                             ₹
//                             {Number(
//                               market.MODAL_PRICE
//                             ).toLocaleString("en-IN")}
//                           </span>
//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//           {/* =================================================
//               SOURCE
//           ================================================= */}

//           <div className="market-footer">

//             <span>
//               Government of India Mandi Price Data
//             </span>

//             <span className="footer-divider">
//               •
//             </span>

//             <span>
//               Powered by Snowflake
//             </span>

//           </div>

//         </>

//       )}

//     </div>
//     </>
//   );
// };

// export default MarketIntelligence;

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

        let url = `http://localhost:5000/api/market-intelligence/trend/${selectedCrop}`;

        if (selectedState !== "All India") {
          url += `?state=${encodeURIComponent(selectedState)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setError("Failed to load market data");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCrop) {
      fetchMarketData();
    }
  }, [selectedCrop, selectedState]);

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
            Live Market Data
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="market-filters">

          <div className="filter-group">
            <label>Crop</label>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              {crops.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>State</label>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {marketData && (
            <div className="updated-info">
              <span>Latest data</span>
              <strong>{marketData.summary.latestDate}</strong>
            </div>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="market-loading">
            <div className="loading-spinner"></div>
            <p>Fetching current mandi prices...</p>
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
            MARKET DATA
        ================================================= */}

        {marketData && !loading && (
          <>

            {/* SUMMARY CARDS */}

            <div className="price-summary">

              <div className="price-card">
                <div className="price-card-top">
                  <span>Average Price</span>
                  <div className="price-icon">₹</div>
                </div>

                <h2>
                  ₹{marketData.summary.averagePrice.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </h2>

                <p>per quintal</p>
              </div>

              <div className="price-card">
                <div className="price-card-top">
                  <span>Lowest Price</span>
                  <div className="price-icon">↓</div>
                </div>

                <h2>
                  ₹{marketData.summary.minimumPrice.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p>minimum modal range</p>
              </div>

              <div className="price-card">
                <div className="price-card-top">
                  <span>Highest Price</span>
                  <div className="price-icon">↑</div>
                </div>

                <h2>
                  ₹{marketData.summary.maximumPrice.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p>maximum modal range</p>
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
                  {marketData.latestMarkets.length} markets
                </span>

              </div>

              <div className="market-table-wrapper">

                <table className="market-table">

                  <thead>
                    <tr>
                      <th>Market</th>
                      <th>District</th>
                      <th>Variety</th>
                      <th>Min Price</th>
                      <th>Max Price</th>
                      <th>Modal Price</th>
                    </tr>
                  </thead>

                  <tbody>

                    {marketData.latestMarkets.map(
                      (market, index) => (

                        <tr key={index}>

                          <td>
                            <div className="market-name">
                              {market.MARKET}
                            </div>

                            <small>
                              {market.STATE}
                            </small>
                          </td>

                          <td>
                            {market.DISTRICT}
                          </td>

                          <td>
                            {market.VARIETY || "—"}
                          </td>

                          <td>
                            ₹
                            {Number(
                              market.MIN_PRICE
                            ).toLocaleString("en-IN")}
                          </td>

                          <td>
                            ₹
                            {Number(
                              market.MAX_PRICE
                            ).toLocaleString("en-IN")}
                          </td>

                          <td>
                            <span className="modal-price">
                              ₹
                              {Number(
                                market.MODAL_PRICE
                              ).toLocaleString("en-IN")}
                            </span>
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
