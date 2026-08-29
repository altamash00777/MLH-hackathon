import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function BuyerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("");
      setSuccess("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...formData,
          role: "buyer",
        }
      );

      // Check response
      console.log("BUYER REGISTER RESPONSE:", response.data);

      // Get JWT token from backend
      const token = response.data.token;

      if (!token) {
        setError(
          "Registration successful, but login token was not received."
        );
        return;
      }

      // Save authentication token
      localStorage.setItem("token", token);

      // Save buyer information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess(
        "Buyer registration successful! Redirecting to dashboard..."
      );

      // Go directly to buyer dashboard
      setTimeout(() => {
        navigate("/buyer/dashboard");
      }, 500);

    } catch (error) {
      console.error("Buyer Registration Error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-logo">
          🏢
        </div>

        <h1>Buyer Registration</h1>

        <p className="auth-subtitle">
          Create your buyer account
        </p>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?{" "}

          <Link to="/buyer/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default BuyerRegister;