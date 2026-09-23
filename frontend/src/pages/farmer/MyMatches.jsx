import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "./MyMatches.css"

function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactingId, setContactingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/matches/farmer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatches(response.data.matches || []);

    } catch (error) {
      console.error("Fetch Matches Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load matches"
      );

    } finally {
      setLoading(false);
    }
  };


const handleContact = async (matchId) => {
  try {
    setContactingId(matchId);
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in");
      return;
    }

    const response = await axios.post(
      `http://localhost:5000/api/matches/${matchId}/contact`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      }
    );

    console.log("CONTACT RESPONSE:", response.data);

    if (response.data.success) {

      setMatches((prevMatches) =>
        prevMatches.map((item) =>
          item.match?._id === matchId
            ? {
                ...item,
                match: {
                  ...item.match,
                  ...(response.data.match || {}),
                  status: "contacted",
                },
              }
            : item
        )
      );

      setSuccessMessage(
        response.data.message ||
        "Connection request sent successfully"
      );

    } else {
      setError(
        response.data.message ||
        "Failed to contact buyer"
      );
    }

  } catch (error) {

    console.error("Contact Match Error:", error);

    setError(
      error.response?.data?.message ||
      "Unable to contact buyer. Please try again."
    );

  } finally {
    setContactingId(null);
  }
};


  // ================================
  // Load matches
  // ================================

  useEffect(() => {
    fetchMatches();
  }, []);


  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* =========================
            HEADER
        ========================== */}

        <div className="page-header">

          <div>

            <h1>My Matches</h1>

            <p>
              Buyers matched with your crop listings
            </p>

          </div>

        </div>


        {/* SUCCESS */}

        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}


        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Finding your matches...
            </h3>

            <p>
              Please wait while we find suitable buyers.
            </p>

          </div>
        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading && error && (
          <div className="empty-state">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>
              Unable to load matches
            </h3>

            <p>
              {error}
            </p>

            <button onClick={fetchMatches}>
              Try Again
            </button>

          </div>
        )}


        {/* =========================
            NO MATCHES
        ========================== */}

        {!loading &&
          !error &&
          matches.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">
              🤝
            </div>

            <h3>
              No matches found
            </h3>

            <p>
              We couldn't find any buyers matching
              your crops right now.
            </p>

          </div>
        )}


        {/* =========================
            MATCHES
        ========================== */}

        {!loading &&
          !error &&
          matches.length > 0 && (

          <div className="matches-grid">

            {matches.map((item) => {

              // =========================
              // IMPORTANT:
              // API structure is:
              // item.match
              // item.matchedQuantity
              // item.distance
              // item.transport
              // item.netRealization
              // =========================

              const match = item.match;

              const crop =
                match?.farmerListingId;

              const buyerRequirement =
                match?.buyerRequirementId;

              const buyerId =
                match?.buyerId;

              const net =
                item.netRealization;

              const distance =
                item.distance;

              const transport =
                item.transport;


              return (
                <div
                  className="match-card"
                  key={match?._id}
                >

                  {/* =================
                      TOP
                  ================== */}

                  <div className="match-card-top">

                    <div className="match-crop-icon">
                      🌾
                    </div>

                    <div className="match-score">
                      {match?.matchScore || 0}% Match
                    </div>

                  </div>


                  {/* =================
                      CROP
                  ================== */}

                  <h2 className="match-crop-name">

                    {crop?.cropName || "Crop"}

                  </h2>


                  {/* =================
                      BUYER
                  ================== */}

                  <div className="buyer-info">

                    <div className="buyer-avatar">

                      B

                    </div>

                    <div>

                      <p className="buyer-label">
                        Buyer
                      </p>

                      <h3>
                        Buyer
                      </h3>

                      <small>
                        ID: {buyerId || "Unknown"}
                      </small>

                    </div>

                  </div>


                  {/* =================
                      BASIC DETAILS
                  ================== */}

                  <div className="match-details">

                    <div>

                      <span>
                        Required Quantity
                      </span>

                      <strong>
                        {item.matchedQuantity || 0} quintals
                      </strong>

                    </div>


                    <div>

                      <span>
                        Buyer Price
                      </span>

                      <strong>
                        ₹{buyerRequirement?.expectedPrice || 0}/quintal
                      </strong>

                    </div>


                    <div>

                      <span>
                        Quality
                      </span>

                      <strong>
                        {buyerRequirement?.quality || "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Grade
                      </span>

                      <strong>
                        {buyerRequirement?.grade || "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Buyer Location
                      </span>

                      <strong>
                        {buyerRequirement?.location || "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Your Location
                      </span>

                      <strong>
                        {crop?.sellingLocation || "-"}
                      </strong>

                    </div>

                  </div>


                  {/* =========================
                      DISTANCE & TRANSPORT
                  ========================== */}

                  <div className="realization-section">

                    <h3>
                      🚛 Logistics
                    </h3>

                    <div className="realization-grid">

                      <div>

                        <span>
                          Distance
                        </span>

                        <strong>
                          {distance?.distanceKm || 0} km
                        </strong>

                      </div>


                      <div>

                        <span>
                          Travel Time
                        </span>

                        <strong>
                          {distance?.durationMinutes || 0} min
                        </strong>

                      </div>


                      <div>

                        <span>
                          Vehicles
                        </span>

                        <strong>
                          {transport?.vehiclesRequired || 0}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Transport Cost
                        </span>

                        <strong>
                          ₹{Number(
                            transport?.transportCost || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* =========================
                      NET REALIZATION
                  ========================== */}

                  <div className="realization-section net-section">

                    <h3>
                      💰 Net Realization
                    </h3>

                    <div className="realization-grid">

                      <div>

                        <span>
                          Gross Revenue
                        </span>

                        <strong>
                          ₹{Number(
                            net?.grossRevenue || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Total Selling Cost
                        </span>

                        <strong>
                          ₹{Number(
                            net?.totalSellingCost || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Break-even Price
                        </span>

                        <strong>
                          ₹{Number(
                            net?.breakEvenPrice || 0
                          ).toFixed(2)}/q
                        </strong>

                      </div>


                      <div className="net-highlight">

                        <span>
                          Net Amount Received
                        </span>

                        <strong>
                          ₹{Number(
                            net?.netAmountReceived || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>


                      <div className="profit-highlight">

                        <span>
                          Profit
                        </span>

                        <strong>
                          ₹{Number(
                            net?.profit || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>


                      <div className="profit-highlight">

                        <span>
                          Profit / Quintal
                        </span>

                        <strong>
                          ₹{Number(
                            net?.profitPerQuintal || 0
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* =================
                      FOOTER
                  ================== */}

                  <div className="match-footer">

                    {match?.status === "contacted" ? (

                      <span className="match-status contacted">
                        📨 Contacted
                      </span>

                    ) : match?.status === "accepted" ? (

                      <span className="match-status accepted">
                        ✓ Accepted
                      </span>

                    ) : match?.status === "rejected" ? (

                      <span className="match-status rejected">
                        ✕ Rejected
                      </span>

                    ) : (

                      <button
                        className="contact-button"
                        onClick={() =>
                          handleContact(match?._id)
                        }
                        disabled={
                          contactingId === match?._id
                        }
                      >

                        {contactingId === match?._id
                          ? "Sending..."
                          : "🤝 Contact Buyer"}

                      </button>

                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyMatches;