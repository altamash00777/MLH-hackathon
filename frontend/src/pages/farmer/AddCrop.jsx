
import React, { useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import "./AddCrop.css";

const cropData = {
  Wheat: ["Sharbati", "Lokwan", "Durum", "Other"],
  Rice: ["Basmati", "Sona Masuri", "IR64", "Other"],
  Maize: ["Yellow Maize", "White Maize", "Sweet Corn", "Other"],
  Potato: ["Kufri Jyoti", "Kufri Pukhraj", "Kufri Chandramukhi", "Other"],
  Tomato: ["Hybrid", "Desi", "Cherry", "Other"],
  Onion: ["Red Onion", "White Onion", "Yellow Onion", "Other"],
  Sugarcane: ["Co 0238", "Co 86032", "Other"],
  Cotton: ["Long Staple", "Medium Staple", "Short Staple", "Other"],
};

const AddCrop = () => {
  const [formData, setFormData] = useState({
    cropName: "",
    variety: "",
    quantity: "",
    quality: "",
    grade: "",
    harvestDate: "",
    sellingLocation: "",
    expectedPrice: "",
    productionCostPerQuintal: "",
    otherExpenses: "",
    description: "",
  });

  const [cropImages, setCropImages] = useState([]);
  const [aiAssessment, setAiAssessment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cropName") {
      setFormData((prev) => ({
        ...prev,
        cropName: value,
        variety: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     HANDLE CROP IMAGES
  ===================================================== */

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    setCropImages(files);
  };

  /* =====================================================
     HANDLE AI IMAGE
  ===================================================== */

  const handleAIUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /*
      Currently this is a demo/showcase feature.
      Later this can be connected to the actual
      AI crop assessment API/model.
    */

    setAiAssessment({
      fileName: file.name,
      status: "Image uploaded",
    });
  };

  /* =====================================================
     SUBMIT FORM
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/farmer/listings", {
        cropName: formData.cropName,

        quantity: Number(formData.quantity),

        quality: formData.quality,

        grade: formData.grade,

        harvestDate: formData.harvestDate,

        sellingLocation: formData.sellingLocation,

        expectedPrice: Number(formData.expectedPrice),

        productionCostPerQuintal: Number(
          formData.productionCostPerQuintal
        ),

        otherExpenses: Number(
          formData.otherExpenses || 0
        ),

        /*
          These fields are included for future use.
          Your current MongoDB schema may ignore them
          if they are not defined in the schema.
        */

        variety: formData.variety || "",

        description: formData.description || "",

        cropImages: cropImages.map(
          (image) => image.name
        ),

        aiAssessment: aiAssessment || null,
      });

      if (response.data?.success !== false) {
        setMessage(
          "Crop listing created successfully!"
        );

        /* Reset form */

        setFormData({
          cropName: "",
          variety: "",
          quantity: "",
          quality: "",
          grade: "",
          harvestDate: "",
          sellingLocation: "",
          expectedPrice: "",
          productionCostPerQuintal: "",
          otherExpenses: "",
          description: "",
        });

        setCropImages([]);

        setAiAssessment(null);

        /*
          Clear file inputs manually because React
          does not reset them through state.
        */

        const fileInputs =
          document.querySelectorAll(
            ".add-crop-page input[type='file']"
          );

        fileInputs.forEach((input) => {
          input.value = "";
        });
      }
    } catch (err) {
      console.error(
        "Create Crop Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create crop listing"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout add-crop-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main add-crop-main">



        <div className="add-crop-page">

          <div className="add-crop-container">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

              <div>
                <h1>
                  Add Crop Listing
                </h1>

                <p>
                  Add your crop details to connect
                  with potential buyers.
                </p>
              </div>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

              {/* =================================================
                  CROP INFORMATION
              ================================================= */}

              <div className="form-section">

                <h2>
                  Crop Information
                </h2>

                <div className="form-grid">

                  {/* Crop Name */}

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

                      {Object.keys(cropData).map(
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


                  {/* Variety */}

                  <div className="form-group">

                    <label>
                      Variety
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
                        cropData[
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


                  {/* Quantity */}

                  <div className="form-group">

                    <label>
                      Quantity (quintals)
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      placeholder="e.g. 100"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Quality */}

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

                      <option value="Excellent">
                        Excellent
                      </option>

                      <option value="Good">
                        Good
                      </option>

                      <option value="Average">
                        Average
                      </option>

                      <option value="Poor">
                        Poor
                      </option>

                    </select>

                  </div>


                  {/* Grade */}

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
                        A
                      </option>

                      <option value="B">
                        B
                      </option>

                      <option value="C">
                        C
                      </option>

                    </select>

                  </div>


                  {/* Harvest Date */}

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


                  {/* Selling Location */}

                  <div className="form-group">

                    <label>
                      Selling Location
                    </label>

                    <input
                      type="text"
                      name="sellingLocation"
                      placeholder="e.g. Lucknow"
                      value={
                        formData.sellingLocation
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Expected Price */}

                  <div className="form-group">

                    <label>
                      Expected Price (₹/quintal)
                    </label>

                    <input
                      type="number"
                      name="expectedPrice"
                      placeholder="e.g. 3000"
                      min="0"
                      value={formData.expectedPrice}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Production Cost */}

                  <div className="form-group">

                    <label>
                      Production Cost (₹/quintal)
                    </label>

                    <input
                      type="number"
                      name="productionCostPerQuintal"
                      placeholder="e.g. 2500"
                      min="0"
                      value={
                        formData.productionCostPerQuintal
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* Other Expenses */}

                  <div className="form-group">

                    <label>

                      Other Expenses (₹)

                      <span className="optional-label">
                        Optional
                      </span>

                    </label>

                    <input
                      type="number"
                      name="otherExpenses"
                      placeholder="e.g. 10000"
                      min="0"
                      value={
                        formData.otherExpenses
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  AI CROP ASSESSMENT
              ================================================= */}

              <div className="form-section">

                <h2>
                  AI Crop Assessment
                </h2>

                <p className="section-description">
                  Upload a crop image for AI-based
                  assessment. This feature can help
                  provide additional crop information.
                </p>


                <div className="form-group">

                  <label>
                    Upload Crop Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAIUpload}
                  />

                </div>


                {aiAssessment && (
                  <div className="ai-assessment-result">

                    <p>
                      <strong>
                        Uploaded:
                      </strong>{" "}
                      {aiAssessment.fileName}
                    </p>

                    <p>
                      Status:{" "}
                      {aiAssessment.status}
                    </p>

                  </div>
                )}

              </div>


              {/* =================================================
                  CROP IMAGES
              ================================================= */}

              <div className="form-section">

                <h2>
                  Crop Images
                </h2>

                <p className="section-description">
                  Add images of your crop to help
                  buyers understand its condition.
                </p>


                <div className="form-group">

                  <label>
                    Upload Images
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />

                </div>


                {cropImages.length > 0 && (
                  <div className="uploaded-images">

                    <p>
                      {cropImages.length} image
                      {cropImages.length > 1
                        ? "s"
                        : ""}{" "}
                      selected
                    </p>


                    <ul>

                      {cropImages.map(
                        (image, index) => (
                          <li key={index}>
                            {image.name}
                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

              </div>


              {/* =================================================
                  ADDITIONAL INFORMATION
              ================================================= */}

              <div className="form-section">

                <h2>
                  Additional Information
                </h2>


                <div className="form-group">

                  <label>

                    Description

                    <span className="optional-label">
                      Optional
                    </span>

                  </label>


                  <textarea
                    name="description"
                    placeholder="Add any additional information about your crop..."
                    rows="5"
                    maxLength="500"
                    value={formData.description}
                    onChange={handleChange}
                  />


                  <div className="character-count">
                    {formData.description.length}/500
                  </div>

                </div>

              </div>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >

                  {loading
                    ? "Creating Listing..."
                    : "Create Crop Listing"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AddCrop;
