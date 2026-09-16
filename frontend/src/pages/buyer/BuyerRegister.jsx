import "./BuyerRegister.css"

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  TrendingUp,
  UserRound,
} from "lucide-react";

import "./BuyerRegister.css";

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

      console.log("BUYER REGISTER RESPONSE:", response.data);

      const token = response.data.token;

      if (!token) {
        setError(
          "Registration successful, but login token was not received."
        );
        return;
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess(
        "Buyer registration successful! Redirecting to dashboard..."
      );

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
    <div className="buyer-register-page">

      {/* Background */}
      <div className="buyer-register-bg"></div>

      <div className="buyer-sun-glow"></div>
      <div className="buyer-glow buyer-glow-one"></div>
      <div className="buyer-glow buyer-glow-two"></div>

      {/* Floating farm / marketplace elements */}
      <motion.div
        className="buyer-decoration buyer-decoration-one"
        animate={{
          y: [0, -13, 0],
          rotate: [0, 5, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌾
      </motion.div>

      <motion.div
        className="buyer-decoration buyer-decoration-two"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -5, 3, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🛒
      </motion.div>

      <motion.div
        className="buyer-decoration buyer-decoration-three"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌿
      </motion.div>

      {/* Topbar */}
      <motion.header
        className="buyer-register-topbar"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="buyer-register-brand">
          <div className="buyer-register-brand-icon">
            <Leaf size={19} />
          </div>

          <span>
            Kissan<span>Connect</span>
          </span>
        </Link>

        <Link
          to="/Landing"
          className="buyer-register-back"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </motion.header>

      {/* Main */}
      <main className="buyer-register-main">

        <div className="buyer-register-wrapper">

          {/* LEFT INTRO */}
          <motion.section
            className="buyer-register-intro"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div className="buyer-register-badge">
              <ShoppingCart size={15} />
              BUYER MARKETPLACE
            </div>

            <h1>
              Source smarter.
              <span>Buy better.</span>
            </h1>

            <p className="buyer-register-description">
              Connect with farmers, discover quality produce
              and build a reliable agricultural supply network
              from one simple platform.
            </p>

            <div className="buyer-register-features">

              <div className="buyer-register-feature">
                <div className="buyer-feature-icon">
                  <Search size={18} />
                </div>

                <div>
                  <strong>Discover quality crops</strong>
                  <span>
                    Find produce that matches your requirements.
                  </span>
                </div>
              </div>

              <div className="buyer-register-feature">
                <div className="buyer-feature-icon">
                  <TrendingUp size={18} />
                </div>

                <div>
                  <strong>Understand the market</strong>
                  <span>
                    Track mandi prices and market opportunities.
                  </span>
                </div>
              </div>

              <div className="buyer-register-feature">
                <div className="buyer-feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Connect directly</strong>
                  <span>
                    Build trusted sourcing connections with farmers.
                  </span>
                </div>
              </div>

            </div>

            {/* Marketplace mini card */}
            <div className="buyer-market-card">

              <div className="buyer-market-icon">
                <ShoppingCart size={20} />
              </div>

              <div className="buyer-market-content">
                <strong>One marketplace. Better sourcing.</strong>
                <span>
                  Find farmers and build your supply network.
                </span>
              </div>

              <div className="buyer-market-status">
                <span></span>
                Live
              </div>

            </div>

          </motion.section>

          {/* REGISTER CARD */}
          <motion.section
            className="buyer-register-card"
            initial={{
              opacity: 0,
              x: 35,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
          >

            <div className="buyer-register-card-header">

              <div className="buyer-register-icon">
                <Building2 size={23} />
              </div>

              <div>
                <span>BUYER ACCOUNT</span>
                <h2>Create your account</h2>
              </div>

            </div>

            <p className="buyer-register-card-description">
              Create your buyer account and start discovering
              agricultural products directly from farmers.
            </p>

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="buyer-form-group">
                <label>Your name</label>

                <div className="buyer-input-wrapper">
                  <UserRound size={17} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="buyer-form-group">
                <label>Email address</label>

                <div className="buyer-input-wrapper">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="buyer-form-group">
                <label>Phone number</label>

                <div className="buyer-input-wrapper">
                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="buyer-form-group">
                <label>Business location</label>

                <div className="buyer-input-wrapper">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="location"
                    placeholder="City / Business location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="buyer-form-group">
                <label>Password</label>

                <div className="buyer-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    type="password"
                    name="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Success */}
              {success && (
                <motion.div
                  className="buyer-register-success"
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                  {success}
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  className="buyer-register-error"
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  {error}
                </motion.div>
              )}

              {/* Button */}
              <motion.button
                type="submit"
                className="buyer-register-button"
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.015,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
              >
                {loading ? (
                  <>
                    <span className="buyer-register-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Buyer Account
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>

            </form>

            {/* Footer */}
            <div className="buyer-register-footer">
              <span>
                Already have an account?
              </span>

              <Link to="/buyer/login">
                Login
              </Link>
            </div>

            <div className="buyer-register-security">
              <LockKeyhole size={13} />
              Your account information is securely protected
            </div>

          </motion.section>

        </div>
      </main>
    </div>
  );
}

export default BuyerRegister
