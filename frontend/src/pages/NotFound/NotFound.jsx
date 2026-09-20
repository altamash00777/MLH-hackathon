import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Wheat,
  Carrot,
  Apple,
  Sprout,
  Leaf,
  Cherry,
  Egg,
  Grape,
  Sun,
  Cloud,
} from "lucide-react";
import "./NotFound.css";

/* Floating produce: position is in %, delay/duration desync the bobbing */
const FLOATERS = [
  { Icon: Carrot, top: "14%", left: "8%", size: 44, color: "#d9752b", delay: 0, duration: 5.2 },
  { Icon: Apple, top: "62%", left: "5%", size: 40, color: "#b23a2b", delay: 0.8, duration: 4.6 },
  { Icon: Wheat, top: "30%", left: "18%", size: 48, color: "#c9962f", delay: 1.4, duration: 6 },
  { Icon: Sprout, top: "74%", left: "20%", size: 38, color: "#4f7a34", delay: 0.3, duration: 5 },
  { Icon: Cherry, top: "12%", left: "80%", size: 38, color: "#9b2d3a", delay: 1.1, duration: 4.8 },
  { Icon: Grape, top: "44%", left: "90%", size: 42, color: "#6d4a8a", delay: 0.5, duration: 5.6 },
  { Icon: Egg, top: "70%", left: "82%", size: 36, color: "#e8d9b0", delay: 1.7, duration: 4.4 },
  { Icon: Leaf, top: "26%", left: "70%", size: 40, color: "#5d8c3a", delay: 0.9, duration: 5.8 },
];

function NotFound() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <main className="nf-page">
      {/* Sun + clouds */}
      <motion.div
        className="nf-sun"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <Sun size={110} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="nf-cloud nf-cloud-a"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud size={90} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="nf-cloud nf-cloud-b"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud size={64} strokeWidth={1.5} />
      </motion.div>

      {/* Floating produce */}
      {FLOATERS.map(({ Icon, top, left, size, color, delay, duration }, i) => (
        <motion.span
          key={i}
          className="nf-floater"
          aria-hidden="true"
          style={{ top, left, color }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={
            reduceMotion
              ? { opacity: 0.9, scale: 1 }
              : {
                  opacity: 0.9,
                  scale: 1,
                  y: [0, -18, 0],
                  rotate: [-8, 8, -8],
                }
          }
          transition={{
            opacity: { delay: 0.4 + delay * 0.3, duration: 0.6 },
            scale: { delay: 0.4 + delay * 0.3, type: "spring", stiffness: 160 },
            y: { delay, duration, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay, duration: duration * 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.25, rotate: 0 }}
        >
          <Icon size={size} strokeWidth={1.8} />
        </motion.span>
      ))}

      {/* Main content */}
      <section className="nf-content">
        <div className="nf-digits" role="img" aria-label="Error 404">
          <motion.span
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
          >
            4
          </motion.span>

          {/* The hay bale "0" rolls in from the left */}
          <motion.span
            className="nf-bale"
            initial={{ x: "-60vw", rotate: -540 }}
            animate={{ x: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 40, damping: 12, mass: 1.4, delay: 0.3 }}
            whileHover={reduceMotion ? undefined : { rotate: 30 }}
          >
            <span className="nf-bale-hole" />
          </motion.span>

          <motion.span
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
          >
            4
          </motion.span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          Nothing's growing at this address
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.5 }}
        >
          This page was moved or never planted. Head back to the market
          for fresh produce straight from the farm.
        </motion.p>

        <motion.div
          className="nf-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.button
            type="button"
            className="nf-btn nf-btn-primary"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wheat size={20} aria-hidden="true" />
            Back to the market
          </motion.button>

          <motion.button
            type="button"
            className="nf-btn nf-btn-ghost"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go back
          </motion.button>
        </motion.div>
      </section>

      {/* Rolling hills */}
      <svg
        className="nf-hills"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="nf-hill-back"
          d="M0,120 C240,40 480,40 720,100 C960,160 1200,150 1440,80 L1440,220 L0,220 Z"
        />
        <path
          className="nf-hill-front"
          d="M0,170 C260,110 520,120 760,160 C1000,200 1220,180 1440,130 L1440,220 L0,220 Z"
        />
      </svg>
    </main>
  );
}

export default NotFound;
