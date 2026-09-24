import { useEffect, useState } from "react";
import axios from "axios";
import BuyerSidebar from "../../components/BuyerSidebar";

function BuyerMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ================================
  // Fetch Buyer Matches
  // ================================

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/matches/buyer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("BUYER MATCHES API:", response.data);

      setMatches(response.data.matches || []);

    } catch (error) {
      console.error("Fetch Buyer Matches Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load matches"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // ================================
  // Accept Connection
  // ================================

  const handleAccept = async (matchId) => {
    try {
      setAcceptingId(matchId);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/matches/${matchId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Accept API response:", response.data);



setMatches((prevMatches) =>
  prevMatches.map((item) =>
    item.match?._id === matchId
      ? {
          ...item,
          match: {
            ...item.match,
            ...(response.data.match || {}),
            status: "accepted",
          },
        }
      : item
  )
);




      setSuccessMessage(
        response.data.message ||
        "Connection accepted successfully"
      );

    } catch (error) {
      console.error("Accept API error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to accept connection"
      );

    } finally {
      setAcceptingId(null);
    }
  };

  // ================================
  // Render
  // ================================

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        {/* =========================
            HEADER
        ========================== */}

        <div className="page-header">

          <div>

            <h1>Farmer Matches</h1>

            <p>
              Farmers matched with your requirements
            </p>

          </div>

        </div>

        {/* =========================
            SUCCESS
        ========================== */}

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
              Finding suitable farmers...
            </h3>

            <p>
              Please wait while we find the best matches.
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
              No farmer matches yet
            </h3>

            <p>
              We couldn't find farmers matching
              your requirements.
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



              const match = item?.match;

              const farmer =
                match?.farmerId;

              const crop =
                match?.farmerListingId;

              const requirement =
                match?.buyerRequirementId;

              const distance =
                item?.distance;

              const transport =
                item?.transport;

              const net =
                item?.netRealization;


              return (
                <div
                  className="match-card"
                  key={match?._id}
                >

                  {/* =========================
                      TOP
                  ========================== */}

                  <div className="match-card-top">

                    <div className="match-crop-icon">
                      🌾
                    </div>

                    <div className="match-score">
                      {match?.matchScore || 0}% Match
                    </div>

                  </div>


                  {/* =========================
                      CROP
                  ========================== */}

                  <h2 className="match-crop-name">

                    {crop?.cropName || "Crop"}

                  </h2>


                  {/* =========================
                      FARMER
                  ========================== */}

                  <div className="buyer-info">

                    <div className="buyer-avatar">

                      {farmer?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "F"}

                    </div>

                    <div>

                      <p className="buyer-label">
                        Farmer
                      </p>

                      <h3>

                        {farmer?.name ||
                          farmer?.fullName ||
                          "Unknown Farmer"}

                      </h3>

                    </div>

                  </div>



                  <div className="match-details">

                    <div>

                      <span>
                        Available Quantity
                      </span>

                      <strong>
                        {crop?.quantity || 0} quintals
                      </strong>

                    </div>


                    <div>

                      <span>
                        Expected Price
                      </span>

                      <strong>
                        ₹{Number(
                          crop?.expectedPrice || 0
                        ).toLocaleString("en-IN")}/quintal
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
                        Grade
                      </span>

                      <strong>
                        {crop?.grade || "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Farmer Location
                      </span>

                      <strong>
                        {crop?.sellingLocation ||
                          farmer?.location ||
                          "-"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Your Requirement
                      </span>

                      <strong>
                        {item?.matchedQuantity ||
                          requirement?.requiredQuantity ||
                          0} quintals
                      </strong>

                    </div>

                  </div>


                  <div className="realization-section">

                    {/* <h3>
                      🚛 Logistics
                    </h3>

                    <div className="realization-grid">

                      <div>

                        <span>
                          Distance
                        </span> */}

                        <strong>
                          {distance?.distanceKm || 0} km
                        </strong>

                      </div>


                      {/* <div>

                        <span>
                          Travel Time
                        </span>

                        <strong>
                          {distance?.durationMinutes || 0} min
                        </strong>

                      </div> */}


                      {/* <div>

                        <span>
                          Vehicles
                        </span>

                        <strong>
                          {transport?.vehiclesRequired || 0}
                        </strong>

                      </div> */}


                      {/* <div>

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

                  </div> */}


                  {/* =========================
                      NET REALIZATION
                  ========================== */}

                  {/* <div className="realization-section net-section">

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
 */}

                      {/* <div>

                        <span>
                          Total Selling Cost
                        </span>

                        <strong>
                          ₹{Number(
                            net?.totalSellingCost || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div> */}


                      {/* <div>

                        <span>
                          Break-even Price
                        </span>

                        <strong>
                          ₹{Number(
                            net?.breakEvenPrice || 0
                          ).toFixed(2)}/q
                        </strong>

                      </div> */}


                      {/* <div className="net-highlight">

                        <span>
                          Net Amount Received
                        </span>

                        <strong>
                          ₹{Number(
                            net?.netAmountReceived || 0
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div> */}


                      {/* <div className="profit-highlight">

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
                        </span> */}

                        {/* <strong>
                          ₹{Number(
                            net?.profitPerQuintal || 0
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </div>

                  </div> */}


                  {/* =========================
                      CONNECTION STATUS
                  ========================== */}

                  <div className="match-footer">

                    {match?.status === "accepted" && (

                      <span className="match-status accepted">
                        ✓ Connection Accepted
                      </span>

                    )}

                    {match?.status === "contacted" && (

                      <>

                        <span className="match-status contacted">
                          📨 Farmer sent you a connection request
                        </span>

                        <button
                          className="accept-button"
                          onClick={() =>
                            handleAccept(match?._id)
                          }
                          disabled={
                            acceptingId === match?._id
                          }
                        >

                          {acceptingId === match?._id
                            ? "Accepting..."
                            : "✅ Accept Connection"}

                        </button>

                      </>

                    )}

                    {match?.status === "new" && (

                      <span className="match-status pending">
                        ⏳ Waiting for farmer
                      </span>

                    )}

                    {match?.status === "rejected" && (

                      <span className="match-status rejected">
                        ✕ Connection Rejected
                      </span>

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

export default BuyerMatches;
