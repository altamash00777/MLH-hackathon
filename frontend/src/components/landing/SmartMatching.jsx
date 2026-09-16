import "./SmartMatching.css";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Wheat,
  MapPin,
  BadgeCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const SmartMatching = () => {
  return (
    <section className="smart-section" id="smart-matching">

      {/* Background glow */}
      <div className="smart-glow smart-glow-1"></div>
      <div className="smart-glow smart-glow-2"></div>

      {/* Heading */}
      <motion.div
        className="smart-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          INTELLIGENT MATCHING
        </span>

        <h2>
          The Right Crop.
          <span> The Right Buyer.</span>
        </h2>

        <p>
          Our smart matching system analyzes multiple factors to find
          the most suitable connection between farmers and buyers.
        </p>
      </motion.div>


      {/* Matching showcase */}
      <div className="smart-showcase">

        {/* Farmer Listing */}
        <motion.div
          className="listing-card farmer-listing"
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="listing-top">
            <span className="listing-label">FARMER LISTING</span>

            <div className="verified-small">
              <BadgeCheck size={15} />
              Verified
            </div>
          </div>

          <div className="crop-header">
            <div className="crop-icon">
              <Wheat size={25} />
            </div>

            <div>
              <h3>Premium Wheat</h3>
              <span>Grade A • High Quality</span>
            </div>
          </div>

          <div className="listing-details">

            <div>
              <small>QUANTITY</small>
              <strong>500 Q</strong>
            </div>

            <div>
              <small>EXPECTED PRICE</small>
              <strong>₹2,750 / Q</strong>
            </div>

            <div>
              <small>LOCATION</small>
              <strong>
                <MapPin size={13} />
                Lucknow
              </strong>
            </div>

            <div>
              <small>QUALITY</small>
              <strong>Premium</strong>
            </div>

          </div>
        </motion.div>


        {/* Center Matching Engine */}
        <motion.div
          className="smart-engine"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >

          <motion.div
            className="engine-orbit orbit-one"
            animate={{ rotate: 360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="engine-orbit orbit-two"
            animate={{ rotate: -360 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="engine-core">
            <BrainCircuit size={32} />

            <span>SMART</span>
            <strong>94%</strong>
            <small>MATCH</small>
          </div>

          {/* Connection particles */}
          <motion.div
            className="match-particle particle-one"
            animate={{ x: [0, 80, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <motion.div
            className="match-particle particle-two"
            animate={{ x: [0, -80, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
            }}
          />

        </motion.div>


        {/* Buyer Requirement */}
        <motion.div
          className="listing-card buyer-listing"
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div className="listing-top">
            <span className="listing-label">BUYER REQUIREMENT</span>

            <div className="buyer-status">
              Active
            </div>
          </div>

          <div className="crop-header">
            <div className="crop-icon buyer-crop-icon">
              <TrendingUp size={25} />
            </div>

            <div>
              <h3>Wheat Requirement</h3>
              <span>Grade A • Premium Quality</span>
            </div>
          </div>

          <div className="listing-details">

            <div>
              <small>REQUIRED</small>
              <strong>400 Q</strong>
            </div>

            <div>
              <small>OFFER PRICE</small>
              <strong>₹2,850 / Q</strong>
            </div>

            <div>
              <small>LOCATION</small>
              <strong>
                <MapPin size={13} />
                Lucknow
              </strong>
            </div>

            <div>
              <small>QUALITY</small>
              <strong>Premium</strong>
            </div>

          </div>
        </motion.div>

      </div>


      {/* Matching factors */}
      <motion.div
        className="matching-factors"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >

        <div className="factor-title">
          <span>HOW THE MATCH IS CALCULATED</span>
        </div>

        <div className="factor-list">

          <div>
            <CheckCircle2 size={17} />
            <span>Crop</span>
            <strong>30%</strong>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>Quality</span>
            <strong>20%</strong>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>Grade</span>
            <strong>15%</strong>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>Location</span>
            <strong>15%</strong>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>Price</span>
            <strong>20%</strong>
          </div>

        </div>

      </motion.div>


      {/* Bottom statement */}
      <motion.div
        className="smart-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span>
          One platform. Smarter connections.
        </span>

        <ArrowRight size={18} />

        <strong>
          Better opportunities for everyone.
        </strong>
      </motion.div>

    </section>
  );
};

export default SmartMatching;