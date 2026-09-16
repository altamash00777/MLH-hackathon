import { NavLink, useNavigate } from "react-router-dom";

function BuyerSidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/buyer/login");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <span>🌾</span>

        <h2>Dishaa</h2>

      </div>


      {/* Buyer Info */}

      <div className="farmer-info">

        <div className="farmer-avatar">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "B"}
        </div>

        <div>

          <h4>
            {user?.name || "Buyer"}
          </h4>

          <p>
            Buyer
          </p>

        </div>

      </div>


      {/* Navigation */}

      <nav className="sidebar-nav">

        <NavLink
          to="/buyer/dashboard"
          className={({ isActive }) =>
            isActive
              ? "nav-item active"
              : "nav-item"
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>


        <NavLink
          to="/buyer/requirements"
          className={({ isActive }) =>
            isActive
              ? "nav-item active"
              : "nav-item"
          }
        >
          <span>📋</span>
          My Requirements
        </NavLink>


        <NavLink
          to="/buyer/add-requirement"
          className={({ isActive }) =>
            isActive
              ? "nav-item active"
              : "nav-item"
          }
        >
          <span>➕</span>
          Post Requirement
        </NavLink>


<NavLink
  to="/buyer/matches"
  className={({ isActive }) =>
    isActive ? "nav-item active" : "nav-item"
  }
>
  <span>🤝</span>
  Farmer Matches
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

export default BuyerSidebar;


