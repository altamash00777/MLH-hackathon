import { useEffect, useState } from "react";
import BuyerSidebar from "../../components/BuyerSidebar";
import "./FPOMarketplace.css";

function FPOMarketplace() {
  const [fpos, setFpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFPOs();
  }, []);

  const fetchFPOs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/fpo/buyer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load FPOs"
        );
      }

      setFpos(data.fpos || []);
    } catch (err) {
      console.error("FPO marketplace error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFPOs = fpos.filter((fpo) => {
    const searchText = search.toLowerCase();

    return (
      fpo.cropName?.toLowerCase().includes(searchText) ||
      fpo.location?.toLowerCase().includes(searchText) ||
      fpo.name?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main fpo-marketplace">

        {/* Header */}
        <div className="fpo-marketplace-header">

          <div>
            <span className="fpo-eyebrow">
              🌾 DIRECT FARMER NETWORK
            </span>

            <h1>FPO Marketplace</h1>

            <p>
              Buy aggregated produce directly from
              Farmer Producer Organizations.
            </p>
          </div>

          <div className="fpo-header-icon">
            🌾
          </div>

        </div>

        {/* Search */}
        <div className="fpo-search-section">

          <div className="fpo-search-box">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by crop, location or FPO name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="fpo-count">
            <strong>{filteredFPOs.length}</strong>
            <span>FPOs available</span>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="fpo-state-card">
            <div className="fpo-loader"></div>
            <h3>Loading FPO marketplace...</h3>
            <p>
              Finding available farmer groups for you.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="fpo-state-card error-state">
            <div className="state-icon">⚠️</div>

            <h3>Unable to load FPOs</h3>

            <p>{error}</p>

            <button
              onClick={fetchFPOs}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredFPOs.length === 0 && (
            <div className="fpo-state-card">

              <div className="state-icon">
                🌾
              </div>

              <h3>No FPOs found</h3>

              <p>
                {search
                  ? "Try searching for another crop or location."
                  : "No farmer groups currently have produce available."}
              </p>

            </div>
          )}

        {/* FPO Cards */}
        {!loading &&
          !error &&
          filteredFPOs.length > 0 && (
            <div className="fpo-grid">

              {filteredFPOs.map((fpo) => (
                <div
                  className="fpo-card"
                  key={fpo._id}
                >

                  {/* Card Top */}
                  <div className="fpo-card-top">

                    <div className="crop-icon">
                      🌾
                    </div>

                    <span
                      className={`fpo-status ${fpo.status}`}
                    >
                      {fpo.status === "open"
                        ? "● Open"
                        : fpo.status}
                    </span>

                  </div>

                  {/* Name */}
                  <h2>{fpo.name}</h2>

                  <p className="fpo-crop">
                    🌱 {fpo.cropName}
                  </p>

                  {/* Main Quantity */}
                  <div className="fpo-quantity-box">

                    <div>
                      <span>
                        Available Produce
                      </span>

                      <strong>
                        {fpo.collectedQuantity}
                        <small> Q</small>
                      </strong>
                    </div>

                    <div className="quantity-divider"></div>

                    <div>
                      <span>
                        Target
                      </span>

                      <strong>
                        {fpo.targetQuantity}
                        <small> Q</small>
                      </strong>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="fpo-details">

                    <div className="fpo-detail">
                      <span>📍 Location</span>
                      <strong>
                        {fpo.location}
                      </strong>
                    </div>

                    <div className="fpo-detail">
                      <span>💰 Price</span>
                      <strong>
                        ₹{fpo.targetPrice}
                        <small>/Q</small>
                      </strong>
                    </div>

                    <div className="fpo-detail">
                      <span>⭐ Quality</span>
                      <strong>
                        {fpo.quality}
                      </strong>
                    </div>

                    <div className="fpo-detail">
                      <span>🏷️ Grade</span>
                      <strong>
                        {fpo.grade}
                      </strong>
                    </div>

                  </div>

                  {/* Leader */}
                  <div className="fpo-leader">

                    <div className="leader-avatar">
                      {fpo.leaderId?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "F"}
                    </div>

                    <div>
                      <span>
                        FPO Leader
                      </span>

                      <strong>
                        {fpo.leaderId?.name ||
                          "Farmer Leader"}
                      </strong>
                    </div>

                    <div className="member-count">
                      👥
                    </div>

                  </div>

                  {/* Button */}
                  <button
                    className="view-fpo-btn"
                    onClick={() =>
                      window.location.href =
                        `/buyer/fpos/${fpo._id}`
                    }
                  >
                    View FPO
                    <span>→</span>
                  </button>

                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
}

export default FPOMarketplace;