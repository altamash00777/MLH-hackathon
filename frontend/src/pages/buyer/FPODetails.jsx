import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import "./FPODetails.css";

function FPODetails() {
  const { fpoId } = useParams();
  const navigate = useNavigate();

  const [fpo, setFpo] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFPO();
  }, [fpoId]);

  const fetchFPO = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/fpo/${fpoId}/buyer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load FPO"
        );
      }

      setFpo(data.fpo);
    } catch (err) {
      console.error("FPO details error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setMessage("");
    setError("");

    const purchaseQuantity = Number(quantity);

    if (!purchaseQuantity || purchaseQuantity <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (purchaseQuantity > fpo.availableQuantity) {
      setError(
        `Only ${fpo.availableQuantity} quintals are available.`
      );
      return;
    }

    try {
      setBuying(true);

      const response = await fetch(
        `http://localhost:5000/api/fpo/${fpoId}/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: purchaseQuantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Purchase request failed"
        );
      }

      setMessage(
        "Purchase request sent successfully! The FPO leader will review your request."
      );

      setQuantity("");

      fetchFPO();
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <BuyerSidebar />

        <main className="dashboard-main">
          <div className="fpo-details-state">
            <div className="fpo-details-loader"></div>
            <h3>Loading FPO details...</h3>
          </div>
        </main>
      </div>
    );
  }

  if (error && !fpo) {
    return (
      <div className="dashboard-layout">
        <BuyerSidebar />

        <main className="dashboard-main">
          <div className="fpo-details-state">
            <div className="state-icon">⚠️</div>

            <h3>Unable to load FPO</h3>

            <p>{error}</p>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/buyer/fpos")
              }
            >
              ← Back to Marketplace
            </button>
          </div>
        </main>
      </div>
    );
  }

  const totalAmount =
    Number(quantity || 0) *
    Number(fpo.targetPrice || 0);

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main fpo-details-page">

        {/* Back */}
        <button
          className="back-link"
          onClick={() =>
            navigate("/buyer/fpos")
          }
        >
          ← Back to FPO Marketplace
        </button>

        {/* Header */}
        <div className="fpo-details-header">

          <div className="details-header-left">

            <div className="large-crop-icon">
              🌾
            </div>

            <div>
              <span className="details-label">
                FARMER PRODUCER ORGANIZATION
              </span>

              <h1>{fpo.name}</h1>

              <p>
                🌱 {fpo.cropName} • 📍 {fpo.location}
              </p>
            </div>

          </div>

          <span
            className={`details-status ${fpo.status}`}
          >
            ● {fpo.status}
          </span>

        </div>

        {/* Main content */}
        <div className="fpo-details-grid">

          {/* Left */}
          <div>

            {/* Availability */}
            <div className="details-card">

              <h2>Produce Availability</h2>

              <div className="availability-box">

                <div>
                  <span>Available</span>

                  <strong>
                    {fpo.availableQuantity}
                    <small> Q</small>
                  </strong>
                </div>

                <div>
                  <span>Target</span>

                  <strong>
                    {fpo.targetQuantity}
                    <small> Q</small>
                  </strong>
                </div>

                <div>
                  <span>Members</span>

                  <strong>
                    {fpo.memberCount}
                  </strong>
                </div>

              </div>

            </div>

            {/* Product Details */}
            <div className="details-card">

              <h2>Produce Details</h2>

              <div className="product-details-grid">

                <div>
                  <span>Crop</span>
                  <strong>{fpo.cropName}</strong>
                </div>

                <div>
                  <span>Quality</span>
                  <strong>{fpo.quality}</strong>
                </div>

                <div>
                  <span>Grade</span>
                  <strong>{fpo.grade}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{fpo.location}</strong>
                </div>

              </div>

            </div>

            {/* Leader */}
            <div className="details-card">

              <h2>FPO Leader</h2>

              <div className="leader-info">

                <div className="large-avatar">
                  {fpo.leader?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "F"}
                </div>

                <div>
                  <strong>
                    {fpo.leader?.name ||
                      "FPO Leader"}
                  </strong>

                  <span>
                    FPO Coordinator
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Right */}
          <div>

            <div className="purchase-card">

              <div className="purchase-icon">
                🛒
              </div>

              <h2>Request Produce</h2>

              <p>
                Enter the quantity you want to
                purchase from this FPO.
              </p>

              <label>
                Quantity (Quintals)
              </label>

              <input
                type="number"
                min="1"
                max={fpo.availableQuantity}
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />

              <div className="price-row">
                <span>Price per quintal</span>

                <strong>
                  ₹{fpo.targetPrice}
                </strong>
              </div>

              <div className="price-row total-row">
                <span>Estimated total</span>

                <strong>
                  ₹{totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              {error && (
                <div className="purchase-error">
                  ⚠️ {error}
                </div>
              )}

              {message && (
                <div className="purchase-success">
                  ✅ {message}
                </div>
              )}

              <button
                className="purchase-btn"
                onClick={handlePurchase}
                disabled={
                  buying ||
                  fpo.availableQuantity <= 0
                }
              >
                {buying
                  ? "Sending Request..."
                  : "Request Purchase →"}
              </button>

              <small className="purchase-note">
                Your request will be sent to the
                FPO leader for approval.
              </small>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default FPODetails;