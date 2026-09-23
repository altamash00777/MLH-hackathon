import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./BuyerSidebar.css";

function BuyerSidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/buyer/login");
  };

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =========================================
          MOBILE HAMBURGER
      ========================================= */}

      <button
        className="buyer-mobile-menu-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle buyer menu"
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {isOpen && (
        <div
          className="buyer-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =========================================
          BUYER SIDEBAR
      ========================================= */}

      <aside
        className={`buyer-sidebar ${
          isOpen ? "buyer-sidebar-open" : ""
        }`}
      >

        {/* =========================================
            LOGO
        ========================================= */}

        <div className="buyer-sidebar-logo">
          <span>🌾</span>
          <h2>Dishaa</h2>
        </div>

        {/* =========================================
            BUYER INFO
        ========================================= */}

        {/* <div className="buyer-info">
          <div className="buyer-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "B"}
          </div>

          <div className="buyer-user-details">
            <h4>{user?.name || "Buyer"}</h4>
            <p>Buyer</p>
          </div>
        </div> */}

        {/* =========================================
            NAVIGATION
        ========================================= */}

        <nav className="buyer-sidebar-nav">

          {/* Dashboard */}
          <NavLink
            to="/buyer/dashboard"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "buyer-nav-item active"
                : "buyer-nav-item"
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          {/* My Requirements */}
          <NavLink
            to="/buyer/requirements"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "buyer-nav-item active"
                : "buyer-nav-item"
            }
          >
            <span>📋</span>
            <span>My Requirements</span>
          </NavLink>

          {/* Post Requirement */}
          <NavLink
            to="/buyer/add-requirement"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "buyer-nav-item active"
                : "buyer-nav-item"
            }
          >
            <span>➕</span>
            <span>Post Requirement</span>
          </NavLink>

          {/* Farmer Matches */}
          <NavLink
            to="/buyer/matches"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "buyer-nav-item active"
                : "buyer-nav-item"
            }
          >
            <span>🤝</span>
            <span>Farmer Matches</span>
          </NavLink>

          {/* Deals */}
          <NavLink
            to="/buyer/deals"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive
                ? "buyer-nav-item active"
                : "buyer-nav-item"
            }
          >
            <span>📑</span>
            <span>Deals</span>
          </NavLink>

        </nav>

        {/* =========================================
            LOGOUT
        ========================================= */}

        <button
          className="buyer-logout-button"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </aside>
    </>
  );
}

export default BuyerSidebar;
