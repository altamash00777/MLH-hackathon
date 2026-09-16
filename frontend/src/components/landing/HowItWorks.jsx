// src/components/landing/HowItWorks.jsx
import "./HowItWorks.css"
import { motion } from "framer-motion";
import {
  UserPlus,
  Wheat,
  BrainCircuit,
  Handshake,
  ClipboardList,
  Search,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const HowItWorks = () => {
  return (
    <section className="how-section" id="how-it-works">

      {/* Heading */}
      <motion.div
        className="how-heading"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-tag">
          HOW IT WORKS
        </span>

        <h2>
          From <span>Farm</span> to
          <span className="orange-heading"> Market</span>
        </h2>

        <p>
          A smarter way to connect farmers and buyers,
          powered by intelligent matching and transparent
          market information.
        </p>
      </motion.div>


      {/* Main process */}
      <motion.div
        className="process-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >

        {/* Farmer side */}
        <motion.div
          className="process-column farmer-process"
          variants={itemVariants}
        >

          <div className="process-title">
            <div className="process-title-icon farmer-title-icon">
              <Wheat size={22} />
            </div>

            <div>
              <small>FOR FARMERS</small>
              <h3>Sell Smarter</h3>
            </div>
          </div>


          <div className="process-card">
            <div className="step-number">01</div>

            <div className="step-icon">
              <UserPlus size={22} />
            </div>

            <div>
              <h4>Create Your Account</h4>

              <p>
                Register as a farmer and create
                your marketplace profile.
              </p>
            </div>
          </div>


          <div className="process-connector">
            <ArrowDown size={17} />
          </div>


          <div className="process-card">
            <div className="step-number">02</div>

            <div className="step-icon">
              <Wheat size={22} />
            </div>

            <div>
              <h4>List Your Crop</h4>

              <p>
                Add crop, quantity, quality, grade,
                location and expected price.
              </p>
            </div>
          </div>


          <div className="process-connector">
            <ArrowDown size={17} />
          </div>


          <div className="process-card">
            <div className="step-number">03</div>

            <div className="step-icon">
              <Handshake size={22} />
            </div>

            <div>
              <h4>Connect With Buyers</h4>

              <p>
                Discover buyers whose requirements
                match your crop.
              </p>
            </div>
          </div>

        </motion.div>


        {/* Center matching engine */}
        <motion.div
          className="matching-center"
          variants={itemVariants}
        >

          <div className="matching-line left-line">
            <span></span>
          </div>


          <motion.div
            className="matching-orb"
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <div className="matching-icon">
              <BrainCircuit size={34} />
            </div>

            <div className="matching-content">
              <span>SMART</span>

              <h3>Matching</h3>

              <p>
                Finding the right
                connection
              </p>
            </div>

          </motion.div>


          <div className="match-factors">

            <div>
              <CheckCircle2 size={15} />
              Crop
            </div>

            <div>
              <CheckCircle2 size={15} />
              Quality
            </div>

            <div>
              <CheckCircle2 size={15} />
              Grade
            </div>

            <div>
              <CheckCircle2 size={15} />
              Location
            </div>

            <div>
              <CheckCircle2 size={15} />
              Price
            </div>

          </div>


          <div className="match-score-big">
            <span>92%</span>
            <small>Match Score</small>
          </div>


          <div className="matching-line right-line">
            <span></span>
          </div>

        </motion.div>


        {/* Buyer side */}
        <motion.div
          className="process-column buyer-process"
          variants={itemVariants}
        >

          <div className="process-title">
            <div className="process-title-icon buyer-title-icon">
              <Search size={22} />
            </div>

            <div>
              <small>FOR BUYERS</small>
              <h3>Buy Better</h3>
            </div>
          </div>


          <div className="process-card">
            <div className="step-number">01</div>

            <div className="step-icon buyer-step-icon">
              <UserPlus size={22} />
            </div>

            <div>
              <h4>Create Your Account</h4>

              <p>
                Register as a buyer and tell us
                what you're looking for.
              </p>
            </div>
          </div>


          <div className="process-connector">
            <ArrowDown size={17} />
          </div>


          <div className="process-card">
            <div className="step-number">02</div>

            <div className="step-icon buyer-step-icon">
              <ClipboardList size={22} />
            </div>

            <div>
              <h4>Post Your Requirement</h4>

              <p>
                Specify crop, quantity, quality,
                grade, location and price.
              </p>
            </div>
          </div>


          <div className="process-connector">
            <ArrowDown size={17} />
          </div>


          <div className="process-card">
            <div className="step-number">03</div>

            <div className="step-icon buyer-step-icon">
              <Handshake size={22} />
            </div>

            <div>
              <h4>Find Matching Farmers</h4>

              <p>
                Get matched with farmers who
                meet your requirements.
              </p>
            </div>
          </div>

        </motion.div>

      </motion.div>

    </section>
  );
};

export default HowItWorks;