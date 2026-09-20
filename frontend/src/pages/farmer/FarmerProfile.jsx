
import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import "./FarmerProfile.css";

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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/profile");
      const user = response.data.user;

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

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

      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const updatedUser = {
        ...oldUser,
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
        location: response.data.user.location,
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

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main farmer-profile-main">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <h3>Loading your profile...</h3>
            <p>Please wait a moment.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main farmer-profile-main">

        {/* Header */}
        <div className="profile-page-header">
          <div>
            <span className="profile-label">
              FARMER ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and
              marketplace account.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="profile-alert error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {success && (
          <div className="profile-alert success">
            <span>✓</span>
            {success}
          </div>
        )}

        {!error && (
          <div className="profile-layout">

            {/* Profile Overview */}
            <section className="profile-overview">

              <div className="profile-avatar">
                {formData.name
                  ? formData.name
                      .charAt(0)
                      .toUpperCase()
                  : "F"}
              </div>

              <h2>
                {formData.name || "Farmer"}
              </h2>

              <span className="farmer-badge">
                🌾 Farmer
              </span>

              <p className="profile-location">
                📍 {formData.location || "Location not set"}
              </p>

              <div className="profile-divider"></div>

              <div className="profile-info">
                <div>
                  <span>Account Type</span>
                  <strong>Farmer</strong>
                </div>

                <div>
                  <span>Marketplace</span>
                  <strong>Disha</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong className="active-status">
                    ● Active
                  </strong>
                </div>
              </div>
            </section>

            {/* Edit Profile */}
            <section className="profile-form-card">

              <div className="form-card-header">
                <div>
                  <h2>Personal Information</h2>
                  <p>
                    Keep your contact details up to date.
                  </p>
                </div>

                <div className="edit-icon">
                  ✎
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="profile-form-grid">

                  <div className="profile-form-group">
                    <label>Full Name</label>

                    <div className="input-wrapper">
                      <span>👤</span>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label>Email Address</label>

                    <div className="input-wrapper">
                      <span>✉</span>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label>Phone Number</label>

                    <div className="input-wrapper">
                      <span>☎</span>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label>Location</label>

                    <div className="input-wrapper">
                      <span>📍</span>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Village, City"
                        required
                      />
                    </div>
                  </div>

                </div>

                <div className="profile-form-footer">
                  <p>
                    Your information helps buyers
                    connect with you.
                  </p>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>

              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default FarmerProfile;
