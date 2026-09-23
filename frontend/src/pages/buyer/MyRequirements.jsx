import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import api from "../../services/api";
import "./MyRequirement.css"
function MyRequirements() {
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // Fetch Requirements
  // ================================

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      console.log("Token exists:", !!token);

      if (!token) {
        setError("You are not logged in. Please login again.");
        return;
      }

      const response = await api.get("/buyer/requirements");

      console.log("Requirements Response:", response.data);

      setRequirements(response.data.requirements || []);

    } catch (error) {
      console.error("Fetch Requirements Error:", error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      setError(
        error.response?.data?.message ||
        "Failed to load requirements"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Delete Requirement
  // ================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this requirement?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/buyer/requirements/${id}`);

      setRequirements((prevRequirements) =>
        prevRequirements.filter(
          (requirement) => requirement._id !== id
        )
      );

      alert("Requirement deleted successfully!");

    } catch (error) {
      console.error("Delete Requirement Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete requirement"
      );
    }
  };

  // ================================
  // Load on page open / refresh
  // ================================

  useEffect(() => {
    fetchRequirements();
  }, []);

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        {/* Header */}

        <div className="page-header">

          <div>

            <h1>My Requirements</h1>

            <p>
              Manage the crops you want to buy
            </p>

          </div>

          <button
            className="submit-button"
            onClick={() =>
              navigate("/buyer/add-requirement")
            }
          >
            + Post Requirement
          </button>

        </div>


        {/* Loading */}

        {loading && (
          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading requirements...
            </h3>

          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="empty-state">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>
              Unable to load requirements
            </h3>

            <p>
              {error}
            </p>

            <button onClick={fetchRequirements}>
              Try Again
            </button>

          </div>
        )}


        {/* No Requirements */}

        {!loading &&
          !error &&
          requirements.length === 0 && (

          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No requirements yet
            </h3>

            <p>
              Post your first crop requirement
              to find suitable farmers.
            </p>

            <button
              onClick={() =>
                navigate("/buyer/add-requirement")
              }
            >
              + Post Requirement
            </button>

          </div>
        )}


        {/* Requirements */}

        {!loading &&
          !error &&
          requirements.length > 0 && (

          <div className="requirements-grid">

            {requirements.map((requirement) => (

              <div
                className="requirement-card"
                key={requirement._id}
              >

                {/* Top */}

                <div className="requirement-card-top">

                  <div className="requirement-icon">
                    🌾
                  </div>

                  <span
                    className={`requirement-status ${requirement.status}`}
                  >
                    {requirement.status}
                  </span>

                </div>


                {/* Crop */}

                <h2>
                  {requirement.cropName}
                </h2>


                {/* Details */}

                <div className="requirement-details">

                  <div>
                    <span>
                      Required Quantity
                    </span>

                    <strong>
                      {requirement.requiredQuantity} kg
                    </strong>
                  </div>


                  <div>
                    <span>
                      Expected Price
                    </span>

                    <strong>
                      ₹{requirement.expectedPrice}/kg
                    </strong>
                  </div>


                  <div>
                    <span>
                      Quality
                    </span>

                    <strong>
                      {requirement.quality}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Grade
                    </span>

                    <strong>
                      {requirement.grade}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      {requirement.location}
                    </strong>
                  </div>

                </div>


                {/* Actions */}

                <div className="requirement-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      navigate(
                        `/buyer/edit-requirement/${requirement._id}`
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(requirement._id)
                    }
                  >
                    🗑️ Delete
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

export default MyRequirements;