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
  MapPin,
  Phone,
  Sprout,
  UserRound,
  Wheat,
} from "lucide-react";

import api from "../../services/api";
import "./FarmerRegister.css";

function FarmerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
  });

  const [message, setMessage] = useState("");
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

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        ...formData,
        role: "farmer",
      });

      console.log("REGISTER RESPONSE:", response.data);

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

      setMessage(
        "Registration successful! Redirecting to dashboard..."
      );

      setTimeout(() => {
        navigate("/farmer/dashboard");
      }, 500);
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-register-page">

      {/* Background */}
      <div className="farmer-register-bg"></div>

      <div className="farmer-sun-glow"></div>
      <div className="farmer-glow farmer-glow-one"></div>
      <div className="farmer-glow farmer-glow-two"></div>

      {/* Decorative farm elements */}
      <motion.div
        className="farm-decoration farm-leaf-one"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -3, 0],
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
        className="farm-decoration farm-leaf-two"
        animate={{
          y: [0, 14, 0],
          rotate: [0, -6, 4, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌱
      </motion.div>

      <motion.div
        className="farm-decoration farm-wheat"
        animate={{
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌾
      </motion.div>

      {/* Top navigation */}
      <motion.header
        className="farmer-register-topbar"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link to="/" className="farmer-register-brand">
          <div className="farmer-register-brand-icon">
            <Leaf size={19} />
          </div>

          <span>
            Kissan<span>Connect</span>
          </span>
        </Link>

        <Link
          to="/Landing"
          className="farmer-register-back"
        >
          <ArrowLeft size={15} />
          Back to home
        </Link>
      </motion.header>

      {/* Main content */}
      <main className="farmer-register-main">

        <div className="farmer-register-wrapper">

          {/* LEFT SIDE */}
          <motion.section
            className="farmer-register-intro"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="farmer-register-badge">
              <Sprout size={15} />
              FARMER COMMUNITY
            </div>

            <h1>
              Grow your farm.
              <span> Grow your market.</span>
            </h1>

            <p className="farmer-register-description">
              Join a digital marketplace where farmers can
              connect directly with buyers, discover better
              opportunities and sell their produce smarter.
            </p>

            {/* Features */}
            <div className="farmer-register-features">

              <div className="farmer-register-feature">
                <div className="farmer-feature-icon">
                  <Wheat size={18} />
                </div>

                <div>
                  <strong>Sell your harvest</strong>
                  <span>
                    List your crops and reach potential buyers.
                  </span>
                </div>
              </div>

              <div className="farmer-register-feature">
                <div className="farmer-feature-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <strong>Find better connections</strong>
                  <span>
                    Connect with buyers looking for your crops.
                  </span>
                </div>
              </div>

              <div className="farmer-register-feature">
                <div className="farmer-feature-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Make informed decisions</strong>
                  <span>
                    Use market insights to understand opportunities.
                  </span>
                </div>
              </div>

            </div>

            {/* Small farmer visual */}
            <div className="farmer-mini-card">
              <div className="farmer-mini-icon">
                <Sprout size={21} />
              </div>

              <div>
                <strong>From your field to the market</strong>
                <span>
                  One platform for your farming journey.
                </span>
              </div>

              <div className="farmer-mini-status">
                <span></span>
                Connected
              </div>
            </div>
          </motion.section>

          {/* RIGHT SIDE */}
          <motion.section
            className="farmer-register-card"
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

            {/* Card header */}
            <div className="farmer-register-card-header">

              <div className="farmer-register-icon">
                <Sprout size={23} />
              </div>

              <div>
                <span>FARMER ACCOUNT</span>
                <h2>Create your account</h2>
              </div>

            </div>

            <p className="farmer-register-card-description">
              Start your journey towards smarter farming
              and better market connections.
            </p>

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="farmer-form-group">
                <label>Full name</label>

                <div className="farmer-input-wrapper">
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
              <div className="farmer-form-group">
                <label>Email address</label>

                <div className="farmer-input-wrapper">
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

              {/* Phone */}
              <div className="farmer-form-group">
                <label>Phone number</label>

                <div className="farmer-input-wrapper">
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
              <div className="farmer-form-group">
                <label>Farm location</label>

                <div className="farmer-input-wrapper">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="location"
                    placeholder="Village / City"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="farmer-form-group">
                <label>Password</label>

                <div className="farmer-input-wrapper">
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

              {/* Messages */}
              {message && (
                <motion.div
                  className="farmer-register-success"
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
                  {message}
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="farmer-register-error"
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
                className="farmer-register-button"
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
                    <span className="farmer-register-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Farmer Account
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>

            </form>

            {/* Footer */}
            <div className="farmer-register-footer">
              <span>
                Already have an account?
              </span>

              <Link to="/farmer/login">
                Login
              </Link>
            </div>

            <div className="farmer-register-security">
              <LockKeyhole size={13} />
              Your account information is securely protected
            </div>

          </motion.section>

        </div>
      </main>
    </div>
  );
}

export default FarmerRegister
