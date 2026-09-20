
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css"

function Sidebar() {
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

    navigate("/farmer/login");
  };

  // Close sidebar after clicking a menu item on mobile
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ================================
          MOBILE HAMBURGER
      ================================= */}

      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>


      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}


      {/* ================================
          SIDEBAR
      ================================= */}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        {/* Logo */}
        <div className="sidebar-logo">
          <span>🌱</span>
          <h2>Dishaa</h2>
        </div>


        {/* Navigation */}
        <nav className="sidebar-nav">

          <NavLink
            to="/farmer/dashboard"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📊</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/farmer/add-crop"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🌾</span>
            Add Crop
          </NavLink>


          <NavLink
            to="/farmer/crops"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📦</span>
            My Crops
          </NavLink>


          <NavLink
            to="/farmer/matches"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🤝</span>
            Matches
          </NavLink>


          <NavLink
            to="/farmer/ai-price-prediction"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🤖</span>
            AI Price Prediction
          </NavLink>


          <NavLink
            to="/farmer/bidding"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>⚖️</span>
            Bidding
          </NavLink>


          <NavLink
            to="/farmer/fpo"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🏢</span>
            FPO / Group Transaction
          </NavLink>


          <NavLink
            to="/farmer/orders"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📋</span>
            Orders
          </NavLink>


          <NavLink
            to="/farmer/payment"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>💳</span>
            Payment
          </NavLink>


          <NavLink
            to="/farmer/transactions"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>💰</span>
            Transaction
          </NavLink>


          <NavLink
            to="/farmer/storage"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🏪</span>
            Storage
          </NavLink>


          <NavLink
            to="/farmer/verified-buyer"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>✅</span>
            Verified Buyer
          </NavLink>


          <NavLink
            to="/farmer/price-trend"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📈</span>
            Price Trend
          </NavLink>


          <NavLink
            to="/farmer/notifications"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>🔔</span>
            Notification
          </NavLink>


          <NavLink
            to="/farmer/profile"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>👤</span>
            Profile
          </NavLink>

        </nav>


        {/* Logout */}
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>🚪</span>
          Logout
        </button>

      </aside>
    </>
  );
}

export default Sidebar;