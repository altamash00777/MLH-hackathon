// src/pages/farmer/FarmerLogin.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Mail,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react";

import api from "../../services/api";
import "./FarmerLogin.css";

function FarmerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      // Check that the account is actually a farmer
      if (user.role !== "farmer") {
        setError("This login is only for farmers.");
        setLoading(false);
        return;
      }

      // Store authentication information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Go to farmer dashboard
      navigate("/farmer/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-auth-page">

      {/* ================= BACKGROUND ================= */}

      <div className="auth-grid"></div>

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <motion.div
        className="floating-seed seed-one"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌿
      </motion.div>

      <motion.div
        className="floating-seed seed-two"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -10, 5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🍃
      </motion.div>


      {/* ================= TOP BAR ================= */}

      <motion.div
        className="auth-topbar"
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >

        <Link
          to="/"
          className="auth-brand"
        >

          <div className="auth-brand-icon">
            <Leaf size={20} />
          </div>

          <span>
            Kissan<span>Connect</span>
          </span>

        </Link>


        <Link
          to="/Landing"
          className="back-home"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>

      </motion.div>


      {/* ================= MAIN ================= */}

      <main className="farmer-auth-main">

        <div className="farmer-auth-wrapper">


          {/* ================= LEFT SIDE ================= */}

          <motion.div
            className="farmer-auth-intro"

            initial={{
              opacity: 0,
              x: -40,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.8,
            }}
          >

            <div className="intro-badge">
              <Sprout size={15} />
              FARMER MARKETPLACE
            </div>


            <h1>
              Grow your
              <span>
                {" "}market.
              </span>
            </h1>


            <p className="intro-description">
              Connect directly with the right buyers,
              discover better market opportunities and
              sell your crops smarter.
            </p>


            {/* Benefits */}

            <div className="intro-features">

              <div className="intro-feature">

                <div className="intro-feature-icon">
                  <Wheat size={17} />
                </div>

                <div>
                  <strong>
                    Sell your crops
                  </strong>

                  <span>
                    Reach buyers looking for your produce.
                  </span>
                </div>

              </div>


              <div className="intro-feature">

                <div className="intro-feature-icon">
                  <TrendingUp size={17} />
                </div>

                <div>
                  <strong>
                    Know the market
                  </strong>

                  <span>
                    Track mandi prices and market trends.
                  </span>
                </div>

              </div>


              <div className="intro-feature">

                <div className="intro-feature-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>
                  <strong>
                    Find the right buyer
                  </strong>

                  <span>
                    Smart matching based on your crop.
                  </span>

                </div>

              </div>

            </div>

          </motion.div>



          {/* ================= LOGIN CARD ================= */}

          <motion.div
            className="farmer-login-card"

            initial={{
              opacity: 0,
              x: 40,
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

            {/* Card Header */}

            <div className="login-card-header">

              <div className="login-icon">
                <Sprout size={23} />
              </div>

              <div>
                <span>
                  FARMER ACCOUNT
                </span>

                <h2>
                  Welcome back
                </h2>
              </div>

            </div>


            <p className="login-description">
              Login to continue managing your
              crops and marketplace connections.
            </p>


            {/* ================= FORM ================= */}

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className="modern-form-group">

                <label>
                  Email address
                </label>

                <div className="modern-input-wrapper">

                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Password */}

              <div className="modern-form-group">

                <label>
                  Password
                </label>

                <div className="modern-input-wrapper">

                  <LockKeyhole size={17} />

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Error */}

              {error && (

                <motion.div
                  className="farmer-login-error"

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


              {/* Login button */}

              <motion.button
                type="submit"
                className="farmer-login-button"
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
                    <span className="login-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to marketplace
                    <ArrowRight size={17} />
                  </>
                )}

              </motion.button>

            </form>


            {/* Footer */}

            <div className="login-card-footer">

              <span>
                Don't have a farmer account?
              </span>

              <Link to="/farmer/register">
                Create account
              </Link>

            </div>


            {/* Security */}

            <div className="login-security">

              <LockKeyhole size={13} />

              <span>
                Your account information is securely protected
              </span>

            </div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}

export default FarmerLogin;