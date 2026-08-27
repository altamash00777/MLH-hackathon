import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get("/farmer/listings");

      console.log("Dashboard crops:", response.data);

      const data = response.data.listings || response.data;

      setCrops(data);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     CALCULATE STATS
  ========================= */

  const totalCrops = crops.length;

  const activeCrops = crops.filter(
    (crop) => crop.status === "active"
  ).length;

  const matchedCrops = crops.filter(
    (crop) => crop.status === "matched"
  ).length;

  const soldCrops = crops.filter(
    (crop) => crop.status === "sold"
  ).length;


  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* Header */}

        <div className="dashboard-header">

          <div>
            <h1>
              Welcome, {user?.name || "Farmer"} 👋
            </h1>

            <p>
              Manage your crops and connect with buyers.
            </p>
          </div>

          <div className="profile-circle">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "F"}
          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================= */}

        <div className="stats-grid">

          {/* Total */}

          <div className="stat-card">

            <div className="stat-icon">
              🌾
            </div>

            <div>
              <p>Total Crops</p>

              <h2>
                {loading ? "..." : totalCrops}
              </h2>
            </div>

          </div>


          {/* Active */}

          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>
              <p>Active Crops</p>

              <h2>
                {loading ? "..." : activeCrops}
              </h2>
            </div>

          </div>


          {/* Matched */}

          <div className="stat-card">

            <div className="stat-icon">
              🤝
            </div>

            <div>
              <p>Matched</p>

              <h2>
                {loading ? "..." : matchedCrops}
              </h2>
            </div>

          </div>


          {/* Sold */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>
              <p>Sold</p>

              <h2>
                {loading ? "..." : soldCrops}
              </h2>
            </div>

          </div>

        </div>


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <div className="dashboard-section">

          <div className="section-header">

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your marketplace activities.
            </p>

          </div>


          <div className="action-grid">

            {/* Add Crop */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/farmer/add-crop")
              }
            >

              <div className="action-icon">
                🌱
              </div>

              <h3>
                Add New Crop
              </h3>

              <p>
                List your crop and reach potential
                buyers.
              </p>

              <span>
                Add Crop →
              </span>

            </div>


            {/* My Crops */}

            <div
              className="action-card"
              onClick={() =>
                navigate("/farmer/crops")
              }
            >

              <div className="action-icon">
                🌾
              </div>

              <h3>
                My Crops
              </h3>

              <p>
                View and manage your crop listings.
              </p>

              <span>
                View Crops →
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            RECENT CROPS
        ========================= */}

        <div className="dashboard-section">

          <div className="section-header">

            <h2>
              Recent Crops
            </h2>

            <p>
              Your latest crop listings.
            </p>

          </div>


          {crops.length === 0 && !loading && (

            <div className="empty-state">

              <div className="empty-icon">
                🌱
              </div>

              <h3>
                No crops yet
              </h3>

              <p>
                Add your first crop to get started.
              </p>

              <button
                onClick={() =>
                  navigate("/farmer/add-crop")
                }
              >
                Add Crop
              </button>

            </div>

          )}


          {crops.length > 0 && (

            <div className="my-crops-grid">

              {crops.slice(0, 3).map((crop) => (

                <div
                  className="my-crop-card"
                  key={crop._id}
                >

                  <div className="my-crop-top">

                    <div className="my-crop-icon">
                      🌾
                    </div>

                    <span className="my-crop-status">
                      {crop.status}
                    </span>

                  </div>

                  <h2>
                    {crop.cropName}
                  </h2>

                  <div className="my-crop-info">

                    <div className="my-crop-info-item">

                      <span>
                        Quantity
                      </span>

                      <strong>
                        {crop.quantity} kg
                      </strong>

                    </div>


                    <div className="my-crop-info-item">

                      <span>
                        Expected Price
                      </span>

                      <strong>
                        ₹{crop.expectedPrice}/kg
                      </strong>

                    </div>


                    <div className="my-crop-info-item">

                      <span>
                        Quality
                      </span>

                      <strong>
                        {crop.quality}
                      </strong>

                    </div>


                    <div className="my-crop-info-item">

                      <span>
                        Grade
                      </span>

                      <strong>
                        {crop.grade}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* View all */}

        {crops.length > 3 && (

          <button
            className="submit-button"
            onClick={() =>
              navigate("/farmer/crops")
            }
            style={{ marginTop: "20px" }}
          >
            View All Crops
          </button>

        )}

      </main>

    </div>
  );
}

export default FarmerDashboard;