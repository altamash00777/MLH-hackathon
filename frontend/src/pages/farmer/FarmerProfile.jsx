import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

function FarmerProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Get Farmer Profile
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");

      const user = response.data.user;

      // Make sure this is farmer
      if (user.role !== "farmer") {
        setError("This profile does not belong to a farmer.");
        return;
      }

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });

    } catch (error) {
      console.error("Fetch Profile Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // Handle Input
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ==========================================
  // Update Profile
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/profile",
        formData
      );

      setSuccess(
        response.data.message ||
        "Profile updated successfully"
      );

      // Update localStorage user information
      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const updatedUser = {
        ...oldUser,
        name: response.data.user.name,
        email: response.data.user.email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // Load Profile
  // ==========================================

  useEffect(() => {
    fetchProfile();
  }, []);


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-layout">

        <Sidebar />

        <main className="dashboard-main">

          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Loading profile...
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

        {/* Header */}

        <div className="page-header">

          <div>

            <h1>My Profile</h1>

            <p>
              Manage your farmer account information
            </p>

          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}


        {/* Success */}

        {success && (
          <div className="success-message">
            ✓ {success}
          </div>
        )}


        {/* Profile Card */}

        {!error && (

          <div className="crop-form-card">

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* Name */}

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Email */}

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Phone */}

                <div className="form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* Location */}

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

              </div>


              {/* Actions */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="submit-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>

          </div>

        )}

      </main>

    </div>
  );
}

export default FarmerProfile;