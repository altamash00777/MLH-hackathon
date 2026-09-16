import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/farmer/login");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <span>🌱</span>
        <h2>Dishaa</h2>
        
      </div>

      {/* Farmer Info */}
      {/* <div className="farmer-info">
        <div className="farmer-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h4>{user?.name || "Farmer"}</h4>
          <p>Farmer</p>
        </div>
      </div> */}

      {/* Navigation */}
      <nav className="sidebar-nav">

        {/* Dashboard */}
        <NavLink
          to="/farmer/dashboard"
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
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🤝</span>
          Matches
        </NavLink>

        {/* Notification */}
        <NavLink
          to="/farmer/notifications"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🔔</span>
          Notification
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/farmer/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📋</span>
          Orders
        </NavLink>

        {/* Payment */}
        <NavLink
          to="/farmer/payment"
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
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📈</span>
          Price Trend
        </NavLink>

{/* AI Price Prediction */}
<NavLink
  to="/farmer/ai-price-prediction"
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
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <span>🏢</span>
  FPO//Group Transaction
</NavLink>




        {/* FPO / Group Transaction
        <NavLink
          to="/farmer/fpo-transactions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>👥</span>
          FPO/Group Transaction
        </NavLink> */}

        {/* Profile */}
        <NavLink
          to="/farmer/profile"
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
  );
}

export default Sidebar;
