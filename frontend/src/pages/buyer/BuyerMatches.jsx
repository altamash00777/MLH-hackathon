import { useEffect, useState } from "react";
import axios from "axios";
import BuyerSidebar from "../../components/BuyerSidebar";

function BuyerMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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

    console.log("Sending accept request:", matchId);

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

    // Update UI
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match._id === matchId
          ? {
              ...match,
              status: "accepted",
            }
          : match
      )
    );

    setSuccessMessage(
      response.data.message || "Connection accepted successfully"
    );

  } catch (error) {
    console.error("Accept API error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);

      setError(
        error.response.data.message ||
        "Failed to accept connection"
      );
    } else {
      setError(
        "Cannot connect to server. Make sure backend is running."
      );
    }

  } finally {
    setAcceptingId(null);
  }
};


  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        {/* Header */}


        <div className="page-header">







          <div>
            <h1>Farmer Matches</h1>

            <p>
              Farmers matched with your requirements
            </p>
          </div>

        </div>


{successMessage && (
  <div className="success-message">
    ✓ {successMessage}
  </div>
)}


        {/* Loading */}

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


        {/* Error */}

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


        {/* No Matches */}

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


        {/* Matches */}

        {!loading &&
          !error &&
          matches.length > 0 && (

          <div className="matches-grid">

            {matches.map((match) => {

              const farmer =
                match.farmerId;

              const crop =
                match.farmerListingId;

              const requirement =
                match.buyerRequirementId;


              return (
                <div
                  className="match-card"
                  key={match._id}
                >

                  {/* Top */}

                  <div className="match-card-top">

                    <div className="match-crop-icon">
                      🌾
                    </div>

                    <div className="match-score">
                      {match.matchScore}% Match
                    </div>

                  </div>


                  {/* Crop */}

                  <h2 className="match-crop-name">
                    {crop?.cropName || "Crop"}
                  </h2>


                  {/* Farmer */}

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
                          "Unknown Farmer"}
                      </h3>

                    </div>

                  </div>


                  {/* Details */}

                  <div className="match-details">

                    <div>
                      <span>
                        Available Quantity
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
                        Grade
                      </span>

                      <strong>
                        {crop?.grade || "-"}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Location
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
                        {requirement?.requiredQuantity ||
                          0} kg
                      </strong>
                    </div>

                  </div>


                  {/* Connection Status */}

<div className="match-footer">

  {/* Status */}

  <span className={`match-status ${match.status}`}>

    {match.status === "accepted" &&
      "✓ Accepted"}

    {match.status === "contacted" &&
      "📨 Connection Request"}

    {match.status === "pending" &&
      "⏳ Pending"}

  </span>


  {/* Accept button */}

  {match.status === "contacted" && (
    <button
      className="accept-button"
      onClick={() => handleAccept(match._id)}
      disabled={acceptingId === match._id}
    >
      {acceptingId === match._id
        ? "Accepting..."
        : "✅ Accept Connection"}
    </button>

 
 
 )}

</div>










                   {/* <div className="match-footer">

                    {match.status === "contacted" ? (

                      <span className="match-status contacted">
                        📨 Farmer sent you a connection request
                      </span>

                    ) : match.status === "accepted" ? (

                      <span className="match-status accepted">
                        ✓ Connection Accepted
                      </span>

                    ) : match.status === "rejected" ? (

                      <span className="match-status rejected">
                        ✕ Connection Rejected
                      </span>

                    ) : (

                      <span className="match-status pending">
                        ⏳ Waiting for farmer
                      </span>

                    )}

                  </div> */}


















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