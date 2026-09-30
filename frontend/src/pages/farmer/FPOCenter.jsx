import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./FPOCenter.css";

const API = "http://localhost:5000/api";

const FPOCenter = () => {
  const [activeTab, setActiveTab] = useState("available");

  const [listings, setListings] = useState([]);
  const [fpos, setFpos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Join modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedFPO, setSelectedFPO] = useState(null);
  const [joinListingId, setJoinListingId] = useState("");
  const [joinQuantity, setJoinQuantity] = useState("");

  // Create FPO
  const [createListingId, setCreateListingId] = useState("");
  const [createName, setCreateName] = useState("");
  const [createTargetQuantity, setCreateTargetQuantity] = useState("");

  // Purchase requests
  const [selectedPurchaseFPO, setSelectedPurchaseFPO] = useState(null);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  /* =========================================
     AUTH HEADER
  ========================================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  };

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  });

  /* =========================================
     CLEAR MESSAGES
  ========================================= */

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  /* =========================================
     FETCH FARMER LISTINGS
  ========================================= */

  const fetchListings = async () => {
    try {
      const response = await fetch(
        `${API}/farmer/listings`,
        {
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load crop listings"
        );
      }

      setListings(data.listings || []);
    } catch (err) {
      console.error("Listings error:", err);
      setError(err.message);
    }
  };

  /* =========================================
     FETCH AVAILABLE FPOs
  ========================================= */

  const fetchFPOs = async () => {
    try {
      const response = await fetch(
        `${API}/fpo`,
        {
          headers: getHeaders()
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
      console.error("FPO error:", err);
      setError(err.message);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchListings(),
        fetchFPOs()
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  /* =========================================
     OPEN JOIN MODAL
  ========================================= */

  const openJoinModal = (fpo) => {
    clearMessages();

    setSelectedFPO(fpo);

    const matchingListing = listings.find(
      (listing) =>
        listing.status === "active" &&
        Number(listing.availableQuantity) > 0 &&
        listing.cropName?.toLowerCase() ===
          fpo.cropName?.toLowerCase()
    );

    setJoinListingId(
      matchingListing?._id || ""
    );

    setJoinQuantity("");

    setShowJoinModal(true);
  };

  /* =========================================
     JOIN FPO
  ========================================= */

  const handleJoinFPO = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!selectedFPO) {
      setError("FPO not selected");
      return;
    }

    if (!joinListingId) {
      setError("Please select a crop listing");
      return;
    }

    if (!joinQuantity || Number(joinQuantity) <= 0) {
      setError("Enter a valid quantity");
      return;
    }

    const selectedListing = listings.find(
      (listing) => listing._id === joinListingId
    );

    if (
      selectedListing &&
      Number(joinQuantity) >
        Number(selectedListing.availableQuantity)
    ) {
      setError(
        `Only ${selectedListing.availableQuantity} quintals are available`
      );
      return;
    }

    if (
      Number(joinQuantity) >
      Number(selectedFPO.remainingQuantity)
    ) {
      setError(
        `Only ${selectedFPO.remainingQuantity} quintals are required`
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API}/fpo/${selectedFPO._id}/join`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            listingId: joinListingId,
            quantity: Number(joinQuantity)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to join FPO"
        );
      }

      setMessage(
        data.message || "Successfully joined FPO"
      );

      setShowJoinModal(false);
      setSelectedFPO(null);

      await Promise.all([
        fetchListings(),
        fetchFPOs()
      ]);
    } catch (err) {
      console.error("Join FPO error:", err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     CREATE FPO
  ========================================= */

  const handleCreateFPO = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!createListingId) {
      setError("Please select a crop listing");
      return;
    }

    if (!createName.trim()) {
      setError("Please enter an FPO name");
      return;
    }

    if (
      !createTargetQuantity ||
      Number(createTargetQuantity) <= 0
    ) {
      setError("Enter a valid target quantity");
      return;
    }

    const selectedListing = listings.find(
      (listing) => listing._id === createListingId
    );

    if (!selectedListing) {
      setError("Selected listing not found");
      return;
    }

    if (Number(createTargetQuantity) >
        Number(selectedListing.availableQuantity)) {
      setError(
        `Target quantity cannot exceed available quantity (${selectedListing.availableQuantity} Q)`
      );
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API}/fpo`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            listingId: createListingId,
            name: createName.trim(),
            targetQuantity: Number(
              createTargetQuantity
            )
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create FPO"
        );
      }

      setMessage(
        data.message || "FPO created successfully"
      );

      setCreateListingId("");
      setCreateName("");
      setCreateTargetQuantity("");

      setActiveTab("available");

      await Promise.all([
        fetchListings(),
        fetchFPOs()
      ]);
    } catch (err) {
      console.error("Create FPO error:", err);
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     LOAD PURCHASE REQUESTS
  ========================================= */

  const loadPurchaseRequests = async (fpo) => {
    clearMessages();

    setSelectedPurchaseFPO(fpo);
    setPurchaseLoading(true);

    try {
      const response = await fetch(
        `${API}/fpo/${fpo._id}/purchases`,
        {
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load purchase requests"
        );
      }

      setPurchaseRequests(
        data.purchases || []
      );
    } catch (err) {
      console.error(
        "Purchase request error:",
        err
      );

      setPurchaseRequests([]);
      setError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  /* =========================================
     ACCEPT / REJECT PURCHASE
  ========================================= */

  const updatePurchaseStatus = async (
    fpoId,
    purchaseId,
    action
  ) => {
    clearMessages();

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API}/fpo/${fpoId}/purchases/${purchaseId}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            action
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${action} purchase`
        );
      }

      setMessage(
        data.message ||
          `Purchase request ${action}ed successfully`
      );

      await loadPurchaseRequests(
        selectedPurchaseFPO
      );

      await fetchFPOs();
    } catch (err) {
      console.error(
        "Purchase status error:",
        err
      );

      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     AVAILABLE LISTINGS
  ========================================= */

  const activeListings = listings.filter(
    (listing) =>
      listing.status === "active" &&
      Number(listing.availableQuantity) > 0
  );

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="farmer-fpo-page">

      {/* EXISTING FARMER SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="fpo-page-content">

        {/* HEADER */}
        <section className="farmer-fpo-header">

          <div>
            <p className="farmer-fpo-eyebrow">
              DISHA Farmer Network
            </p>

            <h1>
              FPO Center 🌾
            </h1>

            <p>
              Join farmer groups, aggregate produce
              and manage buyer requests.
            </p>
          </div>

          <div className="farmer-fpo-header-icon">
            🌾
          </div>

        </section>

        {/* MESSAGES */}
        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠ {error}
          </div>
        )}

        {/* TABS */}
        <div className="fpo-tabs">

          <button
            className={
              activeTab === "available"
                ? "fpo-tab active"
                : "fpo-tab"
            }
            onClick={() => {
              clearMessages();
              setActiveTab("available");
              setSelectedPurchaseFPO(null);
            }}
          >
            🌾 Available FPOs
          </button>

          <button
            className={
              activeTab === "create"
                ? "fpo-tab active"
                : "fpo-tab"
            }
            onClick={() => {
              clearMessages();
              setActiveTab("create");
              setSelectedPurchaseFPO(null);
            }}
          >
            ➕ Create FPO
          </button>

          <button
            className={
              activeTab === "manage"
                ? "fpo-tab active"
                : "fpo-tab"
            }
            onClick={() => {
              clearMessages();
              setActiveTab("manage");
              setSelectedPurchaseFPO(null);
            }}
          >
            🛒 Purchase Requests
          </button>

        </div>

        {/* =====================================
            AVAILABLE FPOs
        ===================================== */}

        {activeTab === "available" && (
          <section>

            <div className="fpo-section-heading">

              <div>
                <h2>
                  Available FPOs
                </h2>

                <p>
                  FPOs matching the crops you
                  currently have available.
                </p>
              </div>

              <span>
                {fpos.length} FPO
                {fpos.length !== 1 ? "s" : ""}
              </span>

            </div>

            {loading ? (
              <div className="fpo-loading">
                <div className="fpo-spinner"></div>
                <p>Loading FPOs...</p>
              </div>
            ) : fpos.length === 0 ? (

              <div className="farmer-fpo-state">

                <div className="farmer-fpo-state-icon">
                  🌾
                </div>

                <h3>
                  No FPOs available
                </h3>

                <p>
                  Create an FPO or add an active
                  crop listing to see matching
                  farmer groups.
                </p>

              </div>

            ) : (

              <div className="farmer-fpo-grid">

                {fpos.map((fpo) => (

                  <div
                    className="farmer-fpo-card"
                    key={fpo._id}
                  >

                    <div className="farmer-fpo-card-top">

                      <div className="farmer-crop-icon">
                        🌾
                      </div>

                      <span className="farmer-open-badge">
                        {fpo.status}
                      </span>

                    </div>

                    <h3>
                      {fpo.name}
                    </h3>

                    <p className="farmer-fpo-crop">
                      {fpo.cropName}
                    </p>

                    <div className="farmer-fpo-quantity">

                      <div>
                        <span>
                          Collected
                        </span>

                        <strong>
                          {fpo.collectedQuantity} Q
                        </strong>
                      </div>

                      <div>
                        <span>
                          Still Needed
                        </span>

                        <strong>
                          {fpo.remainingQuantity} Q
                        </strong>
                      </div>

                    </div>

                    <div className="farmer-fpo-info">

                      <div>
                        <span>
                          📍 Location
                        </span>

                        <strong>
                          {fpo.location}
                        </strong>
                      </div>

                      <div>
                        <span>
                          💰 Target Price
                        </span>

                        <strong>
                          ₹{fpo.targetPrice}/Q
                        </strong>
                      </div>

                      <div>
                        <span>
                          ⭐ Quality
                        </span>

                        <strong>
                          {fpo.quality}
                        </strong>
                      </div>

                      <div>
                        <span>
                          🏆 Grade
                        </span>

                        <strong>
                          {fpo.grade}
                        </strong>
                      </div>

                    </div>

                    <button
                      className="join-fpo-btn"
                      onClick={() =>
                        openJoinModal(fpo)
                      }
                    >
                      Join FPO
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>
        )}

        {/* =====================================
            CREATE FPO
        ===================================== */}

        {activeTab === "create" && (
          <section className="create-fpo-container">

            <div className="create-fpo-intro">

              <div className="create-fpo-icon">
                🌾
              </div>

              <div>
                <h2>
                  Create a New FPO
                </h2>

                <p>
                  Start a farmer group around one
                  of your active crop listings.
                </p>
              </div>

            </div>

            <form
              className="create-fpo-form"
              onSubmit={handleCreateFPO}
            >

              <div className="form-group">

                <label>
                  Select Crop Listing
                </label>

                <select
                  value={createListingId}
                  onChange={(e) =>
                    setCreateListingId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select your crop
                  </option>

                  {activeListings.map(
                    (listing) => (
                      <option
                        key={listing._id}
                        value={listing._id}
                      >
                        {listing.cropName} —{" "}
                        {listing.availableQuantity} Q
                        available
                      </option>
                    )
                  )}

                </select>

                <small>
                  Only active listings with
                  available quantity are shown.
                </small>

              </div>

              <div className="form-group">

                <label>
                  FPO Name
                </label>

                <input
                  type="text"
                  value={createName}
                  onChange={(e) =>
                    setCreateName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Lucknow Rice Farmers"
                />

              </div>

              <div className="form-group">

                <label>
                  Target Quantity (Quintals)
                </label>

                <input
                  type="number"
                  min="1"
                  value={createTargetQuantity}
                  onChange={(e) =>
                    setCreateTargetQuantity(
                      e.target.value
                    )
                  }
                  placeholder="Enter target quantity"
                />

              </div>

              {createListingId && (
                <div className="selected-listing-preview">

                  {(() => {
                    const listing =
                      listings.find(
                        (item) =>
                          item._id ===
                          createListingId
                      );

                    if (!listing) return null;

                    return (
                      <>
                        <div className="preview-crop">
                          🌾 {listing.cropName}
                        </div>

                        <span>
                          Available:
                        </span>{" "}
                        <strong>
                          {listing.availableQuantity} Q
                        </strong>

                        <br />

                        <span>
                          Expected Price:
                        </span>{" "}
                        <strong>
                          ₹{listing.expectedPrice}/Q
                        </strong>
                      </>
                    );
                  })()}

                </div>
              )}

              <button
                type="submit"
                className="create-fpo-btn"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Creating..."
                  : "Create FPO"}
              </button>

            </form>

          </section>
        )}

        {/* =====================================
            PURCHASE REQUESTS / MANAGE
        ===================================== */}

        {activeTab === "manage" && (
          <section>

            <div className="fpo-section-heading">

              <div>
                <h2>
                  Purchase Requests
                </h2>

                <p>
                  Review buyer requests for your
                  FPO and accept or reject them.
                </p>
              </div>

            </div>

            {fpos.length === 0 ? (

              <div className="farmer-fpo-state">

                <div className="farmer-fpo-state-icon">
                  🛒
                </div>

                <h3>
                  No FPOs found
                </h3>

                <p>
                  Create an FPO first to receive
                  purchase requests.
                </p>

              </div>

            ) : (

              <div className="fpo-management-grid">

                {fpos.map((fpo) => (

                  <div
                    className="fpo-management-card"
                    key={fpo._id}
                  >

                    <div className="management-header">

                      <div>

                        <h3>
                          {fpo.name}
                        </h3>

                        <p>
                          {fpo.cropName} •{" "}
                          {fpo.location}
                        </p>

                      </div>

                      <span
                        className={`status-badge ${fpo.status}`}
                      >
                        {fpo.status}
                      </span>

                    </div>

                    <div className="management-stats">

                      <div className="management-stat">
                        <span>
                          Collected
                        </span>

                        <strong>
                          {fpo.collectedQuantity} Q
                        </strong>
                      </div>

                      <div className="management-stat">
                        <span>
                          Target
                        </span>

                        <strong>
                          {fpo.targetQuantity} Q
                        </strong>
                      </div>

                    </div>

                    <button
                      className="purchase-btn"
                      onClick={() =>
                        loadPurchaseRequests(fpo)
                      }
                    >
                      🛒 Purchase Requests
                    </button>

                  </div>

                ))}

              </div>

            )}

            {/* PURCHASE REQUEST PANEL */}

            {selectedPurchaseFPO && (

              <div className="purchase-request-panel">

                <div className="purchase-panel-header">

                  <div>
                    <h3>
                      🛒 Purchase Requests
                    </h3>

                    <p>
                      {selectedPurchaseFPO.name}
                    </p>
                  </div>

                  <button
                    className="close-btn"
                    onClick={() =>
                      setSelectedPurchaseFPO(null)
                    }
                  >
                    ✕
                  </button>

                </div>

                {purchaseLoading ? (

                  <div className="fpo-loading">
                    <div className="fpo-spinner"></div>
                    <p>
                      Loading purchase requests...
                    </p>
                  </div>

                ) : purchaseRequests.length === 0 ? (

                  <div className="empty-state small">

                    <div className="farmer-fpo-state-icon">
                      🛒
                    </div>

                    <h3>
                      No purchase requests
                    </h3>

                    <p>
                      Buyers have not requested
                      produce from this FPO yet.
                    </p>

                  </div>

                ) : (

                  <div className="purchase-list">

                    {purchaseRequests.map(
                      (purchase) => (

                        <div
                          className="purchase-request-card"
                          key={purchase._id}
                        >

                          {/* BUYER */}

                          <div className="buyer-section">

                            <div className="buyer-avatar">
                              {purchase.buyerId?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "B"}
                            </div>

                            <div>

                              <h4>
                                {purchase.buyerId
                                  ?.name ||
                                  "Buyer"}
                              </h4>

                              <p>
                                📍{" "}
                                {purchase.buyerId
                                  ?.location ||
                                  "Location unavailable"}
                              </p>

                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="purchase-details">

                            <div className="purchase-detail">

                              <span>
                                Quantity
                              </span>

                              <strong>
                                {purchase.quantity} Q
                              </strong>

                            </div>

                            <div className="purchase-detail">

                              <span>
                                Price / Q
                              </span>

                              <strong>
                                ₹
                                {purchase.pricePerQuintal}
                              </strong>

                            </div>

                            <div className="purchase-detail">

                              <span>
                                Total Amount
                              </span>

                              <strong>
                                ₹
                                {Number(
                                  purchase.totalAmount
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                            <div className="purchase-detail">

                              <span>
                                Requested
                              </span>

                              <strong>
                                {purchase.createdAt
                                  ? new Date(
                                      purchase.createdAt
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                      }
                                    )
                                  : "-"}
                              </strong>

                            </div>

                          </div>

                          {/* FOOTER */}

                          <div className="purchase-footer">

                            <span
                              className={`purchase-status ${purchase.status}`}
                            >
                              {purchase.status}
                            </span>

                            {purchase.status ===
                              "pending" && (

                              <div className="purchase-actions">

                                <button
                                  className="accept-btn"
                                  disabled={
                                    actionLoading
                                  }
                                  onClick={() =>
                                    updatePurchaseStatus(
                                      selectedPurchaseFPO._id,
                                      purchase._id,
                                      "accept"
                                    )
                                  }
                                >
                                  ✓ Accept
                                </button>

                                <button
                                  className="reject-btn"
                                  disabled={
                                    actionLoading
                                  }
                                  onClick={() =>
                                    updatePurchaseStatus(
                                      selectedPurchaseFPO._id,
                                      purchase._id,
                                      "reject"
                                    )
                                  }
                                >
                                  ✕ Reject
                                </button>

                              </div>

                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </section>
        )}

      </main>

      {/* =====================================
          JOIN FPO MODAL
      ===================================== */}

      {showJoinModal &&
        selectedFPO && (

          <div className="fpo-modal-overlay">

            <div className="fpo-modal">

              <button
                className="fpo-modal-close"
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedFPO(null);
                  clearMessages();
                }}
              >
                ✕
              </button>

              <div className="modal-icon">
                🌾
              </div>

              <h2>
                Join {selectedFPO.name}
              </h2>

              <p className="modal-description">
                Contribute your {selectedFPO.cropName}
                produce to this farmer group.
              </p>

              <div className="modal-summary">

                <div>
                  <span>
                    Crop
                  </span>

                  <strong>
                    {selectedFPO.cropName}
                  </strong>
                </div>

                <div>
                  <span>
                    Still Needed
                  </span>

                  <strong>
                    {selectedFPO.remainingQuantity} Q
                  </strong>
                </div>

                <div>
                  <span>
                    Location
                  </span>

                  <strong>
                    {selectedFPO.location}
                  </strong>
                </div>

                <div>
                  <span>
                    Price
                  </span>

                  <strong>
                    ₹{selectedFPO.targetPrice}/Q
                  </strong>
                </div>

              </div>

              <form onSubmit={handleJoinFPO}>

                <div className="form-group">

                  <label>
                    Your Crop Listing
                  </label>

                  <select
                    value={joinListingId}
                    onChange={(e) =>
                      setJoinListingId(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select listing
                    </option>

                    {activeListings
                      .filter(
                        (listing) =>
                          listing.cropName
                            ?.toLowerCase() ===
                          selectedFPO.cropName
                            ?.toLowerCase()
                      )
                      .map((listing) => (

                        <option
                          key={listing._id}
                          value={listing._id}
                        >
                          {listing.cropName} —{" "}
                          {listing.availableQuantity} Q
                          available
                        </option>

                      ))}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Quantity to Contribute (Q)
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={
                      selectedFPO.remainingQuantity
                    }
                    value={joinQuantity}
                    onChange={(e) =>
                      setJoinQuantity(
                        e.target.value
                      )
                    }
                    placeholder="Enter quantity"
                  />

                </div>

                <div className="modal-warning">
                  ⚠ This quantity will be reserved
                  from your crop listing.
                </div>

                {error && (
                  <div className="modal-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="modal-join-btn"
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Joining..."
                    : "Confirm & Join FPO"}
                </button>

              </form>

            </div>

          </div>
        )}

    </div>
  );
};

export default FPOCenter;