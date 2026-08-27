import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/farmer/login");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <span>🌱</span>
        <h2>AgriMarket</h2>
      </div>

      {/* Farmer Info */}
      <div className="farmer-info">
        <div className="farmer-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h4>{user?.name || "Farmer"}</h4>
          <p>Farmer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <NavLink
          to="/farmer/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/farmer/add-crop"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🌾</span>
          Add Crop
        </NavLink>

        <NavLink
          to="/farmer/crops"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>📦</span>
          My Crops
        </NavLink>

        <NavLink
          to="/farmer/matches"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span>🤝</span>
          Matches
        </NavLink>

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