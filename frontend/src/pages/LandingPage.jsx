// src/pages/LandingPage.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  ShoppingCart,
  Sprout,
  TrendingUp,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import SmartMatching from "../components/landing/SmartMatching";
import MarketIntelligence from "../components/landing/MarketIntelligence";
import farmImage from "../assets/f.jpeg"

const LandingPage = () => {
  const navigate = useNavigate();

  // Login dropdown state
  const [loginOpen, setLoginOpen] = useState(false);

  return (



    <div className="landing-page">


      {/* Background decorations */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      {/* ================= NAVBAR ================= */}

      <motion.nav
        className="landing-navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >

        {/* Logo */}
        <div className="logo">

          <div className="logo-icon">
            <Leaf size={24} />
          </div>

          <span>
            Dish<span>aa</span>
          </span>

        </div>


        {/* Navigation Links */}
        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#about">
            About
          </a>

        </div>


        {/* ================= LOGIN DROPDOWN ================= */}

        <div className="login-dropdown-wrapper">

          {/* Login Button */}

          <button
            className={`nav-login ${
              loginOpen ? "login-active" : ""
            }`}
            onClick={() => setLoginOpen(!loginOpen)}
          >

            Login

            <ChevronDown
              size={17}
              className={`login-chevron ${
                loginOpen ? "rotate" : ""
              }`}
            />

          </button>


          {/* Dropdown */}

          {loginOpen && (

            <motion.div
              className="login-dropdown"

              initial={{
                opacity: 0,
                y: -10,
                scale: 0.95,
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}

              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >

              {/* Heading */}

              <div className="dropdown-heading">

                <span>
                  Welcome back
                </span>

                <small>
                  Choose your account
                </small>

              </div>


              {/* ================= FARMER LOGIN ================= */}

              <button
                className="login-option farmer-login-option"

                onClick={() => {
                  setLoginOpen(false);
                  navigate("/farmer/login");
                }}
              >

                <div className="login-option-icon farmer-option-icon">
                  <Sprout size={20} />
                </div>


                <div className="login-option-content">

                  <strong>
                    Farmer Login
                  </strong>

                  <span>
                    Manage your crops & sales
                  </span>

                </div>


                <ArrowRight
                  size={17}
                  className="login-option-arrow"
                />

              </button>


              {/* ================= BUYER LOGIN ================= */}

              <button
                className="login-option buyer-login-option"

                onClick={() => {
                  setLoginOpen(false);
                  navigate("/buyer/login");
                }}
              >

                <div className="login-option-icon buyer-option-icon">
                  <ShoppingCart size={20} />
                </div>


                <div className="login-option-content">

                  <strong>
                    Buyer Login
                  </strong>

                  <span>
                    Find crops & manage requirements
                  </span>

                </div>


                <ArrowRight
                  size={17}
                  className="login-option-arrow"
                />

              </button>


              {/* ================= REGISTER ================= */}

              <div className="dropdown-footer">

                <UserRound size={15} />

                <span>
                  Don't have an account?
                </span>

              </div>


              <div className="dropdown-register-links">

                <button
                  onClick={() => {
                    setLoginOpen(false);
                    navigate("/farmer/register");
                  }}
                >
                  Register as Farmer
                </button>

                <span>•</span>

                <button
                  onClick={() => {
                    setLoginOpen(false);
                    navigate("/buyer/register");
                  }}
                >
                  Register as Buyer
                </button>

              </div>

            </motion.div>

          )}

        </div>

      </motion.nav>



      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">


          {/* Badge */}

          <motion.div
            className="hero-badge"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.3,
            }}
          >

            <Sprout size={17} />

            Smart Agriculture Marketplace

          </motion.div>



          {/* Heading */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 40,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.45,
              duration: 0.8,
            }}
          >

            From the

            <span>
              {" "}Farm{" "}
            </span>

            to the

            <span className="orange-text">
              {" "}Right Market.
            </span>

          </motion.h1>



          {/* Description */}

          <motion.p
            className="hero-description"

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
          >

            KissanConnect brings farmers and buyers together through
            smart matching, market insights, transparent pricing and
            direct connections.

          </motion.p>



          {/* ================= ROLE CARDS ================= */}

          <motion.div
            className="role-container"

            initial={{
              opacity: 0,
              y: 40,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              delay: 0.9,
              duration: 0.8,
            }}
          >


            {/* Farmer */}

            <div
              className="role-card farmer-card"

              onClick={() =>
                navigate("/farmer/register")
              }
            >

              <div className="role-icon farmer-icon">
                <Sprout size={28} />
              </div>


              <div className="role-info">

                <span className="role-label">
                  FOR FARMERS
                </span>

                <h3>
                  Sell Your Crops
                </h3>

                <p>
                  Find the right buyers and discover better opportunities.
                </p>

              </div>


              <div className="role-arrow">
                <ArrowRight size={20} />
              </div>

            </div>



            {/* Buyer */}

            <div
              className="role-card buyer-card"

              onClick={() =>
                navigate("/buyer/register")
              }
            >

              <div className="role-icon buyer-icon">
                <ShoppingCart size={27} />
              </div>


              <div className="role-info">

                <span className="role-label">
                  FOR BUYERS
                </span>

                <h3>
                  Find Quality Crops
                </h3>

                <p>
                  Discover farmers and match your exact requirements.
                </p>

              </div>


              <div className="role-arrow">
                <ArrowRight size={20} />
              </div>

            </div>

          </motion.div>



          {/* Hero Login */}

          <motion.div
            className="hero-login-text"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            transition={{
              delay: 1.2,
            }}
          >

            Already have an account?

            <button
              onClick={() => setLoginOpen(!loginOpen)}
            >
              Login here
            </button>

          </motion.div>

        </div>



        {/* ================= RIGHT VISUAL ================= */}

        <motion.div
          className="hero-visual"

          initial={{
            opacity: 0,
            scale: 0.8,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            duration: 1.1,
            delay: 0.4,
          }}
        >

          <div className="visual-circle circle-main">

            {/* <div className="farm-emoji">
              🌾
            </div> */}
<div className="farm-circle">
  <img src={farmImage} alt="Farmer" 
  className="farm-image" />
</div>          </div>



          {/* Market Price */}

          <motion.div
            className="floating-card price-card"

            animate={{
              y: [0, -12, 0],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <TrendingUp size={19} />

            <div>

              <small>
                Market Price
              </small>

              <strong>
                ₹2,850 / Q
              </strong>

            </div>

          </motion.div>



          {/* Smart Match */}

          <motion.div
            className="floating-card match-card"

            animate={{
              y: [0, 10, 0],
            }}

            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <div className="match-score">
              94%
            </div>

            <div>

              <small>
                Smart Match
              </small>

              <strong>
                Perfect Buyer
              </strong>

            </div>

          </motion.div>



          {/* Floating leaves */}

          <motion.div
            className="floating-leaf leaf-1"

            animate={{
              rotate: [0, 12, -8, 0],
            }}

            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          >
            🍃
          </motion.div>


          <motion.div
            className="floating-leaf leaf-2"

            animate={{
              rotate: [0, -15, 10, 0],
            }}

            transition={{
              duration: 7,
              repeat: Infinity,
            }}
          >
            🌿
          </motion.div>

        </motion.div>

      </section>



      {/* ================= SCROLL INDICATOR ================= */}

      <motion.div
        className="scroll-indicator"

        animate={{
          y: [0, 8, 0],
        }}

        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >

        <span>
          Scroll to explore
        </span>

        <div className="scroll-line"></div>

      </motion.div>



      {/* ================= LANDING SECTIONS ================= */}

      <HowItWorks />

      <Features />

      <SmartMatching />

      <MarketIntelligence />

    </div>
  );
};

export default LandingPage;