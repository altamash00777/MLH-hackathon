import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./MyCrops.css"
import cropBg from "../../assets/land-morning.jpg";
import croImage from "../../assets/CRO.png";

function MyCrops() {

  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCrops = async () => {
    try {
      const response = await api.get("/farmer/listings");

      console.log("Crops:", response.data);

      setCrops(response.data.listings || response.data);

    } catch (error) {
      console.error("Fetch crops error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load crops."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);




const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this crop?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await api.delete(`/farmer/listings/${id}`);

    // Remove deleted crop from screen
    setCrops((previousCrops) =>
      previousCrops.filter((crop) => crop._id !== id)
    );

    alert("Crop deleted successfully");

  } catch (error) {
    console.error("Delete crop error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to delete crop"
    );
  }
};









  return (
    // <div className="dashboard-layout">

<div className="dashboard-layout">

      <Sidebar />

      {/* <main className="dashboard-main"> */}

<main
  className="dashboard-main my-crops-page"
  style={{ backgroundImage: `url(${cropBg})` }}
>

        {/* Header */}

        <div className="my-crops-header">

          <div className="my-crops-title">
            <h1>My Crops</h1>

            <p>
              Manage your crop listings
            </p>
          </div>

          <button
            className="add-crop-btn"
            onClick={() => navigate("/farmer/add-crop")}
          >
            + Add New Crop
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <div className="my-crops-empty">
            {/* <div className="my-crops-empty-icon">
              🌾
            </div> */}

<div className="my-crops-empty-icon">
  <img src={croImage} alt="Crops" />
</div>


            <h3>
              Loading crops...
            </h3>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

      

{!loading && !error && crops.length === 0 && (
  <div className="my-crops-empty">

    <div className="my-crops-empty-icon">
      <img src={croImage} alt="Crops" />
    </div>

    <h3>
      No crops listed yet
    </h3>

    <p>
      Add your first crop to start
      connecting with buyers.
    </p>

    <button
      onClick={() => navigate("/farmer/add-crop")}
    >
      Add Your First Crop
    </button>

  </div>
)}

        {/* Crops */}

        {!loading && !error && crops.length > 0 && (

          <div className="my-crops-grid">

            {crops.map((crop) => (

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
                    <span>Quantity</span>
                    <strong>
                      {crop.quantity} kg
                    </strong>
                  </div>

                  <div className="my-crop-info-item">
                    <span>Quality</span>
                    <strong>
                      {crop.quality}
                    </strong>
                  </div>

                  <div className="my-crop-info-item">
                    <span>Grade</span>
                    <strong>
                      {crop.grade}
                    </strong>
                  </div>

                  <div className="my-crop-info-item">
                    <span>Expected Price</span>
                    <strong>
                      ₹{crop.expectedPrice}/kg
                    </strong>
                  </div>

                  <div className="my-crop-info-item">
                    <span>Selling Location</span>
                    <strong>
                      {crop.sellingLocation}
                    </strong>
                  </div>

                  <div className="my-crop-info-item">
                    <span>Harvest Date</span>
                    <strong>
                      {new Date(
                        crop.harvestDate
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                </div>

                <div className="my-crop-buttons">

<button
  className="my-crop-edit-btn"
  onClick={() =>
    navigate(
      `/farmer/crops/edit/${crop._id}`
    )
  }
>
  Edit
</button>

<button
  className="my-crop-delete-btn"
  onClick={() => handleDelete(crop._id)}
>
  Delete
</button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyCrops;
