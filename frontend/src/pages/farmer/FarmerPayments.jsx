import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./FarmerPayments.css";

const mockPayments = [
  {
    id: "PAY-2026-001",
    transactionId: "TXN-2026-001",
    crop: "Rice",
    variety: "Basmati",
    quantity: 450,
    price: 3365,
    amount: 1514250,
    buyer: "Sharma Agro Traders",
    location: "Kanpur",
    paymentMethod: "Bank Transfer",
    paymentDate: null,
    status: "Pending",
    dueDate: "28 Sep 2026",
    deliveryStatus: "In Transit",
  },
  {
    id: "PAY-2026-002",
    transactionId: "TXN-2026-002",
    crop: "Wheat",
    variety: "Lokwan",
    quantity: 180,
    price: 2420,
    amount: 435600,
    buyer: "GreenField Foods",
    location: "Lucknow",
    paymentMethod: "UPI",
    paymentDate: null,
    status: "Pending",
    dueDate: "30 Sep 2026",
    deliveryStatus: "Pickup Scheduled",
  },
  {
    id: "PAY-2026-003",
    transactionId: "TXN-2026-003",
    crop: "Potato",
    variety: "Jyoti",
    quantity: 120,
    price: 1850,
    amount: 222000,
    buyer: "FreshKart Wholesale",
    location: "Agra",
    paymentMethod: "Bank Transfer",
    paymentDate: "20 Sep 2026",
    status: "Paid",
    dueDate: "20 Sep 2026",
    deliveryStatus: "Delivered",
  },
  {
    id: "PAY-2026-004",
    transactionId: "TXN-2026-004",
    crop: "Mustard",
    variety: "Yellow Mustard",
    quantity: 75,
    price: 6100,
    amount: 457500,
    buyer: "UP Agro Industries",
    location: "Unnao",
    paymentMethod: "UPI",
    paymentDate: null,
    status: "Pending",
    dueDate: "02 Oct 2026",
    deliveryStatus: "Deal Confirmed",
  },
];

const FarmerPayments = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filter, setFilter] = useState("All");

  const totalAmount = mockPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const paidAmount = mockPayments
    .filter((payment) => payment.status === "Paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingAmount = mockPayments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const filteredPayments =
    filter === "All"
      ? mockPayments
      : mockPayments.filter((payment) => payment.status === filter);

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Sidebar />

      <main className="payment-page">
        {/* Header */}
        <div className="payment-header">
          <div>
            <p className="payment-eyebrow">FINANCIAL OVERVIEW</p>

            <h1>Payments</h1>

            <p>
              Track your crop sale payments, payment status and settlement
              details.
            </p>
          </div>

          <div className="payment-header-icon">💳</div>
        </div>

        {/* Summary */}
        <section className="payment-summary">
          <div className="summary-card">
            <div className="summary-icon total-icon">₹</div>

            <div>
              <span>Total Amount</span>
              <strong>{formatAmount(totalAmount)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon paid-icon">✓</div>

            <div>
              <span>Paid Amount</span>
              <strong>{formatAmount(paidAmount)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon pending-icon">◷</div>

            <div>
              <span>Pending Amount</span>
              <strong>{formatAmount(pendingAmount)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon count-icon">#</div>

            <div>
              <span>Total Payments</span>
              <strong>{mockPayments.length}</strong>
            </div>
          </div>
        </section>

        {/* Payment Table Section */}
        <section className="payment-section">
          <div className="section-top">
            <div>
              <h2>Payment Records</h2>
              <p>View and track all your crop sale payments.</p>
            </div>

            <div className="payment-filter">
              <button
                className={filter === "All" ? "filter-active" : ""}
                onClick={() => setFilter("All")}
              >
                All
              </button>

              <button
                className={filter === "Pending" ? "filter-active" : ""}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>

              <button
                className={filter === "Paid" ? "filter-active" : ""}
                onClick={() => setFilter("Paid")}
              >
                Paid
              </button>
            </div>
          </div>

          <div className="payment-table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Transaction</th>
                  <th>Crop</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <span className="payment-id">{payment.id}</span>
                    </td>

                    <td>
                      <span className="transaction-id">
                        {payment.transactionId}
                      </span>
                    </td>

                    <td>
                      <div className="crop-cell">
                        <strong>{payment.crop}</strong>
                        <span>{payment.variety}</span>
                      </div>
                    </td>

                    <td>
                      <div className="buyer-cell">
                        <strong>{payment.buyer}</strong>
                        <span>{payment.location}</span>
                      </div>
                    </td>

                    <td>
                      <strong className="amount">
                        {formatAmount(payment.amount)}
                      </strong>
                    </td>

                    <td>
                      <span className="method">
                        {payment.paymentMethod}
                      </span>
                    </td>

                    <td>
                      <span className="due-date">
                        {payment.dueDate}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          payment.status === "Paid"
                            ? "status-paid"
                            : "status-pending"
                        }`}
                      >
                        <span className="status-dot"></span>
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="empty-payment">
                <div>💳</div>
                <h3>No payments found</h3>
                <p>There are no payments matching this filter.</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {selectedPayment && (
          <div
            className="payment-modal-overlay"
            onClick={() => setSelectedPayment(null)}
          >
            <div
              className="payment-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <p>PAYMENT DETAILS</p>
                  <h2>{selectedPayment.id}</h2>
                </div>

                <button
                  className="modal-close"
                  onClick={() => setSelectedPayment(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-status-row">
                <span
                  className={`status ${
                    selectedPayment.status === "Paid"
                      ? "status-paid"
                      : "status-pending"
                  }`}
                >
                  <span className="status-dot"></span>
                  {selectedPayment.status}
                </span>

                <strong className="modal-amount">
                  {formatAmount(selectedPayment.amount)}
                </strong>
              </div>

              <div className="modal-grid">
                <div className="detail-item">
                  <span>Transaction ID</span>
                  <strong>{selectedPayment.transactionId}</strong>
                </div>

                <div className="detail-item">
                  <span>Crop</span>
                  <strong>
                    {selectedPayment.crop} - {selectedPayment.variety}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Quantity</span>
                  <strong>{selectedPayment.quantity} Quintals</strong>
                </div>

                <div className="detail-item">
                  <span>Price / Quintal</span>
                  <strong>{formatAmount(selectedPayment.price)}</strong>
                </div>

                <div className="detail-item">
                  <span>Buyer</span>
                  <strong>{selectedPayment.buyer}</strong>
                </div>

                <div className="detail-item">
                  <span>Location</span>
                  <strong>{selectedPayment.location}</strong>
                </div>

                <div className="detail-item">
                  <span>Payment Method</span>
                  <strong>{selectedPayment.paymentMethod}</strong>
                </div>

                <div className="detail-item">
                  <span>Due Date</span>
                  <strong>{selectedPayment.dueDate}</strong>
                </div>

                <div className="detail-item">
                  <span>Delivery Status</span>
                  <strong>{selectedPayment.deliveryStatus}</strong>
                </div>

                <div className="detail-item">
                  <span>Payment Date</span>
                  <strong>
                    {selectedPayment.paymentDate || "Not paid yet"}
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="close-details-button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default FarmerPayments;