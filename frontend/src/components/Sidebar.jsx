
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

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

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>

      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

    
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >

        {/* ================================
            LOGO
        ================================= */}

        <div className="sidebar-logo">
          <span>🌱</span>
          <h2>Dishaa</h2>
        </div>

        {/* ================================
            NAVIGATION
        ================================= */}

        <nav className="sidebar-nav">

          {/* Dashboard */}

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


          {/* Add Crop */}

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


          {/* My Crops */}

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


          {/* Matches */}

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


          {/* Deals */}

          <NavLink
            to="/farmer/deals"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📑</span>
            Deals
          </NavLink>


          {/* Market Intelligence */}

          <NavLink
            to="/farmer/market-intelligence"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>📈</span>
            Market Intelligence
          </NavLink>


          {/* AI Price Prediction */}

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


          {/* Bidding */}

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


          {/* FPO */}

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


          {/* Orders */}

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


          {/* Payment */}

          <NavLink
            to="/farmer/payments"
            onClick={handleNavClick}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span>💳</span>
            Payment
          </NavLink>


          {/* Transaction */}

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


          {/* Storage */}

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


          {/* Verified Buyer */}

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


          {/* Price Trend */}

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


          {/* Notifications */}

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


          {/* Profile */}

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


        {/* ================================
            LOGOUT
        ================================= */}

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
