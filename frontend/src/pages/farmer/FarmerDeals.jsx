import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  User,
  IndianRupee,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Circle
} from "lucide-react";

import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import "./FarmerDeals.css";

function FarmerDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deals");

      setDeals(response.data.deals || []);
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError(
        err.response?.data?.message || "Failed to load your deals."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pending",
      confirmed: "Confirmed",
      pickup_scheduled: "Pickup Scheduled",
      in_transit: "In Transit",
      delivered: "Delivered",
      payment_pending: "Payment Pending",
      completed: "Completed",
      cancelled: "Cancelled"
    };

    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    return `deal-status ${status?.replaceAll("_", "-")}`;
  };

  const getOtherParty = (deal) => {
    if (role === "farmer") {
      return deal.buyerId;
    }

    return deal.farmerId;
  };

  const getOtherPartyName = (deal) => {
    const person = getOtherParty(deal);

    return (
      person?.name ||
      person?.fullName ||
      person?.email ||
      "Other Party"
    );
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main deals-page">
          <div className="deals-loading">
            <div className="loading-spinner"></div>
            <p>Loading your deals...</p>
          </div>
        </main>
      </div>
    );
  }

const getNextAction = (deal) => {
  const tasks = deal.tasks || {};

  // Deal completed
  if (deal.status === "completed") {
    return {
      type: "completed",
      title: "Deal Completed",
      message:
        "All coordination steps have been completed successfully."
    };
  }

  // Farmer responsibilities
  if (role === "farmer") {
    if (!tasks.farmer?.quantityConfirmed) {
      return {
        type: "action",
        title: "Confirm Quantity",
        message: `Please confirm the agreed quantity of ${deal.quantity} quintals.`,
        action: "quantity"
      };
    }

    if (!tasks.farmer?.produceReady) {
      return {
        type: "action",
        title: "Mark Produce Ready",
        message:
          "Confirm that the produce is ready for the buyer's pickup.",
        action: "ready"
      };
    }

    if (!tasks.buyer?.pickupConfirmed) {
      return {
        type: "waiting",
        title: "Waiting for Buyer",
        message:
          "The buyer needs to confirm pickup before logistics can be scheduled."
      };
    }
  }

  // Buyer responsibilities
  if (role === "buyer") {
    if (!tasks.buyer?.pickupConfirmed) {
      return {
        type: "action",
        title: "Confirm Pickup",
        message:
          "Confirm that you are ready to arrange pickup for this produce.",
        action: "pickup"
      };
    }

    if (!tasks.farmer?.produceReady) {
      return {
        type: "waiting",
        title: "Waiting for Farmer",
        message:
          "The farmer needs to mark the produce as ready before pickup can be scheduled."
      };
    }
  }

  // Shared logistics responsibility
  if (!tasks.logistics?.pickupScheduled) {
    return {
      type: "action",
      title: "Schedule Pickup",
      message:
        "Both parties have completed their preparation. Pickup can now be scheduled.",
      action: "schedule"
    };
  }

  if (!tasks.logistics?.pickupCompleted) {
    return {
      type: "action",
      title: "Complete Pickup",
      message:
        "The pickup is scheduled. Confirm once the produce has been collected.",
      action: "pickupComplete"
    };
  }

  if (!tasks.logistics?.deliveryCompleted) {
    return {
      type: "action",
      title: "Complete Delivery",
      message:
        "The produce has been picked up. Confirm once it reaches the buyer.",
      action: "deliveryComplete"
    };
  }

  if (!tasks.payment?.completed) {
    return {
      type: "action",
      title: "Complete Payment",
      message:
        "Delivery is complete. Record the final payment to close the deal.",
      action: "payment"
    };
  }

  return {
    type: "completed",
    title: "Deal Completed",
    message:
      "All coordination steps have been completed successfully."
  };
};


const handleDealAction = async (deal, action) => {
  try {
    let endpoint = "";
    let body = undefined;

    switch (action) {
      case "quantity":
        endpoint = `/deals/${deal._id}/tasks/farmer/quantity`;
        break;

      case "ready":
        endpoint = `/deals/${deal._id}/tasks/farmer/ready`;
        break;

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

    await api.patch(endpoint, body);

    await fetchDeals();

  } catch (err) {
    console.error("Deal action error:", err);

    alert(
      err.response?.data?.message ||
      "Unable to update the deal."
    );
  }
};



  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main deals-page">

        {/* HEADER */}
        <div className="deals-header">
          <div>
            <span className="deals-eyebrow">
              COORDINATION HUB
            </span>

            <h1>My Deals</h1>

            <p>
              Coordinate produce, pickup, delivery and payment
              from one place.
            </p>
          </div>

          <div className="deal-count">
            <Package size={20} />
            <span>{deals.length} Deals</span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="deals-error">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && deals.length === 0 && (
          <div className="empty-deals">
            <div className="empty-icon">
              <Package size={42} />
            </div>

            <h2>No deals yet</h2>

            <p>
              When a match is accepted, your coordinated deal
              will appear here.
            </p>
          </div>
        )}

        {/* DEALS */}
        <div className="deals-list">

          {deals.map((deal) => {
            const otherParty = getOtherPartyName(deal);
const nextAction = getNextAction(deal);
            return (
              <motion.div
                className="deal-card"
                key={deal._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >

                {/* TOP */}
                <div className="deal-card-top">

                  <div className="deal-crop">

                    <div className="crop-icon">
                      <Package size={24} />
                    </div>

                    <div>
                      <h2>{deal.cropName}</h2>

                      <span>
                        Deal #{deal._id.slice(-6)}
                      </span>
                    </div>

                  </div>

                  <span className={getStatusClass(deal.status)}>
                    {getStatusLabel(deal.status)}
                  </span>

                </div>

{/* ACTION REQUIRED */}
<div className={`action-required ${nextAction.type}`}>

  <div className="action-required-icon">
    {nextAction.type === "completed" ? "✓" : "!"}
  </div>

  <div className="action-required-content">
    <span className="action-required-label">
      {nextAction.type === "action"
        ? "ACTION REQUIRED"
        : nextAction.type === "waiting"
        ? "WAITING"
        : "DEAL STATUS"}
    </span>

    <h3>{nextAction.title}</h3>

    <p>{nextAction.message}</p>

{nextAction.type === "action" && nextAction.action && (
  <button
    className="deal-action-button"
    onClick={() =>
      handleDealAction(deal, nextAction.action)
    }
  >
    {nextAction.title}
  </button>
)}

  </div>

</div>

                {/* BASIC DETAILS */}
                <div className="deal-details">

                  <div className="detail-item">
                    <Package size={18} />

                    <div>
                      <span>Quantity</span>
                      <strong>
                        {deal.quantity} quintals
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <IndianRupee size={18} />

                    <div>
                      <span>Agreed Price</span>
                      <strong>
                        ₹{deal.agreedPrice?.toLocaleString("en-IN")}
                        /quintal
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <IndianRupee size={18} />

                    <div>
                      <span>Total Value</span>
                      <strong>
                        ₹{deal.totalAmount?.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <User size={18} />

                    <div>
                      <span>
                        {role === "farmer"
                          ? "Buyer"
                          : "Farmer"}
                      </span>

                      <strong>
                        {otherParty}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* COORDINATION SECTION */}
                <div className="coordination-section">

                  <div className="section-title">
                    <h3>Coordination Progress</h3>

                    <span>
                      Complete each step to finish the deal
                    </span>
                  </div>

                  <div className="deal-timeline">

                    {/* STEP 1 */}
                    <div
                      className={
                        deal.tasks?.farmer?.quantityConfirmed
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.farmer?.quantityConfirmed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Quantity Confirmed</strong>

                        <span>
                          Farmer confirms the agreed quantity
                        </span>
                      </div>
                    </div>

                    {/* STEP 2 */}
                    <div
                      className={
                        deal.tasks?.farmer?.produceReady
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.farmer?.produceReady ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Produce Ready</strong>

                        <span>
                          Produce is ready for pickup
                        </span>
                      </div>
                    </div>

                    {/* STEP 3 */}
                    <div
                      className={
                        deal.tasks?.buyer?.pickupConfirmed
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.buyer?.pickupConfirmed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Pickup Confirmed</strong>

                        <span>
                          Buyer confirms pickup
                        </span>
                      </div>
                    </div>

                    {/* STEP 4 */}
                    <div
                      className={
                        deal.tasks?.logistics?.pickupScheduled
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.logistics?.pickupScheduled ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Pickup Scheduled</strong>

                        <span>
                          {deal.transport?.pickupDate
                            ? `${formatDate(
                                deal.transport.pickupDate
                              )} at ${
                                deal.transport.pickupTime || "--"
                              }`
                            : "Pickup date not scheduled"}
                        </span>
                      </div>
                    </div>

                    {/* STEP 5 */}
                    <div
                      className={
                        deal.tasks?.logistics?.pickupCompleted
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.logistics?.pickupCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Pickup Completed</strong>

                        <span>
                          Produce collected from farmer
                        </span>
                      </div>
                    </div>

                    {/* STEP 6 */}
                    <div
                      className={
                        deal.tasks?.logistics?.deliveryCompleted
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.logistics?.deliveryCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Delivery Completed</strong>

                        <span>
                          Produce delivered to buyer
                        </span>
                      </div>
                    </div>

                    {/* STEP 7 */}
                    <div
                      className={
                        deal.tasks?.payment?.completed
                          ? "timeline-step completed"
                          : "timeline-step"
                      }
                    >
                      <div className="timeline-icon">
                        {deal.tasks?.payment?.completed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </div>

                      <div>
                        <strong>Payment Completed</strong>

                        <span>
                          Final payment recorded
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* LOGISTICS */}
                <div className="logistics-box">

                  <div className="logistics-header">
                    <Truck size={20} />
                    <h3>Logistics</h3>
                  </div>

                  <div className="logistics-grid">

                    <div>
                      <span>Distance</span>
                      <strong>
                        {deal.transport?.distanceKm || 0} km
                      </strong>
                    </div>

                    <div>
                      <span>Vehicles</span>
                      <strong>
                        {deal.transport?.vehicleCount || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Estimated Cost</span>
                      <strong>
                        ₹
                        {deal.transport?.estimatedCost?.toLocaleString(
                          "en-IN"
                        ) || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Pickup</span>
                      <strong>
                        {deal.transport?.pickupDate
                          ? formatDate(
                              deal.transport.pickupDate
                            )
                          : "Not scheduled"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* FOOTER */}
                <div className="deal-footer">

                  <div className="deal-route">
                    <MapPin size={17} />

                    <span>
                      {deal.farmerListingId?.sellingLocation ||
                        "Farmer location"}
                    </span>

                    <ArrowRight size={16} />

                    <span>
                      {deal.buyerRequirementId?.location ||
                        "Buyer location"}
                    </span>
                  </div>

                  <div className="deal-created">
                    <Calendar size={15} />

                    Created {formatDate(deal.createdAt)}
                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

      </main>
    </div>
  );
}

export default FarmerDeals;