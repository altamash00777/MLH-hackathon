// src/pages/buyer/BuyerLogin.jsx



import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./BuyerLogin.css"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Mail,
  Search,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import "./BuyerLogin.css";

function BuyerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      // Make sure this is actually a buyer
      if (user.role !== "buyer") {
        setError("This account is not a buyer account.");
        return;
      }

      // Save authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Go to buyer dashboard
      navigate("/buyer/dashboard");

    } catch (error) {
      console.error("Buyer Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-auth-page">

      {/* ================= BACKGROUND ================= */}

      <div className="buyer-auth-grid"></div>

      <div className="buyer-auth-glow buyer-glow-one"></div>
      <div className="buyer-auth-glow buyer-glow-two"></div>


      {/* Floating decorations */}

      <motion.div
        className="buyer-floating-icon buyer-float-one"
        animate={{
          y: [0, -14, 0],
          rotate: [0, 5, -4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🛒
      </motion.div>


      <motion.div
        className="buyer-floating-icon buyer-float-two"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -6, 4, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌾
      </motion.div>


      {/* ================= TOP BAR ================= */}

      <motion.div
        className="buyer-auth-topbar"

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
          className="buyer-auth-brand"
        >

          <div className="buyer-brand-icon">
            <Leaf size={20} />
          </div>

          <span>
            Kissan<span>Connect</span>
          </span>

        </Link>


        <Link
          to="/Landing"
          className="buyer-back-home"
        >

          <ArrowLeft size={15} />

          Back to home

        </Link>

      </motion.div>


      {/* ================= MAIN ================= */}

      <main className="buyer-auth-main">

        <div className="buyer-auth-wrapper">


          {/* ================= LEFT INTRO ================= */}

          <motion.div
            className="buyer-auth-intro"

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

            <div className="buyer-intro-badge">

              <ShoppingCart size={15} />

              BUYER MARKETPLACE

            </div>


            <h1>

              Source smarter.

              <span>
                {" "}Buy better.
              </span>

            </h1>


            <p className="buyer-intro-description">

              Discover quality crops directly from farmers,
              post your requirements and build reliable
              supply connections.

            </p>


            {/* ================= BENEFITS ================= */}

            <div className="buyer-intro-features">


              <div className="buyer-intro-feature">

                <div className="buyer-feature-icon">
                  <Search size={17} />
                </div>

                <div>

                  <strong>
                    Find the right crops
                  </strong>

                  <span>
                    Discover produce matching your requirements.
                  </span>

                </div>

              </div>


              <div className="buyer-intro-feature">

                <div className="buyer-feature-icon">
                  <TrendingUp size={17} />
                </div>

                <div>

                  <strong>
                    Track market prices
                  </strong>

                  <span>
                    Understand current mandi prices and trends.
                  </span>

                </div>

              </div>


              <div className="buyer-intro-feature">

                <div className="buyer-feature-icon">
                  <CheckCircle2 size={17} />
                </div>

                <div>

                  <strong>
                    Connect with farmers
                  </strong>

                  <span>
                    Build direct and reliable sourcing connections.
                  </span>

                </div>

              </div>


            </div>

          </motion.div>


          {/* ================= LOGIN CARD ================= */}

          <motion.div
            className="buyer-login-card"

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


            {/* CARD HEADER */}

            <div className="buyer-login-card-header">

              <div className="buyer-login-icon">
                <Building2 size={23} />
              </div>

              <div>

                <span>
                  BUYER ACCOUNT
                </span>

                <h2>
                  Welcome back
                </h2>

              </div>

            </div>


            <p className="buyer-login-description">

              Login to manage your requirements,
              discover farmers and grow your supply network.

            </p>


            {/* ================= FORM ================= */}

            <form onSubmit={handleSubmit}>


              {/* EMAIL */}

              <div className="buyer-form-group">

                <label>
                  Email address
                </label>

                <div className="buyer-input-wrapper">

                  <Mail size={17} />

                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="buyer-form-group">

                <label>
                  Password
                </label>

                <div className="buyer-input-wrapper">

                  <LockKeyhole size={17} />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (

                <motion.div
                  className="buyer-login-error"

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


              {/* LOGIN BUTTON */}

              <motion.button
                type="submit"
                className="buyer-login-button"

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
                    <span className="buyer-login-spinner"></span>
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


            {/* ================= FOOTER ================= */}

            <div className="buyer-login-footer">

              <span>
                Don't have a buyer account?
              </span>

              <Link to="/buyer/register">
                Create account
              </Link>

            </div>


            {/* ================= SECURITY ================= */}

            <div className="buyer-login-security">

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

export default BuyerLogin;
