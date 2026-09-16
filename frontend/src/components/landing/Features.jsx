import "./Features.css";
import { motion } from "framer-motion";
import {
  Wheat,
  TrendingUp,
  BrainCircuit,
  Handshake,
  Gavel,
  Users,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Wheat,
    tag: "MATCHING",
    title: "Smart Crop Matching",
    description:
      "Connect farmers with buyers based on crop, quality, grade, location and price.",
    className: "green-feature",
  },
  {
    icon: TrendingUp,
    tag: "MARKET",
    title: "Mandi Price Intelligence",
    description:
      "Track market prices and discover better opportunities before selling your produce.",
    className: "orange-feature",
  },
  {
    icon: BrainCircuit,
    tag: "AI POWERED",
    title: "AI Price Prediction",
    description:
      "Get intelligent price predictions and recommended price ranges for your crops.",
    className: "green-feature",
  },
  {
    icon: Handshake,
    tag: "CONNECTION",
    title: "Direct Buyer Connection",
    description:
      "Build direct connections with verified buyers without unnecessary middlemen.",
    className: "orange-feature",
  },
  {
    icon: Gavel,
    tag: "BIDDING",
    title: "Smart Bidding",
    description:
      "Let multiple buyers compete for your produce and choose the best offer.",
    className: "green-feature",
  },
  {
    icon: Users,
    tag: "COLLECTIVE",
    title: "FPO & Group Selling",
    description:
      "Join with other farmers to combine produce and fulfill larger buyer requirements.",
    className: "orange-feature",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const Features = () => {
  return (
    <section className="features-section" id="features">

      {/* Background decoration */}
      <div className="feature-glow feature-glow-1"></div>
      <div className="feature-glow feature-glow-2"></div>

      {/* Heading */}
      <motion.div
        className="features-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          WHY KISSANCONNECT
        </span>

        <h2>
          Everything You Need to
          <span> Trade Smarter</span>
        </h2>

        <p>
          Powerful tools designed to help farmers get better opportunities
          and help buyers find the right produce faster.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              className={`feature-card ${feature.className}`}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.25 },
              }}
              key={feature.title}
            >
              {/* Number */}
              <span className="feature-number">
                0{index + 1}
              </span>

              {/* Icon */}
              <div className="feature-icon">
                <Icon size={25} />
              </div>

              {/* Content */}
              <div className="feature-content">
                <span className="feature-tag">
                  {feature.tag}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>

              {/* Arrow */}
              <div className="feature-arrow">
                <ArrowUpRight size={19} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
};

export default Features;