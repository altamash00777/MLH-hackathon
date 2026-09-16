import "./MarketIntelligence.css";
import { motion } from "framer-motion";
import {
  TrendingUp,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  BarChart3,
  IndianRupee,
} from "lucide-react";

const MarketIntelligence = () => {
  return (
    <section className="market-section" id="market-intelligence">

      {/* Background decoration */}
      <div className="market-glow market-glow-1"></div>
      <div className="market-glow market-glow-2"></div>

      {/* Heading */}
      <motion.div
        className="market-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          MARKET INTELLIGENCE
        </span>

        <h2>
          Know the Market.
          <span> Sell at the Right Time.</span>
        </h2>

        <p>
          Stay informed with mandi prices, market trends and intelligent
          insights to make better selling decisions.
        </p>
      </motion.div>


      {/* Main dashboard */}
      <motion.div
        className="market-dashboard"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >

        {/* Dashboard header */}
        <div className="market-topbar">

          <div className="market-location">
            <div className="market-location-icon">
              <MapPin size={18} />
            </div>

            <div>
              <small>MARKET</small>
              <strong>Lucknow Mandi</strong>
            </div>
          </div>

          <div className="market-date">
            <CalendarDays size={16} />
            <span>Today</span>
          </div>

        </div>


        {/* Price overview */}
        <div className="price-overview">

          <div className="current-price">

            <div className="price-label">
              <span>WHEAT PRICE</span>

              <div className="price-up">
                <TrendingUp size={14} />
                +8.4%
              </div>
            </div>

            <div className="price-value">
              <IndianRupee size={28} />
              2,850
              <small>/ Quintal</small>
            </div>

            <p>
              Market price increased compared to last week.
            </p>

          </div>


          {/* Mini stats */}
          <div className="price-stats">

            <div className="price-stat">
              <span>MIN PRICE</span>
              <strong>₹2,680</strong>
            </div>

            <div className="price-stat">
              <span>MAX PRICE</span>
              <strong>₹2,940</strong>
            </div>

            <div className="price-stat">
              <span>AVG PRICE</span>
              <strong>₹2,810</strong>
            </div>

          </div>

        </div>


        {/* Chart */}
        <div className="market-chart">

          <div className="chart-header">

            <div>
              <span>PRICE TREND</span>
              <strong>Last 7 Days</strong>
            </div>

            <BarChart3 size={20} />

          </div>


          <div className="chart-area">

            <div className="chart-y-axis">
              <span>3000</span>
              <span>2900</span>
              <span>2800</span>
              <span>2700</span>
              <span>2600</span>
            </div>


            <div className="chart">

              <div className="chart-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <svg
                className="price-line"
                viewBox="0 0 700 230"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgba(63,145,73,0.25)"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgba(63,145,73,0)"
                    />
                  </linearGradient>
                </defs>

                <path
                  className="chart-fill"
                  d="
                    M0 170
                    L100 155
                    L200 175
                    L300 125
                    L400 140
                    L500 85
                    L600 100
                    L700 45
                    L700 230
                    L0 230
                    Z
                  "
                />

                <path
                  className="chart-stroke"
                  d="
                    M0 170
                    L100 155
                    L200 175
                    L300 125
                    L400 140
                    L500 85
                    L600 100
                    L700 45
                  "
                />

                <circle cx="700" cy="45" r="6" />
              </svg>

              <div className="chart-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

            </div>

          </div>

        </div>


        {/* Market insight */}
        <motion.div
          className="market-insight"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >

          <div className="insight-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>MARKET INSIGHT</span>

            <p>
              Wheat prices are showing an upward trend.
              Consider monitoring the market before selling.
            </p>
          </div>

          <ArrowUpRight className="insight-arrow" size={20} />

        </motion.div>

      </motion.div>

    </section>
  );
};

export default MarketIntelligence;