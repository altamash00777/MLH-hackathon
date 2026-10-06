
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Wheat,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Leaf,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import landBg from "../../assets/LAND.JPG";

import "./CropAnalyzer.css";

function CropAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    setResult(null);
    setError("");
  };

  const analyzeWheat = async () => {
    if (!selectedFile) {
      setError("Please select a wheat image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("AI service request failed");
      }

      const data = await response.json();

      console.log("DISHAA AI Result:", data);

      setResult(data);
    } catch (error) {
      console.error("Crop analyzer error:", error);

      setError(
        "Unable to analyze the image. Please make sure the AI service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getGradeClass = (grade) => {
    if (grade === "Grade A") return "grade-a";
    if (grade === "Grade B") return "grade-b";
    return "grade-c";
  };

  return (
    <div className="dashboard-layout">

      {/* Background */}

      <div className="background-orb green"></div>
      <div className="background-orb orange"></div>

      <Sidebar />

      <main
        className="dashboard-main crop-analyzer-page"
        style={{
          backgroundImage: `url(${landBg})`,
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="dashboard-heading">

            <span className="dashboard-eyebrow">
              <Leaf size={13} />
              AI CROP ANALYZER
            </span>

            <h1>
              Wheat Quality{" "}
              <span>Analyzer</span> 🌾
            </h1>

            <p>
              Upload a wheat image and let DISHAA analyze
              its quality using AI.
            </p>

          </div>

        </motion.div>


        {/* =========================
            ANALYZER CARD
        ========================= */}

        <motion.section
          className="dashboard-section analyzer-section"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div className="section-header compact-header">

            <div>

              <span className="section-tag">
                AI POWERED
              </span>

              <h2>
                Analyze Your Wheat
              </h2>

              <p>
                Upload a clear image of harvested wheat
                for verification and grading.
              </p>

            </div>

            <div className="section-header-icon">
              <Sparkles size={22} />
            </div>

          </div>


          <div className="analyzer-grid">

            {/* =========================
                UPLOAD SIDE
            ========================= */}

            <div className="upload-panel">

              {!preview ? (

                <label
                  className="upload-box"
                  htmlFor="wheat-image"
                >

                  <div className="upload-icon">
                    <Upload size={28} />
                  </div>

                  <h3>
                    Upload Wheat Image
                  </h3>

                  <p>
                    Click to choose an image
                  </p>

                  <span>
                    JPG, JPEG or PNG
                  </span>

                  <input
                    id="wheat-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                  />

                </label>

              ) : (

                <div className="preview-container">

                  <div className="preview-header">

                    <span>
                      Selected Image
                    </span>

                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                        setResult(null);
                        setError("");
                      }}
                    >
                      Change
                    </button>

                  </div>

                  <img
                    src={preview}
                    alt="Selected wheat"
                    className="wheat-preview"
                  />

                  <p className="file-name">
                    {selectedFile?.name}
                  </p>

                </div>

              )}


              <motion.button
                className="analyze-button"
                onClick={analyzeWheat}
                disabled={!selectedFile || loading}
                whileHover={{
                  scale: selectedFile && !loading ? 1.02 : 1,
                }}
                whileTap={{
                  scale: selectedFile && !loading ? 0.98 : 1,
                }}
              >

                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing Wheat...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Analyze Wheat
                    <ArrowRight size={16} />
                  </>
                )}

              </motion.button>

              {error && (
                <div className="analyzer-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

            </div>


            {/* =========================
                RESULT SIDE
            ========================= */}

            <div className="result-panel">

              {!result && !loading && (

                <div className="result-placeholder">

                  <div className="result-placeholder-icon">
                    <BarChart3 size={28} />
                  </div>

                  <h3>
                    Analysis Result
                  </h3>

                  <p>
                    Your wheat quality analysis will
                    appear here after uploading an image.
                  </p>

                </div>

              )}


              {loading && (

                <div className="result-placeholder">

                  <div className="result-placeholder-icon loading-icon">
                    <Wheat size={28} />
                  </div>

                  <h3>
                    Analyzing Wheat...
                  </h3>

                  <p>
                    DISHAA AI is checking the image
                    and analyzing its quality.
                  </p>

                </div>

              )}


              {result && (

                <div className="result-content">

                  {/* WHEAT VERIFICATION */}

                  <div className="result-title">

                    <div>
                      <span className="section-tag">
                        VERIFICATION
                      </span>

                      <h3>
                        Wheat Verification
                      </h3>
                    </div>

                    {result.is_wheat ? (
                      <CheckCircle
                        size={28}
                        className="success-icon"
                      />
                    ) : (
                      <AlertCircle
                        size={28}
                        className="error-icon"
                      />
                    )}

                  </div>


                  {result.is_wheat ? (

                    <>

                      <div className="verification-card success-card">

                        <div className="verification-icon">
                          <Wheat size={23} />
                        </div>

                        <div>

                          <strong>
                            Wheat Detected
                          </strong>

                          <span>
                            The uploaded image appears
                            to contain wheat.
                          </span>

                        </div>

                        <div className="confidence-value">
                          {(
                            result.wheat_confidence * 100
                          ).toFixed(1)}
                          %
                        </div>

                      </div>


                      {/* GRADE */}

                      <div className="grade-result">

                        <span className="section-tag">
                          QUALITY GRADE
                        </span>

                        <div
                          className={`grade-display ${getGradeClass(
                            result.grade
                          )}`}
                        >

                          <div className="grade-icon">
                            <ShieldCheck size={30} />
                          </div>

                          <div>

                            <span>
                              Predicted Grade
                            </span>

                            <h2>
                              {result.grade}
                            </h2>

                          </div>

                        </div>

                        <div className="grade-confidence">

                          <span>
                            Grade Confidence
                          </span>

                          <strong>
                            {(
                              result.grade_confidence * 100
                            ).toFixed(2)}
                            %
                          </strong>

                        </div>

                      </div>


                      {/* PROBABILITIES */}

                      <div className="probability-section">

                        <div className="probability-header">

                          <span>
                            Grade Probabilities
                          </span>

                        </div>


                        {["Grade A", "Grade B", "Grade C"].map(
                          (grade) => {

                            const value =
                              result.grade_probabilities[
                                grade
                              ];

                            return (
                              <div
                                className="probability-row"
                                key={grade}
                              >

                                <div className="probability-label">

                                  <span>
                                    {grade}
                                  </span>

                                  <strong>
                                    {(
                                      value * 100
                                    ).toFixed(1)}
                                    %
                                  </strong>

                                </div>

                                <div className="probability-bar">

                                  <motion.div
                                    className={`probability-fill ${grade
                                      .toLowerCase()
                                      .replace(" ", "-")}`}
                                    initial={{
                                      width: 0,
                                    }}
                                    animate={{
                                      width: `${value * 100}%`,
                                    }}
                                    transition={{
                                      duration: 0.8,
                                    }}
                                  />

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </>

                  ) : (

                    <div className="not-wheat-card">

                      <div className="not-wheat-icon">
                        <AlertCircle size={30} />
                      </div>

                      <h3>
                        This doesn't appear to be wheat
                      </h3>

                      <p>
                        Please upload a clear image of
                        harvested wheat and try again.
                      </p>

                      <div className="not-wheat-confidence">

                        Wheat Confidence

                        <strong>
                          {(
                            result.wheat_confidence * 100
                          ).toFixed(2)}
                          %
                        </strong>

                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </motion.section>


        {/* =========================
            HOW IT WORKS
        ========================= */}

        <motion.section
          className="dashboard-section"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >

          <div className="section-header compact-header">

            <div>

              <span className="section-tag">
                HOW IT WORKS
              </span>

              <h2>
                AI Wheat Analysis
              </h2>

              <p>
                DISHAA uses a two-step AI process.
              </p>

            </div>

          </div>


          <div className="analysis-steps">

            <div className="analysis-step">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                <Upload size={20} />
              </div>

              <h3>
                Upload
              </h3>

              <p>
                Upload a clear image of your wheat.
              </p>

            </div>


            <div className="step-arrow">
              <ArrowRight size={20} />
            </div>


            <div className="analysis-step">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                <Wheat size={20} />
              </div>

              <h3>
                Verify
              </h3>

              <p>
                AI verifies whether the image contains
                wheat.
              </p>

            </div>


            <div className="step-arrow">
              <ArrowRight size={20} />
            </div>


            <div className="analysis-step">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                <BarChart3 size={20} />
              </div>

              <h3>
                Grade
              </h3>

              <p>
                AI predicts Grade A, B or C.
              </p>

            </div>

          </div>

        </motion.section>

      </main>

    </div>
  );
}

export default CropAnalyzer;
