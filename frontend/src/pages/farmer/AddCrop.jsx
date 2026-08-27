import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function AddCrop() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    quality: "",
    grade: "",
    harvestDate: "",
    sellingLocation: "",
    expectedPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit crop
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/farmer/listings", {
        cropName: formData.cropName,
        quantity: Number(formData.quantity),
        quality: formData.quality,
        grade: formData.grade,
        harvestDate: formData.harvestDate,
        sellingLocation: formData.sellingLocation,
        expectedPrice: Number(formData.expectedPrice),
      });

      setMessage(
        response.data.message || "Crop added successfully!"
      );

      // Clear form
      setFormData({
        cropName: "",
        quantity: "",
        quality: "",
        grade: "",
        harvestDate: "",
        sellingLocation: "",
        expectedPrice: "",
      });

    } catch (error) {
      console.error("Add Crop Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to add crop. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Add New Crop</h1>
            <p>
              Add your crop details for potential buyers.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/farmer/dashboard")}
          >
            ← Dashboard
          </button>
        </div>

        {/* Form */}
        <div className="crop-form-card">

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Crop Name */}
              <div className="form-group">
                <label>Crop Name</label>

                <input
                  type="text"
                  name="cropName"
                  placeholder="e.g. Wheat"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity (kg)</label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g. 500"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quality */}
              <div className="form-group">
                <label>Quality</label>

                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select quality</option>
                  <option value="Premium">Premium</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                </select>
              </div>

              {/* Grade */}
              <div className="form-group">
                <label>Grade</label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select grade</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>

              {/* Harvest Date */}
              <div className="form-group">
                <label>Harvest Date</label>

                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Selling Location */}
              <div className="form-group">
                <label>Selling Location</label>

                <input
                  type="text"
                  name="sellingLocation"
                  placeholder="e.g. Lucknow Mandi"
                  value={formData.sellingLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Expected Price */}
              <div className="form-group">
                <label>Expected Price (₹/kg)</label>

                <input
                  type="number"
                  name="expectedPrice"
                  placeholder="e.g. 25"
                  min="0"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Success */}
            {message && (
              <div className="success-message">
                ✓ {message}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/farmer/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Adding..." : "🌾 Add Crop"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddCrop;