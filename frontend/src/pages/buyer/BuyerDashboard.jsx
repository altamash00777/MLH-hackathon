import BuyerSidebar from "../../components/BuyerSidebar";

function BuyerDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <h1>
              Buyer Dashboard
            </h1>

            <p>
              Welcome back, {user?.name || "Buyer"}!
            </p>

          </div>

          <div className="profile-circle">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "B"}

          </div>

        </div>


        {/* Stats */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <p>
                My Requirements
              </p>

              <h2>
                4
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🤝
            </div>

            <div>

              <p>
                Matches
              </p>

              <h2>
                2
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📨
            </div>

            <div>

              <p>
                Requests
              </p>

              <h2>
                1
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <p>
                Accepted
              </p>

              <h2>
                1
              </h2>

            </div>

          </div>

        </div>


        {/* Quick Actions */}

        <div className="dashboard-section">

          <div className="section-header">

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your buying requirements
            </p>

          </div>


          <div className="action-grid">

            <div
              className="action-card"
              onClick={() =>
                window.location.href =
                "/buyer/add-requirement"
              }
            >

              <div className="action-icon">
                ➕
              </div>

              <h3>
                Post Requirement
              </h3>

              <p>
                Tell farmers what crops
                you are looking to buy.
              </p>

              <span>
                Post Requirement →
              </span>

            </div>


            <div
              className="action-card"
              onClick={() =>
                window.location.href =
                "/buyer/matches"
              }
            >

              <div className="action-icon">
                🤝
              </div>

              <h3>
                View Matches
              </h3>

              <p>
                See farmers whose crops
                match your requirements.
              </p>

              <span>
                View Matches →
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default BuyerDashboard;
