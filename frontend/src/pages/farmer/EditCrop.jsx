import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function EditCrop() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    quality: "",
    grade: "",
    harvestDate: "",
    sellingLocation: "",
    expectedPrice: "",
  });


  /* =========================
     GET CROP
  ========================= */

  useEffect(() => {
    fetchCrop();
  }, [id]);


  const fetchCrop = async () => {
    try {
      const response = await api.get(
        `/farmer/listings/${id}`
      );

      console.log("Crop:", response.data);

      const crop =
        response.data.listing ||
        response.data;

      setFormData({
        cropName: crop.cropName || "",
        quantity: crop.quantity || "",
        quality: crop.quality || "",
        grade: crop.grade || "",
        harvestDate: crop.harvestDate
          ? crop.harvestDate.substring(0, 10)
          : "",
        sellingLocation: crop.sellingLocation || "",
        expectedPrice: crop.expectedPrice || "",
      });

    } catch (error) {
      console.error(
        "Fetch crop error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load crop"
      );

    } finally {
      setLoading(false);
    }
  };


  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  /* =========================
     UPDATE CROP
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {

      await api.put(
        `/farmer/listings/${id}`,
        {
          cropName: formData.cropName,

          quantity: Number(
            formData.quantity
          ),

          quality: formData.quality,

          grade: formData.grade,

          harvestDate:
            formData.harvestDate,

          sellingLocation:
            formData.sellingLocation,

          expectedPrice: Number(
            formData.expectedPrice
          ),
        }
      );

      setSuccess(
        "Crop updated successfully!"
      );

      setTimeout(() => {
        navigate("/farmer/crops");
      }, 1000);

    } catch (error) {

      console.error(
        "Update crop error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update crop"
      );

    } finally {
      setSaving(false);
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="dashboard-layout">

        <Sidebar />

        <main className="dashboard-main">

          <div className="empty-state">
            <h3>
              Loading crop...
            </h3>
          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* HEADER */}

        <div className="page-header">

          <div>
            <h1>
              Edit Crop
            </h1>

            <p>
              Update your crop information
            </p>
          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/farmer/crops")
            }
          >
            ← Back to My Crops
          </button>

        </div>


        {/* FORM */}

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
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Quantity */}

              <div className="form-group">

                <label>
                  Quantity (kg)
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>


              {/* Quality */}

              <div className="form-group">

                <label>
                  Quality
                </label>

                <input
                  type="text"
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Grade */}

              <div className="form-group">

                <label>
                  Grade
                </label>

                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Harvest Date */}

              <div className="form-group">

                <label>
                  Harvest Date
                </label>

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

                <label>
                  Selling Location
                </label>

                <input
                  type="text"
                  name="sellingLocation"
                  value={formData.sellingLocation}
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
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}


            {/* BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/farmer/crops")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "Update Crop"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditCrop;