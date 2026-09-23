import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Bell,
  User,
  Wheat,
  Sprout,
  Handshake,
  IndianRupee,
  TrendingUp,
  MapPin,
  Plus,
  ArrowRight,
  Package,
  ShoppingBasket,
  BarChart3,
  ChevronDown,
  Leaf,
} from "lucide-react";
import landBg from "../../assets/LAND.JPG";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import './FarmerDashboard.css'
import wheatImage from "../../assets/crop.png";
import listImage from "../../assets/listing.png";
import hand from "../../assets/handshake.png"
import rupees from "../../assets/rupees.png"


function FarmerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);


  const [cropName, setCropName] = useState("");
  const [mandiName, setMandiName] = useState("");
  const [period, setPeriod] = useState("30");

  const [showMandiSuggestions, setShowMandiSuggestions] =
    useState(false);

  const [priceData, setPriceData] = useState([]);
  const [showPriceTrend, setShowPriceTrend] = useState(false);

  // =========================
  // MANDI DATA
  // =========================

  const mandiList = [
    "Varanasi",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Prayagraj",
    "Gorakhpur",
    "Ayodhya",
    "Meerut",
    "Bareilly",
    "Jaunpur",
  ];

  // =========================
  // ANIMATION VARIANTS
  // =========================

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User parsing error:", error);
      }
    }

    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get("/farmer/listings");

      console.log("Dashboard crops:", response.data);

      const data = response.data.listings || response.data;

      setCrops(data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };
  const totalCrops = crops.length;

  const activeCrops = crops.filter(
    (crop) => crop.status === "active"
  ).length;

  const matchedCrops = crops.filter(
    (crop) => crop.status === "matched"
  ).length;

  const soldCrops = crops.filter(
    (crop) => crop.status === "sold"
  ).length;

  // =========================
  // MANDI SEARCH
  // =========================

  const filteredMandis = mandiList.filter((mandi) =>
    mandi.toLowerCase().includes(mandiName.toLowerCase())
  );

  // =========================
  // PRICE DATA
  // =========================

  const generatePriceData = () => {
    return [
      { date: "20 Aug", price: 2400 },
      { date: "21 Aug", price: 2500 },
      { date: "22 Aug", price: 2600 },
      { date: "23 Aug", price: 2550 },
      { date: "24 Aug", price: 2700 },
      { date: "25 Aug", price: 2800 },
    ];
  };

  // =========================
  // VIEW PRICE TREND
  // =========================

  const handleViewPriceTrend = () => {
    if (!cropName.trim() || !mandiName.trim()) {
      return;
    }

    const data = generatePriceData();

    setPriceData(data);
    setShowPriceTrend(true);

    console.log("Crop:", cropName);
    console.log("Mandi:", mandiName);
    console.log("Period:", period);
  };

  // =========================
  // PRICE HELPERS
  // =========================

  const maxPrice =
    priceData.length > 0
      ? Math.max(...priceData.map((item) => item.price))
      : 0;

  const minPrice =
    priceData.length > 0
      ? Math.min(...priceData.map((item) => item.price))
      : 0;

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    if (status === "active") return "status-active";
    if (status === "matched") return "status-matched";
    if (status === "sold") return "status-sold";

    return "status-inactive";
  };

  return (
    <div className="dashboard-layout">

      <div className="background-orb green"></div>
      <div className="background-orb orange"></div>


      <Sidebar />

      {/* =========================
          MAIN
      ========================= */}

      {/* <main className="dashboard-main"> */}
  <main
    className="dashboard-main my-crops-page"
    style={{
      backgroundImage: `url(${landBg})`,
    }}
  >
        {/* =========================
            HEADER
        ========================= */}

        <motion.div
          className="dashboard-header"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="dashboard-heading">

            <span className="dashboard-eyebrow">
              <Leaf size={13} />
              FARMER DASHBOARD
            </span>

            <h1>
              Welcome,{" "}
              <span>
                {user?.name || "Farmer"}
              </span>{" "}
              👋
            </h1>

            <p>
              Manage your crops, track market prices and connect
              with potential buyers.
            </p>

          </div>

          <div className="header-actions">

            {/* Notification */}

            <motion.button
              className="notification-button"
              onClick={() =>
                navigate("/farmer/notifications")
              }
              title="Notifications"
              whileHover={{
                scale: 1.08,
                y: -2,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Bell size={19} />

              <span className="notification-dot"></span>
            </motion.button>

            {/* Profile */}

            <motion.div
              className="profile-circle"
              onClick={() =>
                navigate("/farmer/profile")
              }
              title="View Profile"
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "F"}
            </motion.div>

          </div>
        </motion.div>

        {/* =========================
            STAT CARDS
        ========================= */}

        <motion.div
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >

          {/* TOTAL */}

          <motion.div
            className="stat-card stat-green"
            variants={cardVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <div className="stat-card-top">

              {/* <div className="stat-icon">
                <Wheat size={20} />
              </div> */}
<div className="stat-icon">
  <img src={wheatImage} alt="Wheat" />
</div>


              <span className="stat-label">
                TOTAL
              </span>

            </div>

            <div className="stat-bottom">

              <h2>
                {loading ? "..." : totalCrops}
              </h2>

              <span>
                Crop Listings
              </span>

            </div>
          </motion.div>


          {/* ACTIVE */}

          <motion.div
            className="stat-card stat-active-card"
            variants={cardVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <div className="stat-card-top">

<div className="stat-icon">
  <img src={listImage} alt="Sprout" />
</div>

              <span className="stat-label">
                ACTIVE
              </span>

            </div>

            <div className="stat-bottom">

              <h2>
                {loading ? "..." : activeCrops}
              </h2>

              <span>
                Available
              </span>

            </div>
          </motion.div>


          {/* MATCHED */}

          <motion.div
            className="stat-card stat-match-card"
            variants={cardVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <div className="stat-card-top">

<div className="stat-icon">
  <img src={hand} alt="Handshake" />
</div>

              <span className="stat-label">
                MATCHED
              </span>

            </div>

            <div className="stat-bottom">

              <h2>
                {loading ? "..." : matchedCrops}
              </h2>

              <span>
                Buyer Matches
              </span>

            </div>
          </motion.div>


          {/* SOLD */}

          <motion.div
            className="stat-card stat-sold-card"
            variants={cardVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <div className="stat-card-top">

              {/* <div className="stat-icon">
                <IndianRupee size={20} />
              </div> */}
<div className="stat-icon">
  <img src={rupees} alt="paisa" />
</div>
              <span className="stat-label">
                SOLD
              </span>

            </div>

            <div className="stat-bottom">

              <h2>
                {loading ? "..." : soldCrops}
              </h2>

              <span>
                Completed
              </span>

            </div>
          </motion.div>

        </motion.div>


        {/* =========================
            MARKET PRICE
        ========================= */}

        <motion.section
          className="dashboard-section market-price-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >

          <div className="section-header compact-header">

            <div>
              <span className="section-tag">
                MARKET INTELLIGENCE
              </span>

              <h2>
                Market Prices
              </h2>

              <p>
                Check historical mandi prices for your crop.
              </p>
            </div>

            <div className="section-header-icon">
              <TrendingUp size={22} />
            </div>

          </div>


       
            </motion.section>
          


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <motion.section
          className="dashboard-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >

          <div className="section-header compact-header">

            <div>

              <span className="section-tag">
                QUICK ACCESS
              </span>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your marketplace activities.
              </p>

            </div>

          </div>


          <motion.div
            className="action-grid"
            variants={containerVariants}
          >

            {/* ADD CROP */}

            <motion.div
              className="action-card quick-action-item"
              variants={cardVariants}
              whileHover={{
                y: -7,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                navigate("/farmer/add-crop")
              }
            >

              <div className="action-card-top">

                <div className="action-icon">
                  <Plus size={21} />
                </div>

                <ArrowRight
                  className="action-arrow"
                  size={18}
                />

              </div>

              <h3>
                Add New Crop
              </h3>

              <p>
                List your crop and reach potential
                buyers.
              </p>

              <span className="action-link">
                Add Crop
                <ArrowRight size={14} />
              </span>

            </motion.div>


            {/* MY CROPS */}

            <motion.div
              className="action-card quick-action-item"
              variants={cardVariants}
              whileHover={{
                y: -7,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                navigate("/farmer/crops")
              }
            >

              <div className="action-card-top">

                <div className="action-icon">
                  <Package size={21} />
                </div>

                <ArrowRight
                  className="action-arrow"
                  size={18}
                />

              </div>

              <h3>
                My Crops
              </h3>

              <p>
                View and manage your crop listings.
              </p>

              <span className="action-link">
                View Crops
                <ArrowRight size={14} />
              </span>

            </motion.div>


            {/* NOTIFICATIONS */}

            <motion.div
              className="action-card quick-action-item"
              variants={cardVariants}
              whileHover={{
                y: -7,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                navigate("/farmer/notifications")
              }
            >

              <div className="action-card-top">

                <div className="action-icon">
                  <Bell size={21} />
                </div>

                <ArrowRight
                  className="action-arrow"
                  size={18}
                />

              </div>

              <h3>
                Notifications
              </h3>

              <p>
                Check buyer matches and marketplace
                updates.
              </p>

              <span className="action-link">
                View Updates
                <ArrowRight size={14} />
              </span>

            </motion.div>

          </motion.div>

        </motion.section>


        {/* =========================
            RECENT CROPS
        ========================= */}

        <motion.section
          className="dashboard-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >

          <div className="section-header compact-header">

            <div>

              <span className="section-tag">
                YOUR LISTINGS
              </span>

              <h2>
                Recent Crops
              </h2>

              <p>
                Your latest crop listings.
              </p>

            </div>

            {crops.length > 3 && (

              <motion.button
                className="section-view-button"
                onClick={() =>
                  navigate("/farmer/crops")
                }
                whileHover={{
                  x: 4,
                }}
              >
                View All
                <ArrowRight size={15} />
              </motion.button>

            )}

          </div>


          {/* EMPTY */}

          {crops.length === 0 &&
            !loading && (

              <motion.div
                className="empty-state"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >

                <div className="empty-icon">
                  <Sprout size={27} />
                </div>

                <h3>
                  No crops yet
                </h3>

                <p>
                  Add your first crop to start
                  connecting with buyers.
                </p>

                <motion.button
                  onClick={() =>
                    navigate("/farmer/add-crop")
                  }
                  whileHover={{
                    scale: 1.04,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Plus size={16} />
                  Add Crop
                </motion.button>

              </motion.div>
            )}


          {/* CROP CARDS */}

          {crops.length > 0 && (

            <motion.div
              className="my-crops-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >

              {crops
                .slice(0, 3)
                .map((crop) => (

                  <motion.div
                    className="my-crop-card"
                    key={crop._id}
                    variants={cardVariants}
                    whileHover={{
                      y: -6,
                    }}
                  >

                    <div className="my-crop-top">

                      <div className="my-crop-icon">
                        <Wheat size={19} />
                      </div>

                      <span
                        className={`my-crop-status ${getStatusClass(
                          crop.status
                        )}`}
                      >
                        {crop.status}
                      </span>

                    </div>


                    <div className="crop-title-row">

                      <div>

                        <span className="crop-label">
                          CROP LISTING
                        </span>

                        <h3>
                          {crop.cropName}
                        </h3>

                      </div>

                      <ShoppingBasket
                        size={18}
                        className="crop-basket-icon"
                      />

                    </div>


                    <div className="my-crop-info">

                      <div className="my-crop-info-item">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {crop.quantity} kg
                        </strong>

                      </div>


                      <div className="my-crop-info-item">

                        <span>
                          Price
                        </span>

                        <strong>
                          ₹
                          {crop.expectedPrice ||
                            "—"}
                        </strong>

                      </div>


                      <div className="my-crop-info-item">

                        <span>
                          Quality
                        </span>

                        <strong>
                          {crop.quality ||
                            "—"}
                        </strong>

                      </div>


                      <div className="my-crop-info-item">

                        <span>
                          Grade
                        </span>

                        <strong>
                          {crop.grade ||
                            "—"}
                        </strong>

                      </div>

                    </div>


                    <motion.button
                      className="crop-view-button"
                      onClick={() =>
                        navigate(
                          "/farmer/crops"
                        )
                      }
                      whileHover={{
                        x: 3,
                      }}
                    >
                      Manage Listing
                      <ArrowRight
                        size={14}
                      />
                    </motion.button>

                  </motion.div>

                ))}

            </motion.div>

          )}


        </motion.section>


        {crops.length > 3 && (

          <motion.button
            className="submit-button"
            onClick={() =>
              navigate("/farmer/crops")
            }
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            View All Crops
            <ArrowRight size={16} />
          </motion.button>

        )}

      </main>

    </div>
  );
}

export default FarmerDashboard;
