// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../../components/Sidebar";
// import api from "../../services/api";

// function AddCrop() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     cropName: "",
//     quantity: "",
//     quality: "",
//     grade: "",
//     harvestDate: "",
//     sellingLocation: "",
//     expectedPrice: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Submit crop
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await api.post("/farmer/listings", {
//         cropName: formData.cropName,
//         quantity: Number(formData.quantity),
//         quality: formData.quality,
//         grade: formData.grade,
//         harvestDate: formData.harvestDate,
//         sellingLocation: formData.sellingLocation,
//         expectedPrice: Number(formData.expectedPrice),
//       });

//       setMessage(
//         response.data.message || "Crop added successfully!"
//       );

//       // Clear form
//       setFormData({
//         cropName: "",
//         quantity: "",
//         quality: "",
//         grade: "",
//         harvestDate: "",
//         sellingLocation: "",
//         expectedPrice: "",
//       });

//     } catch (error) {
//       console.error("Add Crop Error:", error);

//       setError(
//         error.response?.data?.message ||
//         "Failed to add crop. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="dashboard-layout">

//       <Sidebar />

//       <main className="dashboard-main">

//         {/* Header */}
//         <div className="page-header">
//           <div>
//             <h1>Add New Crop</h1>
//             <p>
//               Add your crop details for potential buyers.
//             </p>
//           </div>

//           <button
//             className="back-button"
//             onClick={() => navigate("/farmer/dashboard")}
//           >
//             ← Dashboard
//           </button>
//         </div>

//         {/* Form */}
//         <div className="crop-form-card">

//           <form onSubmit={handleSubmit}>

//             <div className="form-grid">

//               {/* Crop Name */}
//               <div className="form-group">
//                 <label>Crop Name</label>

//                 <input
//                   type="text"
//                   name="cropName"
//                   placeholder="e.g. Wheat"
//                   value={formData.cropName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Quantity */}
//               <div className="form-group">
//                 <label>Quantity (kg)</label>

//                 <input
//                   type="number"
//                   name="quantity"
//                   placeholder="e.g. 500"
//                   min="1"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Quality */}
//               <div className="form-group">
//                 <label>Quality</label>

//                 <select
//                   name="quality"
//                   value={formData.quality}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select quality</option>
//                   <option value="Premium">Premium</option>
//                   <option value="Good">Good</option>
//                   <option value="Average">Average</option>
//                 </select>
//               </div>

//               {/* Grade */}
//               <div className="form-group">
//                 <label>Grade</label>

//                 <select
//                   name="grade"
//                   value={formData.grade}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select grade</option>
//                   <option value="A">Grade A</option>
//                   <option value="B">Grade B</option>
//                   <option value="C">Grade C</option>
//                 </select>
//               </div>

//               {/* Harvest Date */}
//               <div className="form-group">
//                 <label>Harvest Date</label>

//                 <input
//                   type="date"
//                   name="harvestDate"
//                   value={formData.harvestDate}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Selling Location */}
//               <div className="form-group">
//                 <label>Selling Location</label>

//                 <input
//                   type="text"
//                   name="sellingLocation"
//                   placeholder="e.g. Lucknow Mandi"
//                   value={formData.sellingLocation}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Expected Price */}
//               <div className="form-group">
//                 <label>Expected Price (₹/kg)</label>

//                 <input
//                   type="number"
//                   name="expectedPrice"
//                   placeholder="e.g. 25"
//                   min="0"
//                   value={formData.expectedPrice}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//             </div>

//             {/* Success */}
//             {message && (
//               <div className="success-message">
//                 ✓ {message}
//               </div>
//             )}

//             {/* Error */}
//             {error && (
//               <div className="error-message">
//                 {error}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="form-actions">

//               <button
//                 type="button"
//                 className="cancel-button"
//                 onClick={() => navigate("/farmer/dashboard")}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="submit-button"
//                 disabled={loading}
//               >
//                 {loading ? "Adding..." : "🌾 Add Crop"}
//               </button>

//             </div>

//           </form>

//         </div>

//       </main>

//     </div>
//   );
// }

// export default AddCrop;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function AddCrop() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    variety: "",
    quantity: "",
    quality: "",
    grade: "",
    harvestDate: "",
    sellingLocation: "",
    expectedPrice: "",
    description: "",
  });

  const [cropImages, setCropImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [aiAssessment, setAiAssessment] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // CROP VARIETIES
  // =========================================================

  const cropVarieties = {
    Wheat: [
      "HD 2967",
      "HD 3086",
      "PBW 343",
      "PBW 550",
      "DBW 187",
      "Other",
    ],

    Rice: [
      "Basmati 1121",
      "Pusa Basmati",
      "IR 64",
      "Swarna",
      "MTU 1010",
      "Other",
    ],

    Potato: [
      "Kufri Jyoti",
      "Kufri Pukhraj",
      "Kufri Chandramukhi",
      "Kufri Bahar",
      "Other",
    ],

    Tomato: [
      "Pusa Ruby",
      "Arka Rakshak",
      "Arka Vikas",
      "Punjab Kesari",
      "Other",
    ],

    Onion: [
      "Pusa Red",
      "N-53",
      "Bhima Red",
      "Bhima Super",
      "Other",
    ],

    Maize: [
      "DHM 117",
      "HQPM 5",
      "Pusa Composite 3",
      "Ganga Safed 2",
      "Other",
    ],

    Sugarcane: [
      "Co 0238",
      "CoJ 64",
      "Co 98014",
      "Co 0118",
      "Other",
    ],

    Mustard: [
      "Pusa Bold",
      "Pusa Jai Kisan",
      "Varuna",
      "Kranti",
      "Other",
    ],

    Cotton: [
      "Bt Cotton",
      "Bunny Bt",
      "RCH 2",
      "MRC 7017",
      "Other",
    ],

    "Other Crop": [
      "Other",
    ],
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset variety when crop changes
    if (name === "cropName") {
      setFormData((prev) => ({
        ...prev,
        cropName: value,
        variety: "",
      }));

      setAiAssessment(null);
    }
  };

  // =========================================================
  // IMAGE UPLOAD - OPTIONAL
  // =========================================================

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const selectedFiles = files.slice(0, 5);

    setCropImages(selectedFiles);

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);

    setAiAssessment(null);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (index) => {
    setCropImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setAiAssessment(null);
  };

  // =========================================================
  // AI ASSESSMENT - SHOWCASE ONLY
  // =========================================================

  const handleAIAnalysis = async () => {
    if (!cropImages.length) {
      setError(
        "Please upload a crop photo to use AI assessment."
      );
      return;
    }

    setError("");
    setAnalyzing(true);

    try {
      /*
        FUTURE AI API:

        const data = new FormData();

        data.append("cropName", formData.cropName);

        cropImages.forEach((image) => {
          data.append("images", image);
        });

        const response = await api.post(
          "/ai/crop-assessment",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setAiAssessment(response.data);
      */

      // Showcase/demo response
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      setAiAssessment({
        cropCondition: "Healthy",
        healthScore: 88,
        detectedIssues: "No major disease detected",
        qualityPrediction: "Good",
        recommendations:
          "Crop appears healthy. Continue regular irrigation and monitor for early signs of disease.",
      });
    } catch (err) {
      console.error("AI Assessment Error:", err);

      setError(
        "Unable to analyze crop. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================================================
  // SUBMIT CROP
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      /*
        IMPORTANT:

        The existing required fields are sent exactly
        like your previous functionality.

        New showcase fields are optional.
      */

      const response = await api.post(
        "/farmer/listings",
        {
          cropName: formData.cropName,

          quantity: Number(formData.quantity),

          quality: formData.quality,

          grade: formData.grade,

          harvestDate: formData.harvestDate,

          sellingLocation: formData.sellingLocation,

          expectedPrice: Number(
            formData.expectedPrice
          ),

          // OPTIONAL SHOWCASE FIELDS

          variety: formData.variety || "",

          description:
            formData.description || "",

          cropImages: cropImages.map(
            (image) => image.name
          ),

          aiAssessment:
            aiAssessment || null,
        }
      );

      setMessage(
        response.data.message ||
          "Crop added successfully!"
      );

      // Reset form
      setFormData({
        cropName: "",
        variety: "",
        quantity: "",
        quality: "",
        grade: "",
        harvestDate: "",
        sellingLocation: "",
        expectedPrice: "",
        description: "",
      });

      setCropImages([]);
      setPreviewImages([]);
      setAiAssessment(null);

    } catch (error) {
      console.error("Add Crop Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add crop. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="page-header">

          <div>

            <h1>
              Add New Crop
            </h1>

            <p>
              Add your crop details for potential buyers.
            </p>

          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/farmer/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>


        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="crop-form-card">

          <form onSubmit={handleSubmit}>

            {/* =================================================
                BASIC CROP INFORMATION
            ================================================= */}

            <div className="section-title">

              <span>🌾</span>

              <div>
                <h2>
                  Crop Information
                </h2>

                <p>
                  Add basic information about your crop.
                </p>
              </div>

            </div>


            <div className="form-grid">

              {/* Crop Name - REQUIRED */}

              <div className="form-group">

                <label>
                  Crop Name
                </label>

                <select
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select crop
                  </option>

                  {Object.keys(cropVarieties).map(
                    (crop) => (
                      <option
                        key={crop}
                        value={crop}
                      >
                        {crop}
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* Variety - OPTIONAL */}

              <div className="form-group">

                <label>
                  Crop Variety
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <select
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  disabled={!formData.cropName}
                >

                  <option value="">
                    Select variety
                  </option>

                  {formData.cropName &&
                    cropVarieties[
                      formData.cropName
                    ]?.map((variety) => (

                      <option
                        key={variety}
                        value={variety}
                      >
                        {variety}
                      </option>

                    ))}

                </select>

              </div>


              {/* Quantity - REQUIRED */}

              <div className="form-group">

                <label>
                  Quantity (kg)
                </label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g. 500"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Quality - REQUIRED */}

              <div className="form-group">

                <label>
                  Quality
                </label>

                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select quality
                  </option>

                  <option value="Premium">
                    Premium
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Average">
                    Average
                  </option>

                </select>

              </div>


              {/* Grade - REQUIRED */}

              <div className="form-group">

                <label>
                  Grade
                </label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select grade
                  </option>

                  <option value="A">
                    Grade A
                  </option>

                  <option value="B">
                    Grade B
                  </option>

                  <option value="C">
                    Grade C
                  </option>

                </select>

              </div>


              {/* Harvest Date - REQUIRED */}

              <div className="form-group">

                <label>
                  Harvest Date
                </label>

                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Selling Location - REQUIRED */}

              <div className="form-group">

                <label>
                  Selling Location
                </label>

                <input
                  type="text"
                  name="sellingLocation"
                  placeholder="e.g. Lucknow Mandi"
                  value={formData.sellingLocation}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Expected Price - REQUIRED */}

              <div className="form-group">

                <label>
                  Expected Price (₹/kg)
                </label>

                <input
                  type="number"
                  name="expectedPrice"
                  placeholder="e.g. 25"
                  min="0"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* =================================================
                AI CROP ASSESSMENT - OPTIONAL
            ================================================= */}

            <div className="ai-assessment-section">

              <div className="section-title">

                <span>🤖</span>

                <div>

                  <h2>
                    AI Crop Assessment
                    <span className="optional-label">
                      Optional
                    </span>
                  </h2>

                  <p>
                    Upload crop photos to showcase AI-powered
                    crop health analysis.
                  </p>

                </div>

              </div>


              {/* Upload */}

              <div className="ai-upload-box">

                <div className="upload-icon">
                  📸
                </div>

                <h3>
                  Upload Crop Photos
                </h3>

                <p>
                  Upload up to 5 clear photos of your crop.
                </p>

                <label className="upload-button">

                  📷 Choose Photos

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    hidden
                  />

                </label>

                <small>
                  JPG, PNG or WEBP • Maximum 5 images
                </small>

              </div>


              {/* Preview */}

              {previewImages.length > 0 && (

                <div className="image-preview-container">

                  <h3>
                    Selected Photos
                  </h3>

                  <div className="image-preview-grid">

                    {previewImages.map(
                      (image, index) => (

                        <div
                          className="image-preview"
                          key={index}
                        >

                          <img
                            src={image}
                            alt={`Crop ${index + 1}`}
                          />

                          <button
                            type="button"
                            className="remove-image"
                            onClick={() =>
                              removeImage(index)
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* AI Button */}

              {cropImages.length > 0 && (

                <button
                  type="button"
                  className="ai-analyze-button"
                  onClick={handleAIAnalysis}
                  disabled={analyzing}
                >

                  {analyzing
                    ? "🤖 Analyzing Crop..."
                    : "✨ Analyze Crop with AI"}

                </button>

              )}


              {/* AI Result */}

              {aiAssessment && (

                <div className="ai-result-card">

                  <div className="ai-result-header">

                    <div>

                      <span className="ai-icon">
                        🤖
                      </span>

                      <div>

                        <h3>
                          AI Assessment Result
                        </h3>

                        <p>
                          Analysis completed
                        </p>

                      </div>

                    </div>

                    <span className="ai-badge">
                      AI Analysis
                    </span>

                  </div>


                  <div className="ai-result-grid">

                    <div className="ai-result-item">

                      <span>
                        Crop Condition
                      </span>

                      <strong>
                        {aiAssessment.cropCondition}
                      </strong>

                    </div>


                    <div className="ai-result-item">

                      <span>
                        Health Score
                      </span>

                      <strong>
                        {aiAssessment.healthScore}%
                      </strong>

                    </div>


                    <div className="ai-result-item">

                      <span>
                        Quality Prediction
                      </span>

                      <strong>
                        {aiAssessment.qualityPrediction}
                      </strong>

                    </div>


                    <div className="ai-result-item">

                      <span>
                        Detected Issues
                      </span>

                      <strong>
                        {aiAssessment.detectedIssues}
                      </strong>

                    </div>

                  </div>


                  <div className="ai-recommendation">

                    <strong>
                      💡 AI Recommendation
                    </strong>

                    <p>
                      {aiAssessment.recommendations}
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                ADDITIONAL DETAILS - OPTIONAL
            ================================================= */}

            <div className="additional-details-section">

              <div className="section-title">

                <span>📝</span>

                <div>

                  <h2>
                    Additional Details
                    <span className="optional-label">
                      Optional
                    </span>
                  </h2>

                  <p>
                    Add more information about your crop
                    for potential buyers.
                  </p>

                </div>

              </div>


              <div className="form-group full-width">

                <label>
                  Crop Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your crop, farming method, freshness, storage conditions, pesticide usage, or any other information..."
                  rows="6"
                  maxLength="1000"
                />

                <small className="character-count">
                  {formData.description.length}/1000
                </small>

              </div>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {message && (

              <div className="success-message">
                ✓ {message}
              </div>

            )}

            {error && (

              <div className="error-message">
                ⚠️ {error}
              </div>

            )}


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/farmer/dashboard")
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >

                {loading
                  ? "Adding..."
                  : "🌾 Add Crop"}

              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddCrop;