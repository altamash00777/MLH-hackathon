
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import BuyerSidebar from "../../components/BuyerSidebar";
import "./BuyerDeals.css";

const BuyerDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
const [pickupDate, setPickupDate] = useState("");
const [pickupTime, setPickupTime] = useState("");
const [scheduling, setScheduling] = useState(false);
  // -----------------------------------------
  // FETCH BUYER DEALS
  // -----------------------------------------
  const fetchDeals = async () => {
    try {
      const response = await api.get("/deals");

      console.log("Buyer deals response:", response.data);

      setDeals(response.data.deals || response.data || []);
    } catch (error) {
      console.error("Error fetching buyer deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // -----------------------------------------
  // FIND NEXT ACTION FOR BUYER
  // -----------------------------------------
  const getNextAction = (deal) => {
    const tasks = deal.tasks || {};

    // Completed
    if (deal.status === "completed") {
      return {
        type: "completed",
        title: "Deal Completed",
        message:
          "All coordination steps have been completed successfully.",
      };
    }

    // Farmer must confirm quantity
    if (!tasks.farmer?.quantityConfirmed) {
      return {
        type: "waiting",
        title: "Waiting for Farmer",
        message:
          "The farmer needs to confirm the agreed quantity.",
      };
    }

    // Farmer must mark produce ready
    if (!tasks.farmer?.produceReady) {
      return {
        type: "waiting",
        title: "Waiting for Farmer",
        message:
          "The farmer needs to mark the produce as ready.",
      };
    }

    // Buyer confirms pickup
    if (!tasks.buyer?.pickupConfirmed) {
      return {
        type: "action",
        title: "Confirm Pickup",
        message:
          "Confirm that you are ready to arrange pickup for this produce.",
        action: "pickup",
      };
    }

    // Schedule pickup
    if (!tasks.logistics?.pickupScheduled) {
      return {
        type: "action",
        title: "Schedule Pickup",
        message:
          "Both parties are ready. Schedule the pickup.",
        action: "schedule",
      };
    }

    // Complete pickup
    if (!tasks.logistics?.pickupCompleted) {
      return {
        type: "action",
        title: "Complete Pickup",
        message:
          "Confirm once the produce has been collected.",
        action: "pickupComplete",
      };
    }

    // Complete delivery
    if (!tasks.logistics?.deliveryCompleted) {
      return {
        type: "action",
        title: "Complete Delivery",
        message:
          "Confirm once the produce has reached the buyer.",
        action: "deliveryComplete",
      };
    }

    // Payment
    if (!tasks.payment?.completed) {
      return {
        type: "action",
        title: "Complete Payment",
        message:
          "Delivery is complete. Complete the payment to close the deal.",
        action: "payment",
      };
    }

    return {
      type: "completed",
      title: "Deal Completed",
      message:
        "All coordination steps have been completed successfully.",
    };
  };

const handleSchedulePickup = async (deal) => {
  if (!pickupDate || !pickupTime) {
    alert("Please select pickup date and time.");
    return;
  }

  try {
    setScheduling(true);

    await api.patch(
      `/deals/${deal._id}/pickup/schedule`,
      {
        pickupDate,
        pickupTime,
      }
    );

    alert("Pickup scheduled successfully.");

    setPickupDate("");
    setPickupTime("");

    await fetchDeals();
  } catch (error) {
    console.error("Schedule pickup error:", error);

    alert(
      error.response?.data?.message ||
        "Unable to schedule pickup."
    );
  } finally {
    setScheduling(false);
  }
};


  // -----------------------------------------
  // HANDLE BUYER ACTION
  // -----------------------------------------
  const handleDealAction = async (deal, action) => {
    try {
      let endpoint = "";

      switch (action) {
        case "pickup":
          endpoint = `/deals/${deal._id}/tasks/buyer/pickup`;
          break;

        case "pickupComplete":
          endpoint = `/deals/${deal._id}/pickup/complete`;
          break;

        case "deliveryComplete":
          endpoint = `/deals/${deal._id}/delivery/complete`;
          break;

        case "payment":
          endpoint = `/deals/${deal._id}/payment/complete`;
          break;

        default:
          return;
      }

      await api.patch(endpoint);

      await fetchDeals();
    } catch (error) {
      console.error("Deal action error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update the deal."
      );
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------
  if (loading) {
    return (
      <div className="buyer-deals-layout">
        <BuyerSidebar />

        <main className="buyer-deals-main">
          <div className="deals-loading">
            Loading deals...
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------------------
  // PAGE
  // -----------------------------------------
  return (
    <div className="buyer-deals-layout">

      {/* SIDEBAR */}
      <BuyerSidebar />

      {/* MAIN CONTENT */}
      <main className="buyer-deals-main">

        {/* HEADER */}
        <div className="buyer-deals-header">
          <h1>My Deals</h1>

          <p>
            Manage your active deals and coordinate every
            step with farmers.
          </p>
        </div>

        {/* NO DEALS */}
        {deals.length === 0 ? (
          <div className="no-deals">
            <h2>No Deals Yet</h2>

            <p>
              Your accepted farmer matches will appear here
              as coordinated deals.
            </p>
          </div>
        ) : (

          /* DEAL LIST */
          <div className="buyer-deals-list">

            {deals.map((deal) => {

              const nextAction = getNextAction(deal);

              return (
                <div
                  className="buyer-deal-card"
                  key={deal._id}
                >

                  {/* ============================== */}
                  {/* DEAL HEADER */}
                  {/* ============================== */}

                  <div className="buyer-deal-top">

                    <div className="deal-title-row">

                      <div>
                        <h2>
                          {deal.cropName}
                        </h2>

                        <span className="deal-id">
                          Deal ID: {deal._id.slice(-6)}
                        </span>
                      </div>

                    </div>

                    <span
                      className={`deal-status ${
                        deal.status === "completed"
                          ? "status-completed"
                          : deal.status === "cancelled"
                          ? "status-cancelled"
                          : deal.status === "pending"
                          ? "status-pending"
                          : "status-progress"
                      }`}
                    >
                      {deal.status.replaceAll("_", " ")}
                    </span>

                  </div>

                  {/* ============================== */}
                  {/* BASIC DETAILS */}
                  {/* ============================== */}

                  <div className="buyer-basic-details">

                    <div className="detail-item">
                      <div>
                        <span>Quantity</span>

                        <strong>
                          {deal.quantity} quintals
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div>
                        <span>Agreed Price</span>

                        <strong>
                          ₹{deal.agreedPrice}/quintal
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div>
                        <span>Total Amount</span>

                        <strong>
                          ₹{deal.totalAmount?.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div>
                        <span>Crop</span>

                        <strong>
                          {deal.cropName}
                        </strong>
                      </div>
                    </div>

                  </div>

                  {/* ============================== */}
                  {/* ACTION REQUIRED */}
                  {/* ============================== */}

                  <div
                    className={`action-required ${nextAction.type}`}
                  >

                    <div className="action-required-icon">
                      {nextAction.type === "completed"
                        ? "✓"
                        : nextAction.type === "waiting"
                        ? "⏳"
                        : "!"}
                    </div>

                    <div className="action-required-content">

                      <span className="action-required-label">
                        {nextAction.type === "action"
                          ? "ACTION REQUIRED"
                          : nextAction.type === "waiting"
                          ? "WAITING"
                          : "DEAL STATUS"}
                      </span>

                      <h3>
                        {nextAction.title}
                      </h3>

                      <p>
                        {nextAction.message}
                      </p>

{nextAction.action === "schedule" && (
  <div className="pickup-schedule-form">

    <div className="schedule-field">
      <label>Pickup Date</label>

      <input
        type="date"
        value={pickupDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) =>
          setPickupDate(e.target.value)
        }
      />
    </div>

    <div className="schedule-field">
      <label>Pickup Time</label>

      <input
        type="time"
        value={pickupTime}
        onChange={(e) =>
          setPickupTime(e.target.value)
        }
      />
    </div>

    <button
      className="deal-action-button"
      onClick={() =>
        handleSchedulePickup(deal)
      }
      disabled={scheduling}
    >
      {scheduling
        ? "Scheduling..."
        : "Schedule Pickup"}
    </button>

  </div>
)}

                      {/* SCHEDULE PLACEHOLDER */}
                      {nextAction.action === "schedule" && (

                        <button
                          className="deal-action-button"
                          onClick={() =>
                            alert(
                              "Pickup scheduling will be added next."
                            )
                          }
                        >
                          Schedule Pickup
                        </button>

                      )}

                    </div>

                  </div>

                  {/* ============================== */}
                  {/* COORDINATION PROGRESS */}
                  {/* ============================== */}

                  <div className="coordination-section">

                    <div className="section-heading">

                      <h3>
                        Coordination Progress
                      </h3>

                      <span>
                        7 steps
                      </span>

                    </div>

                    <div className="coordination-timeline">

                      {/* STEP 1 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.farmer?.quantityConfirmed
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Quantity
                            <br />
                            confirmed
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.farmer
                              ?.quantityConfirmed
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 2 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.farmer?.produceReady
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Produce
                            <br />
                            ready
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.farmer?.produceReady
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 3 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.buyer?.pickupConfirmed
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Pickup
                            <br />
                            confirmed
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.buyer?.pickupConfirmed
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 4 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.logistics?.pickupScheduled
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Pickup
                            <br />
                            scheduled
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.logistics
                              ?.pickupScheduled
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 5 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.logistics?.pickupCompleted
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Produce
                            <br />
                            picked up
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.logistics
                              ?.pickupCompleted
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 6 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.logistics?.deliveryCompleted
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Delivery
                            <br />
                            completed
                          </span>
                        </div>

                        <div
                          className={`step-line ${
                            deal.tasks?.logistics
                              ?.deliveryCompleted
                              ? "completed"
                              : ""
                          }`}
                        />

                      </div>

                      {/* STEP 7 */}
                      <div className="coordination-step">

                        <div className="step-icon">
                          {deal.tasks?.payment?.completed
                            ? "✓"
                            : "○"}
                        </div>

                        <div className="step-content">
                          <span>
                            Payment
                            <br />
                            completed
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ============================== */}
                  {/* LOGISTICS */}
                  {/* ============================== */}

                  <div className="logistics-section">

                    <div className="section-heading">

                      <h3>
                        Logistics
                      </h3>

                    </div>

                    <div className="logistics-grid">

                      <div>
                        <span>
                          Distance
                        </span>

                        <strong>
                          {deal.transport?.distanceKm
                            ? `${deal.transport.distanceKm} km`
                            : "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Vehicles
                        </span>

                        <strong>
                          {deal.transport?.vehicleCount ||
                            "Not assigned"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Estimated Cost
                        </span>

                        <strong>
                          {deal.transport?.estimatedCost
                            ? `₹${deal.transport.estimatedCost.toLocaleString(
                                "en-IN"
                              )}`
                            : "Not available"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Pickup Status
                        </span>

                        <strong>
                          {deal.transport?.status
                            ?.replaceAll("_", " ") ||
                            "Not scheduled"}
                        </strong>
                      </div>

                    </div>

                    {/* ROUTE */}
                    <div className="route-info">
                      <span>
                        📍
                      </span>

                      <strong>
                        Pickup:
                      </strong>

                      <span>
                        {deal.farmerListingId
                          ?.sellingLocation ||
                          "Farmer location"}
                      </span>

                      <span>
                        →
                      </span>

                      <strong>
                        Delivery:
                      </strong>

                      <span>
                        {deal.buyerRequirementId
                          ?.location ||
                          "Buyer location"}
                      </span>
                    </div>

                  </div>

                  {/* ============================== */}
                  {/* FOOTER */}
                  {/* ============================== */}

                  <div className="deal-footer">
                    Created{" "}
                    {deal.createdAt
                      ? new Date(
                          deal.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Recently"}
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
};

export default BuyerDeals;
