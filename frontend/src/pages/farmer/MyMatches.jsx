import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

function MyMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactingId, setContactingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ================================
  // Fetch Farmer Matches
  // ================================

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


  // ================================
  // Contact Buyer
  // ================================

  const handleContact = async (matchId) => {
    try {
      setContactingId(matchId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/matches/${matchId}/contact`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(
        response.data.message ||
        "Connection request sent successfully"
      );

      // Update UI immediately
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === matchId
            ? {
                ...match,
                status: "contacted",
              }
            : match
        )
      );

    } catch (error) {
      console.error("Contact Match Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to contact buyer"
      );

    } finally {
      setContactingId(null);
    }
  };


  // ================================
  // Load matches when page opens
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

            {matches.map((match) => {

              const crop =
                match.farmerListingId;

              const buyer =
                match.buyerId;


              return (
                <div
                  className="match-card"
                  key={match._id}
                >

                  {/* =================
                      TOP
                  ================== */}

                  <div className="match-card-top">

                    <div className="match-crop-icon">
                      🌾
                    </div>

                    <div className="match-score">
                      {match.matchScore}% Match
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

                      {buyer?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "B"}

                    </div>

                    <div>

                      <p className="buyer-label">
                        Buyer
                      </p>

                      <h3>

                        {buyer?.companyName ||
                          buyer?.name ||
                          "Unknown Buyer"}

                      </h3>

                    </div>

                  </div>


                  {/* =================
                      DETAILS
                  ================== */}

                  <div className="match-details">

                    <div>

                      <span>
                        Your Quantity
                      </span>

                      <strong>
                        {crop?.quantity || 0} kg
                      </strong>

                    </div>


                    <div>

                      <span>
                        Expected Price
                      </span>

                      <strong>
                        ₹{crop?.expectedPrice || 0}/kg
                      </strong>

                    </div>


                    <div>

                      <span>
                        Quality
                      </span>

                      <strong>
                        {crop?.quality || "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Location
                      </span>

                      <strong>
                        {crop?.sellingLocation ||
                          buyer?.location ||
                          "-"}
                      </strong>

                    </div>

                  </div>


                  {/* =================
                      FOOTER
                  ================== */}

                  <div className="match-footer">

                    {/* Status / Contact Button */}

                    {match.status === "contacted" ? (

                      <span className="match-status contacted">
                        📨 Contacted
                      </span>

                    ) : match.status === "accepted" ? (

                      <span className="match-status accepted">
                        ✓ Accepted
                      </span>

                    ) : match.status === "rejected" ? (

                      <span className="match-status rejected">
                        ✕ Rejected
                      </span>

                    ) : (

                      <button
                        className="contact-button"
                        onClick={() =>
                          handleContact(match._id)
                        }
                        disabled={
                          contactingId === match._id
                        }
                      >

                        {contactingId === match._id
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