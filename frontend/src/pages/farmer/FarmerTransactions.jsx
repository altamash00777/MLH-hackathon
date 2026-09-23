import React, { useState } from "react";
import "./FarmerTransactions.css";
import Sidebar from "../../components/Sidebar";

const mockTransactions = [
  {
    id: "TXN-2026-001",
    crop: "Rice",
    variety: "Basmati",
    quantity: 450,
    price: 3365,
    total: 1514250,
    buyer: "Sharma Agro Traders",
    location: "Kanpur",
    pickupDate: "28 Sep 2026",
    status: "In Transit",
    payment: "Pending",
    progress: 65,
  },
  {
    id: "TXN-2026-002",
    crop: "Wheat",
    variety: "Lokwan",
    quantity: 180,
    price: 2420,
    total: 435600,
    buyer: "GreenField Foods",
    location: "Lucknow",
    pickupDate: "30 Sep 2026",
    status: "Pickup Scheduled",
    payment: "Pending",
    progress: 45,
  },
  {
    id: "TXN-2026-003",
    crop: "Potato",
    variety: "Jyoti",
    quantity: 120,
    price: 1850,
    total: 222000,
    buyer: "FreshKart Wholesale",
    location: "Agra",
    pickupDate: "20 Sep 2026",
    status: "Completed",
    payment: "Paid",
    progress: 100,
  },
  {
    id: "TXN-2026-004",
    crop: "Mustard",
    variety: "Yellow Mustard",
    quantity: 75,
    price: 6100,
    total: 457500,
    buyer: "UP Agro Industries",
    location: "Unnao",
    pickupDate: "02 Oct 2026",
    status: "Deal Confirmed",
    payment: "Pending",
    progress: 25,
  },
];

const FarmerTransactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const totalValue = mockTransactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0
  );

  const getStatusClass = (status) => {
    if (status === "In Transit") return "status-in-transit";
    if (status === "Pickup Scheduled") return "status-pickup";
    if (status === "Completed") return "status-completed";
    if (status === "Deal Confirmed") return "status-confirmed";

    return "status-pending";
  };

  const getCropIcon = (crop) => {
    const icons = {
      Rice: "🌾",
      Wheat: "🌾",
      Potato: "🥔",
      Mustard: "🌱",
    };

    return icons[crop] || "🌱";
  };

  return (
    <>
      <Sidebar />

      <main className="transaction-page">

        {/* HEADER */}
        <header className="transaction-header">
          <div>
            <small>FARMER TRANSACTIONS</small>

            <h1>My Transactions</h1>

            <p>
              Track your deals, pickup coordination and payment status.
            </p>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="transaction-summary">

          <div className="summary-card">
            <div className="summary-icon">📋</div>

            <div className="summary-label">
              Total Deals
            </div>

            <div className="summary-value">
              {mockTransactions.length}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">₹</div>

            <div className="summary-label">
              Total Transaction Value
            </div>

            <div className="summary-value">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
          </div>

        </section>

        {/* TRANSACTIONS */}
        <section className="transaction-section">

          <div className="transaction-section-header">
            <h2>Recent Transactions</h2>

            <span>
              {mockTransactions.length} transactions
            </span>
          </div>

          <div className="transaction-list">

            {mockTransactions.map((transaction) => (

              <article
                className="transaction-card"
                key={transaction.id}
              >

                {/* CARD TOP */}
                <div className="transaction-card-top">

                  <div className="crop-info">

                    <div className="crop-icon">
                      {getCropIcon(transaction.crop)}
                    </div>

                    <div>
                      <h3>{transaction.crop}</h3>

                      <p>
                        {transaction.variety}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`transaction-status ${getStatusClass(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>

                </div>

                {/* ID */}
                <div className="transaction-id">
                  <span>Transaction ID</span>

                  <span>
                    {transaction.id}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="transaction-details">

                  <div className="detail-item">
                    <span className="detail-label">
                      Quantity
                    </span>

                    <span className="detail-value">
                      {transaction.quantity} quintals
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      Price
                    </span>

                    <span className="detail-value">
                      ₹{transaction.price.toLocaleString("en-IN")}/q
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      Buyer
                    </span>

                    <span className="detail-value">
                      {transaction.buyer}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      Location
                    </span>

                    <span className="detail-value">
                      {transaction.location}
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      Pickup Date
                    </span>

                    <span className="detail-value">
                      {transaction.pickupDate}
                    </span>
                  </div>

                </div>

                {/* TOTAL */}
                <div className="transaction-total">

                  <span>
                    Total Amount
                  </span>

                  <span>
                    ₹{transaction.total.toLocaleString("en-IN")}
                  </span>

                </div>

                {/* PROGRESS */}
                <div className="coordination-box">

                  <div className="coordination-title">

                    <span>
                      Coordination Progress
                    </span>

                    <span>
                      {transaction.progress}%
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${transaction.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* PAYMENT */}
                <div className="payment-row">

                  <span className="payment-label">
                    Payment
                  </span>

                  <span
                    className={`payment-status ${
                      transaction.payment === "Paid"
                        ? "payment-paid"
                        : "payment-pending"
                    }`}
                  >
                    {transaction.payment}
                  </span>

                </div>

                {/* BUTTON */}
                <div className="transaction-actions">

                  <button
                    className="view-details-btn"
                    onClick={() =>
                      setSelectedTransaction(transaction)
                    }
                  >
                    View Transaction Details
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>

      </main>

      {/* MODAL */}
      {selectedTransaction && (

        <div
          className="transaction-modal-overlay"
          onClick={() => setSelectedTransaction(null)}
        >

          <div
            className="transaction-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>
                  {selectedTransaction.crop} Transaction
                </h2>

                <p>
                  {selectedTransaction.id}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedTransaction(null)}
              >
                ×
              </button>

            </div>

            <div className="modal-section">

              <h3>Transaction Details</h3>

              <div className="modal-info-grid">

                <div className="modal-info-item">
                  <small>Crop</small>
                  <strong>
                    {selectedTransaction.crop}
                  </strong>
                </div>

                <div className="modal-info-item">
                  <small>Quantity</small>
                  <strong>
                    {selectedTransaction.quantity} quintals
                  </strong>
                </div>

                <div className="modal-info-item">
                  <small>Agreed Price</small>
                  <strong>
                    ₹{selectedTransaction.price.toLocaleString("en-IN")}/q
                  </strong>
                </div>

                <div className="modal-info-item">
                  <small>Total Amount</small>
                  <strong>
                    ₹{selectedTransaction.total.toLocaleString("en-IN")}
                  </strong>
                </div>

              </div>

            </div>

            <div className="modal-section">

              <h3>Buyer Information</h3>

              <div className="modal-info-grid">

                <div className="modal-info-item">
                  <small>Buyer</small>
                  <strong>
                    {selectedTransaction.buyer}
                  </strong>
                </div>

                <div className="modal-info-item">
                  <small>Location</small>
                  <strong>
                    {selectedTransaction.location}
                  </strong>
                </div>

              </div>

            </div>

            <div className="modal-section">

              <h3>Coordination Timeline</h3>

              <div className="transaction-timeline">

                <div className="timeline-item">
                  <strong>Deal Confirmed</strong>
                  <span>
                    Transaction successfully created
                  </span>
                </div>

                <div
                  className={
                    selectedTransaction.progress >= 45
                      ? "timeline-item"
                      : "timeline-item pending"
                  }
                >
                  <strong>Pickup Scheduled</strong>
                  <span>
                    Pickup: {selectedTransaction.pickupDate}
                  </span>
                </div>

                <div
                  className={
                    selectedTransaction.progress >= 65
                      ? "timeline-item"
                      : "timeline-item pending"
                  }
                >
                  <strong>Produce In Transit</strong>
                  <span>
                    Produce movement coordinated
                  </span>
                </div>

                <div
                  className={
                    selectedTransaction.progress >= 100
                      ? "timeline-item"
                      : "timeline-item pending"
                  }
                >
                  <strong>Payment Completed</strong>
                  <span>
                    {selectedTransaction.payment === "Paid"
                      ? "Payment received"
                      : "Payment pending"}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default FarmerTransactions;