import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "./FarmerNotification.css"

function FarmerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected notification for buyer details
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  // ================================
  // Fetch Farmer Notifications
  // ================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        response.data.notifications || []
      );

    } catch (error) {
      console.error(
        "Fetch Notifications Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load notifications"
      );

    } finally {
      setLoading(false);
    }
  };


  // ================================
  // Mark Notification As Read
  // ================================

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI immediately
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

    } catch (error) {
      console.error(
        "Mark Notification Read Error:",
        error
      );
    }
  };


  // ================================
  // Open Notification
  // ================================

  const handleNotificationClick = async (
    notification
  ) => {

    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Open buyer details
    setSelectedNotification(notification);
  };


  // ================================
  // Load Notifications
  // ================================

  useEffect(() => {
    fetchNotifications();
  }, []);


  // ================================
  // Count Unread Notifications
  // ================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;


  return (
    <div className="dashboard-layout">

      {/* =========================
          SIDEBAR
      ========================== */}

      <Sidebar />


      <main className="dashboard-main">

        {/* =========================
            HEADER
        ========================== */}

        <div className="page-headerN">

          <div>

            <h1>Notifications</h1>

            <p>
              Stay updated about your buyer connections
            </p>

          </div>

        </div>


        {/* =========================
            UNREAD COUNT
        ========================== */}

        {!loading &&
          !error &&
          notifications.length > 0 && (

          <div className="notification-summary">

            🔔 You have{" "}
            <strong>{unreadCount}</strong>{" "}
            unread notification
            {unreadCount !== 1 ? "s" : ""}.

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
              Loading notifications...
            </h3>

            <p>
              Please wait.
            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================== */}

        {!loading &&
          error && (

          <div className="empty-state">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>
              Unable to load notifications
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchNotifications}
            >
              Try Again
            </button>

          </div>

        )}


        {/* =========================
            NO NOTIFICATIONS
        ========================== */}

        {!loading &&
          !error &&
          notifications.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">
              🔔
            </div>

            <h3>
              No notifications
            </h3>

            <p>
              You don't have any notifications yet.
            </p>

          </div>

        )}


        {/* =========================
            NOTIFICATIONS
        ========================== */}

        {!loading &&
          !error &&
          notifications.length > 0 && (

          <div className="notifications-list">

            {notifications.map(
              (notification) => {

                const buyer =
                  notification.senderId;

                const match =
                  notification.matchId;

                const crop =
                  match?.farmerListingId;

                return (

                  <div
                    key={notification._id}
                    className={
                      notification.isRead
                        ? "notification-card-read"
                        : "notification-card unread"
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    {/* =================
                        ICON
                    ================== */}

                    <div className="notification-icon">

                      🤝

                    </div>


                    {/* =================
                        CONTENT
                    ================== */}

                    <div className="notification-content">

                      <div className="notification-header">

                        <h3>
                          {notification.title}
                        </h3>

                        {!notification.isRead && (

                          <span className="unread-badge">
                            New
                          </span>

                        )}

                      </div>


                      <p className="notification-message">

                        {notification.message}

                      </p>


                      {/* Crop information */}

                      {crop && (

                        <div className="notification-crop">

                          🌾{" "}
                          <strong>
                            {crop.cropName || "Crop"}
                          </strong>

                          {match?.matchScore !==
                            undefined && (

                            <span>
                              {" "}
                              •{" "}
                              {match.matchScore}%
                              Match
                            </span>

                          )}

                        </div>

                      )}


                      {/* Time */}

                      <span className="notification-time">

                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}

                      </span>

                    </div>


                    {/* =================
                        ARROW
                    ================== */}

                    <div className="notification-arrow">

                      →

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}


      </main>


      {/* =================================
          BUYER DETAILS MODAL
      ================================== */}

      {selectedNotification && (

        <div
          className="buyer-modal-overlay"
          onClick={() =>
            setSelectedNotification(null)
          }
        >

          <div
            className="buyer-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =========================
                MODAL HEADER
            ========================== */}

            <div className="buyer-modal-header">

              <div>

                <h2>
                  Buyer Information
                </h2>

                <p>
                  Connection accepted
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                ×
              </button>

            </div>


            {/* =========================
                BUYER
            ========================== */}

            <div className="buyer-profile">

              <div className="buyer-large-avatar">

                {selectedNotification.senderId?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "B"}

              </div>

              <div>

                <h3>

                  {selectedNotification.senderId
                    ?.name || "Unknown Buyer"}

                </h3>

                <p>
                  Buyer
                </p>

              </div>

            </div>


            {/* =========================
                BUYER DETAILS
            ========================== */}

            <div className="buyer-details-list">

              <div className="buyer-detail">

                <span>
                  📧 Email
                </span>

                <strong>

                  {selectedNotification.senderId
                    ?.email || "-"}

                </strong>

              </div>


              <div className="buyer-detail">

                <span>
                  📞 Phone
                </span>

                <strong>

                  {selectedNotification.senderId
                    ?.phone || "-"}

                </strong>

              </div>


              <div className="buyer-detail">

                <span>
                  📍 Location
                </span>

                <strong>

                  {selectedNotification.senderId
                    ?.location || "-"}

                </strong>

              </div>

            </div>


            {/* =========================
                MATCH DETAILS
            ========================== */}

            {selectedNotification.matchId && (

              <div className="connection-details">

                <h3>
                  Connection Details
                </h3>


                <div className="connection-row">

                  <span>
                    🌾 Crop
                  </span>

                  <strong>

                    {selectedNotification
                      .matchId
                      ?.farmerListingId
                      ?.cropName || "-"}

                  </strong>

                </div>


                <div className="connection-row">

                  <span>
                    📦 Quantity
                  </span>

                  <strong>

                    {selectedNotification
                      .matchId
                      ?.farmerListingId
                      ?.quantity
                      ? `${selectedNotification.matchId.farmerListingId.quantity} kg`
                      : "-"}

                  </strong>

                </div>


                <div className="connection-row">

                  <span>
                    💰 Expected Price
                  </span>

                  <strong>

                    {selectedNotification
                      .matchId
                      ?.farmerListingId
                      ?.expectedPrice
                      ? `₹${selectedNotification.matchId.farmerListingId.expectedPrice}/kg`
                      : "-"}

                  </strong>

                </div>


                <div className="connection-row">

                  <span>
                    🎯 Match Score
                  </span>

                  <strong>

                    {selectedNotification
                      .matchId
                      ?.matchScore !==
                      undefined
                      ? `${selectedNotification.matchId.matchScore}%`
                      : "-"}

                  </strong>

                </div>

              </div>

            )}


            {/* =========================
                CLOSE BUTTON
            ========================== */}

            <button
              className="modal-close-button"
              onClick={() =>
                setSelectedNotification(null)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default FarmerNotifications;
