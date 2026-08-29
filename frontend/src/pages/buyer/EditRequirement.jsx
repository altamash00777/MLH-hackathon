import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BuyerSidebar from "../../components/BuyerSidebar";

function EditRequirement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    requiredQuantity: "",
    quality: "",
    grade: "",
    location: "",
    expectedPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Get existing requirement
  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/buyer/requirements/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const requirement =
          response.data.requirement;

        setFormData({
          cropName: requirement.cropName,
          requiredQuantity: requirement.requiredQuantity,
          quality: requirement.quality,
          grade: requirement.grade,
          location: requirement.location,
          expectedPrice: requirement.expectedPrice,
        });

      } catch (error) {
        console.error(
          "Fetch Requirement Error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load requirement"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/buyer/requirements/${id}`,
        {
          cropName: formData.cropName,
          requiredQuantity: Number(
            formData.requiredQuantity
          ),
          quality: formData.quality,
          grade: formData.grade,
          location: formData.location,
          expectedPrice: Number(
            formData.expectedPrice
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Requirement updated successfully!");

      navigate("/buyer/requirements");

    } catch (error) {
      console.error(
        "Update Requirement Error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update requirement"
      );

    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="dashboard-layout">

        <BuyerSidebar />

        <main className="dashboard-main">

          <div className="empty-state">
            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading requirement...
            </h3>
          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="dashboard-layout">

      <BuyerSidebar />

      <main className="dashboard-main">

        <div className="page-header">

          <div>

            <h1>
              Edit Requirement
            </h1>

            <p>
              Update your buying requirement
            </p>

          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/buyer/requirements")
            }
          >
            ← Back
          </button>

        </div>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <div className="crop-form-card">

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Crop Name
                </label>

                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Required Quantity (kg)
                </label>

                <input
                  type="number"
                  name="requiredQuantity"
                  min="1"
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                  required
                />

              </div>


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


              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Expected Price (₹/kg)
                </label>

                <input
                  type="number"
                  name="expectedPrice"
                  min="0"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/buyer/requirements")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={updating}
              >
                {updating
                  ? "Updating..."
                  : "Update Requirement"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditRequirement;