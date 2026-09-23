import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";
import "./AddRequirement.css"


function AddRequirement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    requiredQuantity: "",
    quality: "",
    grade: "",
    location: "",
    expectedPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/buyer/requirements",
        {
          cropName: formData.cropName,
          requiredQuantity: Number(formData.requiredQuantity),
          quality: formData.quality,
          grade: formData.grade,
          location: formData.location,
          expectedPrice: Number(formData.expectedPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Requirement posted successfully!");

      setFormData({
        cropName: "",
        requiredQuantity: "",
        quality: "",
        grade: "",
        location: "",
        expectedPrice: "",
      });

    } catch (error) {
      console.error("Add Requirement Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to post requirement. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        <div className="page-header">

          <div>
            <h1>Post Requirement</h1>

            <p>
              Tell farmers what crop you want to buy
            </p>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/buyer/dashboard")}
          >
            ← Back
          </button>

        </div>


        <div className="crop-form-card">

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Crop Name */}

              <div className="form-group">

                <label>
                  Crop Name
                </label>

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

                <label>
                  Required Quantity (kg)
                </label>

                <input
                  type="number"
                  name="requiredQuantity"
                  placeholder="e.g. 1000"
                  min="1"
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Quality */}

              <div className="form-group">

                <label>
                  Quality
                </label>

                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Quality
                  </option>

                  <option value="Premium">
                    Premium
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Standard">
                    Standard
                  </option>

                </select>

              </div>


              {/* Grade */}

              <div className="form-group">

                <label>
                  Grade
                </label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Grade
                  </option>

                  <option value="A">
                    Grade A
                  </option>

                  <option value="B">
                    Grade B
                  </option>

                  <option value="C">
                    Grade C
                  </option>

                </select>

              </div>


              {/* Location */}

              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Lucknow"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Expected Price */}

              <div className="form-group">

                <label>
                  Expected Price (₹/kg)
                </label>

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


            {/* Messages */}

            {success && (
              <div className="success-message">
                ✓ {success}
              </div>
            )}

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
                onClick={() =>
                  navigate("/buyer/dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? "Posting..."
                  : "Post Requirement"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddRequirement;