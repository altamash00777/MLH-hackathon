import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./FPO.css";

function FPO() {

  const user = JSON.parse(localStorage.getItem("user"));

  const farmerName = user?.name || "You";

  const [fpos, setFpos] = useState([
    {
      id: 1,
      cropName: "Wheat",
      requiredQuantity: 1000,
      collectedQuantity: 700,
      expectedPrice: 2500,
      quality: "Premium",
      grade: "A",
      buyer: "Agro Buyers Pvt. Ltd.",

      farmers: [
        {
          name: "Farmer A",
          quantity: 200,
        },
        {
          name: "Farmer B",
          quantity: 500,
        },
      ],
    },

    {
      id: 2,
      cropName: "Rice",
      requiredQuantity: 800,
      collectedQuantity: 450,
      expectedPrice: 2800,
      quality: "Premium",
      grade: "A",
      buyer: "Fresh Foods Ltd.",

      farmers: [
        {
          name: "Farmer D",
          quantity: 250,
        },
        {
          name: "Farmer E",
          quantity: 200,
        },
      ],
    },

    {
      id: 3,
      cropName: "Potato",
      requiredQuantity: 1200,
      collectedQuantity: 650,
      expectedPrice: 1800,
      quality: "Good",
      grade: "B",
      buyer: "National Food Traders",

      farmers: [
        {
          name: "Farmer F",
          quantity: 350,
        },
        {
          name: "Farmer G",
          quantity: 300,
        },
      ],
    },
  ]);

  const [selectedFPO, setSelectedFPO] = useState(null);

  const [showCreateFPO, setShowCreateFPO] =
    useState(false);

  const [showJoinFPO, setShowJoinFPO] =
    useState(false);

  const [showContribution, setShowContribution] =
    useState(false);


  // FPO selected for joining

  const [joinTargetFPO, setJoinTargetFPO] =
    useState(null);


  // Farmer contribution

  const [contributionQuantity, setContributionQuantity] =
    useState("");


  // =====================================================
  // CREATE FPO FORM
  // =====================================================

  const [newFPO, setNewFPO] = useState({
    cropName: "",
    requiredQuantity: "",
    expectedPrice: "",
    quality: "Premium",
    grade: "A",
    buyer: "",
  });


  // =====================================================
  // HANDLE CREATE FPO INPUT
  // =====================================================

  const handleCreateChange = (e) => {
    const { name, value } = e.target;

    setNewFPO((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =====================================================
  // CREATE FPO
  // =====================================================

  const handleCreateFPO = (e) => {
    e.preventDefault();

    if (
      !newFPO.cropName ||
      !newFPO.requiredQuantity ||
      !newFPO.expectedPrice ||
      !newFPO.buyer
    ) {
      alert("Please fill all required fields.");

      return;
    }


    const createdFPO = {
      id: Date.now(),

      cropName: newFPO.cropName,

      requiredQuantity:
        Number(newFPO.requiredQuantity),

      collectedQuantity: 0,

      expectedPrice:
        Number(newFPO.expectedPrice),

      quality: newFPO.quality,

      grade: newFPO.grade,

      buyer: newFPO.buyer,

      farmers: [],
    };


    setFpos((prev) => [
      createdFPO,
      ...prev,
    ]);


    setNewFPO({
      cropName: "",
      requiredQuantity: "",
      expectedPrice: "",
      quality: "Premium",
      grade: "A",
      buyer: "",
    });


    setShowCreateFPO(false);


    alert(
      "FPO created successfully! Farmers can now join this FPO."
    );
  };


  // =====================================================
  // OPEN JOIN FPO
  // =====================================================

  const handleSelectFPO = (fpo) => {
    setJoinTargetFPO(fpo);

    setContributionQuantity("");

    setShowJoinFPO(false);

    setShowContribution(true);
  };


  // =====================================================
  // JOIN FPO
  // =====================================================

  const handleJoinFPO = () => {
    const quantity =
      Number(contributionQuantity);


    if (
      !quantity ||
      quantity <= 0
    ) {
      alert(
        "Please enter a valid contribution quantity."
      );

      return;
    }


    if (!joinTargetFPO) {
      return;
    }


    const remaining =
      joinTargetFPO.requiredQuantity -
      joinTargetFPO.collectedQuantity;


    if (quantity > remaining) {
      alert(
        `Only ${remaining} Q is required to complete this FPO.`
      );

      return;
    }


    // =================================================
    // UPDATE FPO
    // =================================================

    setFpos((prev) =>
      prev.map((fpo) => {

        if (fpo.id !== joinTargetFPO.id) {
          return fpo;
        }


        return {
          ...fpo,

          collectedQuantity:
            fpo.collectedQuantity +
            quantity,

          farmers: [
            ...fpo.farmers,

            {
              name: farmerName,
              quantity: quantity,
            },
          ],
        };
      })
    );


    // Close modal

    setShowContribution(false);

    setJoinTargetFPO(null);

    setContributionQuantity("");


    alert(
      `You successfully contributed ${quantity} Q to the FPO!`
    );
  };


  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================

  const totalFarmers =
    fpos.reduce(
      (total, fpo) =>
        total + fpo.farmers.length,
      0
    );


  const totalAggregated =
    fpos.reduce(
      (total, fpo) =>
        total + fpo.collectedQuantity,
      0
    );


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="fpo-layout">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="fpo-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="fpo-header">

          <div>

            <h1>
              Farmer Producer Organizations
            </h1>

            <p>
              Join with other farmers and collectively
              fulfill large buyer requirements.
            </p>

          </div>


          {/* HEADER ACTIONS */}

          <div className="fpo-header-actions">


            {/* JOIN FPO */}

            <button
              className="join-fpo-header-btn"
              onClick={() =>
                setShowJoinFPO(true)
              }
            >
              🤝 Join FPO
            </button>


            {/* CREATE FPO */}

            <button
              className="create-fpo-btn"
              onClick={() =>
                setShowCreateFPO(true)
              }
            >
              ＋ Create FPO
            </button>


          </div>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="fpo-summary">


          {/* ACTIVE FPO */}

          <div className="fpo-summary-card">

            <span>🏢</span>

            <div>

              <h3>
                {fpos.length}
              </h3>

              <p>
                Active FPOs
              </p>

            </div>

          </div>


          {/* FARMERS */}

          <div className="fpo-summary-card">

            <span>👨‍🌾</span>

            <div>

              <h3>
                {totalFarmers}
              </h3>

              <p>
                Participating Farmers
              </p>

            </div>

          </div>


          {/* PRODUCE */}

          <div className="fpo-summary-card">

            <span>📦</span>

            <div>

              <h3>
                {totalAggregated} Q
              </h3>

              <p>
                Aggregated Produce
              </p>

            </div>

          </div>


          {/* BUYERS */}

          <div className="fpo-summary-card">

            <span>🎯</span>

            <div>

              <h3>
                {fpos.length}
              </h3>

              <p>
                Buyer Requirements
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            AVAILABLE FPOs
        ================================================= */}

        <section className="fpo-section">


          <div className="section-title">

            <h2>
              Available FPO Opportunities
            </h2>

            <p>
              Join farmers who are collectively
              fulfilling large buyer orders.
            </p>

          </div>


          <div className="fpo-grid">


            {fpos.map((fpo) => {


              const progress =
                fpo.requiredQuantity > 0
                  ? Math.min(
                      Math.round(
                        (fpo.collectedQuantity /
                          fpo.requiredQuantity) *
                          100
                      ),
                      100
                    )
                  : 0;


              const remaining =
                Math.max(
                  fpo.requiredQuantity -
                    fpo.collectedQuantity,
                  0
                );


              return (

                <div
                  className="fpo-card"
                  key={fpo.id}
                >


                  {/* CARD TOP */}

                  <div className="fpo-card-top">

                    <div className="crop-icon">
                      🌾
                    </div>


                    <div>

                      <h3>
                        {fpo.cropName} FPO
                      </h3>

                      <p>
                        {fpo.buyer}
                      </p>

                    </div>


                    <span className="fpo-status">
                      {remaining === 0
                        ? "Fulfilled"
                        : "Active"}
                    </span>

                  </div>


                  {/* QUANTITY */}

                  <div className="fpo-info">


                    <div>

                      <span>
                        Required
                      </span>

                      <strong>
                        {fpo.requiredQuantity} Q
                      </strong>

                    </div>


                    <div>

                      <span>
                        Collected
                      </span>

                      <strong>
                        {fpo.collectedQuantity} Q
                      </strong>

                    </div>


                    <div>

                      <span>
                        Remaining
                      </span>

                      <strong>
                        {remaining} Q
                      </strong>

                    </div>


                  </div>


                  {/* PROGRESS */}

                  <div className="progress-area">

                    <div className="progress-label">

                      <span>
                        FPO Progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>

                    </div>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width:
                            `${progress}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="fpo-details">

                    <span>
                      💰 ₹
                      {fpo.expectedPrice}/Q
                    </span>

                    <span>
                      ⭐ {fpo.quality}
                    </span>

                    <span>
                      🏷️ Grade {fpo.grade}
                    </span>

                  </div>


                  {/* FARMERS */}

                  <div className="farmers-preview">

                    <strong>
                      👨‍🌾{" "}
                      {fpo.farmers.length}
                      {" "}Farmers Joined
                    </strong>


                    <div className="farmer-list">


                      {fpo.farmers.length === 0 ? (

                        <div className="farmer-row">

                          <span>
                            No farmers joined yet
                          </span>

                          <strong>
                            Be the first
                          </strong>

                        </div>

                      ) : (

                        fpo.farmers
                          .slice(0, 3)
                          .map(
                            (
                              farmer,
                              index
                            ) => (

                              <div
                                className="farmer-row"
                                key={index}
                              >

                                <span>
                                  👨‍🌾{" "}
                                  {farmer.name}
                                </span>

                                <strong>
                                  {farmer.quantity} Q
                                </strong>

                              </div>

                            )
                          )

                      )}


                    </div>

                  </div>


                  {/* VIEW BUTTON */}

                  <button
                    className="view-fpo-btn"
                    onClick={() =>
                      setSelectedFPO(fpo)
                    }
                  >
                    View FPO Details →
                  </button>


                </div>

              );

            })}


          </div>

        </section>


        {/* =================================================
            MY FPO CONTRIBUTION
        ================================================= */}

        <section className="my-fpo-section">


          <div className="section-title">

            <h2>
              My FPO Contribution
            </h2>

            <p>
              Track the produce you have contributed
              to FPOs.
            </p>

          </div>


          <div className="contribution-card">


            <div className="contribution-crop">

              <div className="crop-icon">
                🌾
              </div>

              <div>

                <h3>
                  Wheat FPO
                </h3>

                <p>
                  Agro Buyers Pvt. Ltd.
                </p>

              </div>

            </div>


            <div className="contribution-stat">

              <span>
                My Crop
              </span>

              <strong>
                500 Q
              </strong>

            </div>


            <div className="contribution-stat">

              <span>
                FPO Contribution
              </span>

              <strong>
                200 Q
              </strong>

            </div>


            <div className="contribution-stat">

              <span>
                Remaining
              </span>

              <strong>
                300 Q
              </strong>

            </div>


            <span className="contribution-status">
              Contributing
            </span>

          </div>

        </section>


      </main>


      {/* =====================================================
          CREATE FPO MODAL
      ===================================================== */}

      {showCreateFPO && (

        <div
          className="fpo-modal-overlay"
          onClick={() =>
            setShowCreateFPO(false)
          }
        >

          <div
            className="fpo-modal create-fpo-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <button
              className="close-modal"
              onClick={() =>
                setShowCreateFPO(false)
              }
            >
              ×
            </button>


            <div className="modal-icon">
              🏢
            </div>


            <h2>
              Create New FPO
            </h2>


            <p className="modal-buyer">
              Create a farmer group to collectively
              fulfill a buyer requirement.
            </p>


            <form
              className="create-fpo-form"
              onSubmit={handleCreateFPO}
            >


              {/* CROP */}

              <div className="form-group">

                <label>
                  Crop Name *
                </label>

                <input
                  type="text"
                  name="cropName"
                  value={newFPO.cropName}
                  onChange={handleCreateChange}
                  placeholder="e.g. Wheat"
                />

              </div>


              {/* QUANTITY */}

              <div className="form-group">

                <label>
                  Required Quantity *
                </label>

                <input
                  type="number"
                  name="requiredQuantity"
                  value={
                    newFPO.requiredQuantity
                  }
                  onChange={handleCreateChange}
                  placeholder="e.g. 1000"
                  min="1"
                />

                <small>
                  Quantity in quintals (Q)
                </small>

              </div>


              {/* BUYER */}

              <div className="form-group">

                <label>
                  Buyer Name *
                </label>

                <input
                  type="text"
                  name="buyer"
                  value={newFPO.buyer}
                  onChange={handleCreateChange}
                  placeholder="e.g. Agro Buyers Pvt. Ltd."
                />

              </div>


              {/* PRICE */}

              <div className="form-group">

                <label>
                  Expected Price / Quintal *
                </label>

                <input
                  type="number"
                  name="expectedPrice"
                  value={
                    newFPO.expectedPrice
                  }
                  onChange={handleCreateChange}
                  placeholder="e.g. 2500"
                  min="1"
                />

              </div>


              {/* QUALITY + GRADE */}

              <div className="form-row">


                <div className="form-group">

                  <label>
                    Quality
                  </label>

                  <select
                    name="quality"
                    value={newFPO.quality}
                    onChange={handleCreateChange}
                  >

                    <option value="Premium">
                      Premium
                    </option>

                    <option value="Standard">
                      Standard
                    </option>

                    <option value="Good">
                      Good
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Grade
                  </label>

                  <select
                    name="grade"
                    value={newFPO.grade}
                    onChange={handleCreateChange}
                  >

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


              </div>


              {/* ACTIONS */}

              <div className="create-fpo-actions">


                <button
                  type="button"
                  className="cancel-fpo-btn"
                  onClick={() =>
                    setShowCreateFPO(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-fpo-btn"
                >
                  🌾 Create FPO
                </button>


              </div>


            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          JOIN FPO SELECTION MODAL
      ===================================================== */}

      {showJoinFPO && (

        <div
          className="fpo-modal-overlay"
          onClick={() =>
            setShowJoinFPO(false)
          }
        >

          <div
            className="fpo-modal join-fpo-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <button
              className="close-modal"
              onClick={() =>
                setShowJoinFPO(false)
              }
            >
              ×
            </button>


            <div className="modal-icon">
              🤝
            </div>


            <h2>
              Join an FPO
            </h2>


            <p className="modal-buyer">
              Select an FPO and contribute your
              available crop quantity.
            </p>


            <div className="join-fpo-list">


              {fpos.map((fpo) => {


                const remaining =
                  Math.max(
                    fpo.requiredQuantity -
                      fpo.collectedQuantity,
                    0
                  );


                const progress =
                  Math.min(
                    Math.round(
                      (fpo.collectedQuantity /
                        fpo.requiredQuantity) *
                        100
                    ),
                    100
                  );


                return (

                  <div
                    className="join-fpo-option"
                    key={fpo.id}
                  >


                    <div className="join-fpo-option-top">


                      <div className="crop-icon">
                        🌾
                      </div>


                      <div>

                        <h3>
                          {fpo.cropName} FPO
                        </h3>

                        <p>
                          Buyer: {fpo.buyer}
                        </p>

                      </div>


                    </div>


                    <div className="join-fpo-info">


                      <div>

                        <span>
                          Required
                        </span>

                        <strong>
                          {fpo.requiredQuantity} Q
                        </strong>

                      </div>


                      <div>

                        <span>
                          Collected
                        </span>

                        <strong>
                          {fpo.collectedQuantity} Q
                        </strong>

                      </div>


                      <div>

                        <span>
                          Needed
                        </span>

                        <strong>
                          {remaining} Q
                        </strong>

                      </div>


                    </div>


                    <div className="progress-area">

                      <div className="progress-label">

                        <span>
                          Progress
                        </span>

                        <strong>
                          {progress}%
                        </strong>

                      </div>


                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width:
                              `${progress}%`,
                          }}
                        />

                      </div>

                    </div>


                    <button
                      className="join-option-btn"
                      disabled={
                        remaining === 0
                      }
                      onClick={() =>
                        handleSelectFPO(fpo)
                      }
                    >

                      {remaining === 0
                        ? "Requirement Fulfilled"
                        : "Select FPO →"}

                    </button>


                  </div>

                );

              })}


            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CONTRIBUTION MODAL
      ===================================================== */}

      {showContribution &&
        joinTargetFPO && (

          <div
            className="fpo-modal-overlay"
            onClick={() =>
              setShowContribution(false)
            }
          >

            <div
              className="fpo-modal contribution-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              <button
                className="close-modal"
                onClick={() =>
                  setShowContribution(false)
                }
              >
                ×
              </button>


              <div className="modal-icon">
                🌾
              </div>


              <h2>
                Join {joinTargetFPO.cropName} FPO
              </h2>


              <p className="modal-buyer">
                Buyer: {joinTargetFPO.buyer}
              </p>


              <div className="modal-quantity">


                <div>

                  <span>
                    FPO Required
                  </span>

                  <strong>
                    {joinTargetFPO.requiredQuantity} Q
                  </strong>

                </div>


                <div>

                  <span>
                    Already Collected
                  </span>

                  <strong>
                    {joinTargetFPO.collectedQuantity} Q
                  </strong>

                </div>


                <div>

                  <span>
                    Still Needed
                  </span>

                  <strong>
                    {Math.max(
                      joinTargetFPO.requiredQuantity -
                        joinTargetFPO.collectedQuantity,
                      0
                    )} Q
                  </strong>

                </div>


              </div>


              <div className="contribution-input">


                <label>
                  Your Contribution
                </label>


                <input
                  type="number"
                  value={
                    contributionQuantity
                  }
                  onChange={(e) =>
                    setContributionQuantity(
                      e.target.value
                    )
                  }
                  placeholder="Enter quantity in quintals"
                  min="1"
                />


                <small>
                  Example: 200 Q
                </small>


              </div>


              <div className="contribution-note">

                💡 Your contribution will be added
                to the FPO's aggregated quantity.

              </div>


              <div className="create-fpo-actions">


                <button
                  type="button"
                  className="cancel-fpo-btn"
                  onClick={() =>
                    setShowContribution(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="save-fpo-btn"
                  onClick={handleJoinFPO}
                >
                  🤝 Confirm & Join
                </button>


              </div>


            </div>

          </div>

        )}


      {/* =====================================================
          FPO DETAILS MODAL
      ===================================================== */}

      {selectedFPO && (

        <div
          className="fpo-modal-overlay"
          onClick={() =>
            setSelectedFPO(null)
          }
        >

          <div
            className="fpo-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <button
              className="close-modal"
              onClick={() =>
                setSelectedFPO(null)
              }
            >
              ×
            </button>


            <div className="modal-icon">
              🌾
            </div>


            <h2>
              {selectedFPO.cropName} FPO
            </h2>


            <p className="modal-buyer">
              Buyer: {selectedFPO.buyer}
            </p>


            {/* QUANTITY */}

            <div className="modal-quantity">


              <div>

                <span>
                  Required
                </span>

                <strong>
                  {selectedFPO.requiredQuantity} Q
                </strong>

              </div>


              <div>

                <span>
                  Collected
                </span>

                <strong>
                  {selectedFPO.collectedQuantity} Q
                </strong>

              </div>


              <div>

                <span>
                  Remaining
                </span>

                <strong>
                  {Math.max(
                    selectedFPO.requiredQuantity -
                      selectedFPO.collectedQuantity,
                    0
                  )} Q
                </strong>

              </div>


            </div>


            {/* FARMERS */}

            <h3>
              Participating Farmers
            </h3>


            <div className="modal-farmers">


              {selectedFPO.farmers.length === 0 ? (

                <div className="modal-farmer">

                  <span>
                    👨‍🌾 No farmers have joined yet
                  </span>

                </div>

              ) : (

                selectedFPO.farmers.map(
                  (farmer, index) => (

                    <div
                      className="modal-farmer"
                      key={index}
                    >

                      <span>
                        👨‍🌾 {farmer.name}
                      </span>

                      <strong>
                        {farmer.quantity} Q
                      </strong>

                    </div>

                  )
                )

              )}


            </div>


            {/* JOIN BUTTON */}

            <button
              className="join-fpo-btn"
              disabled={
                selectedFPO.collectedQuantity >=
                selectedFPO.requiredQuantity
              }
              onClick={() => {

                setJoinTargetFPO(
                  selectedFPO
                );

                setSelectedFPO(null);

                setContributionQuantity("");

                setShowContribution(true);

              }}
            >

              {selectedFPO.collectedQuantity >=
              selectedFPO.requiredQuantity
                ? "Requirement Fulfilled"
                : "Join This FPO"}

            </button>


          </div>

        </div>

      )}

    </div>
  );
}

export default FPO;
