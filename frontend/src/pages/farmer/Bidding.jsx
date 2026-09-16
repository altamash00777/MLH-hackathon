import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import "./Bidding.css";

function Bidding() {
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  const [bids, setBids] = useState([
    {
      id: 1,
      buyer: "GreenMart Foods",
      avatar: "🏢",
      budget: 300000,
      bid: 2400,
      time: "Starting bid"
    },
    {
      id: 2,
      buyer: "FreshHarvest Ltd.",
      avatar: "🏪",
      budget: 250000,
      bid: 2425,
      time: "Starting bid"
    },
    {
      id: 3,
      buyer: "AgroStar Traders",
      avatar: "🏭",
      budget: 400000,
      bid: 2450,
      time: "Starting bid"
    }
  ]);

  const cropData = {
    Wheat: {
      emoji: "🌾",
      quantity: 100,
      aiNetRealization: 2420,
      minPrice: 2350,
      maxPrice: 2500
    },

    Rice: {
      emoji: "🍚",
      quantity: 80,
      aiNetRealization: 3140,
      minPrice: 3050,
      maxPrice: 3250
    },

    Maize: {
      emoji: "🌽",
      quantity: 120,
      aiNetRealization: 2080,
      minPrice: 2000,
      maxPrice: 2150
    },

    Potato: {
      emoji: "🥔",
      quantity: 150,
      aiNetRealization: 1820,
      minPrice: 1750,
      maxPrice: 1900
    }
  };

  const crop = cropData[selectedCrop];

  const highestBid = Math.max(...bids.map((item) => item.bid));

  const winner =
    bids.find((item) => item.bid === highestBid) || null;


  /* =====================================
     AUCTION TIMER
     ===================================== */

  useEffect(() => {
    if (!auctionStarted || auctionEnded) {
      return;
    }

    if (timeLeft <= 0) {
      setAuctionEnded(true);
      setAuctionStarted(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionStarted, auctionEnded, timeLeft]);


  /* =====================================
     MOCK LIVE BIDDING
     ===================================== */

  useEffect(() => {
    if (!auctionStarted || auctionEnded) {
      return;
    }

    const bidInterval = setInterval(() => {
      setBids((previousBids) => {

        const updatedBids = previousBids.map((buyer) => {

          const increase =
            Math.floor(Math.random() * 4 + 1) * 5;

          const newBid = buyer.bid + increase;

          const maximumBid =
            Math.floor(buyer.budget / crop.quantity);

          if (newBid > maximumBid) {
            return buyer;
          }

          return {
            ...buyer,
            bid: newBid,
            time: "Just now"
          };
        });

        return updatedBids;
      });
    }, 5000);

    return () => clearInterval(bidInterval);

  }, [auctionStarted, auctionEnded, crop.quantity]);


  /* =====================================
     START AUCTION
     ===================================== */

  const startAuction = () => {

    setAuctionStarted(true);
    setAuctionEnded(false);
    setTimeLeft(60);

  };


  /* =====================================
     END AUCTION
     ===================================== */

  const endAuction = () => {

    setAuctionStarted(false);
    setAuctionEnded(true);

  };


  /* =====================================
     RESET AUCTION
     ===================================== */

  const resetAuction = () => {

    setAuctionStarted(false);
    setAuctionEnded(false);
    setTimeLeft(60);

    setBids([
      {
        id: 1,
        buyer: "GreenMart Foods",
        avatar: "🏢",
        budget: 300000,
        bid: crop.minPrice + 50,
        time: "Starting bid"
      },
      {
        id: 2,
        buyer: "FreshHarvest Ltd.",
        avatar: "🏪",
        budget: 250000,
        bid: crop.minPrice + 75,
        time: "Starting bid"
      },
      {
        id: 3,
        buyer: "AgroStar Traders",
        avatar: "🏭",
        budget: 400000,
        bid: crop.minPrice + 100,
        time: "Starting bid"
      }
    ]);

  };


  /* =====================================
     CHANGE CROP
     ===================================== */

  const handleCropChange = (event) => {

    setSelectedCrop(event.target.value);

    setAuctionStarted(false);
    setAuctionEnded(false);
    setTimeLeft(60);

  };


  return (

    <div className="farmer-layout">

      <Sidebar />


      <main className="bidding-page">


        {/* =================================
            HEADER
        ================================= */}

        <div className="bidding-header">

          <div>

            <div className="bidding-title">

              <span className="bidding-icon">
                ⚖️
              </span>

              <div>

                <h1>
                  Smart Crop Bidding
                </h1>

                <p>
                  Let verified buyers compete for your crop
                  and get the best possible price.
                </p>

              </div>

            </div>

          </div>


          <div className="live-badge">

            <span className="live-dot"></span>

            Mock Auction

          </div>

        </div>


        {/* =================================
            CROP SELECTION
        ================================= */}

        {!auctionStarted && !auctionEnded && (

          <div className="auction-setup">

            <div className="setup-header">

              <div>

                <h2>
                  Start a New Auction
                </h2>

                <p>
                  Select a crop and start bidding with
                  verified buyers.
                </p>

              </div>

              <span className="setup-icon">
                🌱
              </span>

            </div>


            <div className="setup-content">


              <div className="crop-selector">

                <label>
                  Select Crop
                </label>

                <select
                  value={selectedCrop}
                  onChange={handleCropChange}
                >

                  <option value="Wheat">
                    🌾 Wheat
                  </option>

                  <option value="Rice">
                    🍚 Rice
                  </option>

                  <option value="Maize">
                    🌽 Maize
                  </option>

                  <option value="Potato">
                    🥔 Potato
                  </option>

                </select>

              </div>


              <div className="setup-details">

                <div className="setup-detail">

                  <span>
                    Crop
                  </span>

                  <strong>
                    {crop.emoji} {selectedCrop}
                  </strong>

                </div>


                <div className="setup-detail">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {crop.quantity} Quintals
                  </strong>

                </div>


                <div className="setup-detail">

                  <span>
                    AI Net Realization
                  </span>

                  <strong className="green-price">
                    ₹{crop.aiNetRealization.toLocaleString("en-IN")}
                  </strong>

                </div>


                <div className="setup-detail">

                  <span>
                    AI Price Range
                  </span>

                  <strong className="orange-price">
                    ₹{crop.minPrice.toLocaleString("en-IN")}
                    {" - "}
                    ₹{crop.maxPrice.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            </div>


            <button
              className="start-auction-button"
              onClick={startAuction}
            >

              🔨 Start Bidding

            </button>

          </div>

        )}


        {/* =================================
            ACTIVE AUCTION
        ================================= */}

        {auctionStarted && !auctionEnded && (

          <>

            {/* Auction Top Card */}

            <div className="auction-main-card">


              <div className="auction-top">

                <div className="auction-crop">

                  <div className="large-crop-icon">
                    {crop.emoji}
                  </div>

                  <div>

                    <span>
                      LIVE AUCTION
                    </span>

                    <h2>
                      {selectedCrop}
                    </h2>

                    <p>
                      {crop.quantity} Quintals
                    </p>

                  </div>

                </div>


                <div className="auction-timer">

                  <span>
                    ⏱️ Auction Ends In
                  </span>

                  <strong>
                    00:{String(timeLeft).padStart(2, "0")}
                  </strong>

                </div>

              </div>


              {/* Price Stats */}

              <div className="auction-price-stats">


                <div>

                  <span>
                    AI Net Realization
                  </span>

                  <strong>
                    ₹{crop.aiNetRealization.toLocaleString("en-IN")}
                  </strong>

                </div>


                <div>

                  <span>
                    Starting Price
                  </span>

                  <strong>
                    ₹{crop.minPrice.toLocaleString("en-IN")}
                  </strong>

                </div>


                <div className="highest-price">

                  <span>
                    🔥 Current Highest Bid
                  </span>

                  <strong>
                    ₹{highestBid.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>

            </div>


            {/* Buyers */}

            <div className="buyers-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Buyer Bids
                  </h2>

                  <p>
                    3 verified buyers are participating
                  </p>

                </div>

                <span className="buyer-count">
                  👥 3 Buyers
                </span>

              </div>


              <div className="buyer-grid">

                {bids
                  .sort((a, b) => b.bid - a.bid)
                  .map((buyer, index) => (

                    <div
                      className={`buyer-card ${
                        index === 0
                          ? "top-buyer"
                          : ""
                      }`}
                      key={buyer.id}
                    >

                      {index === 0 && (

                        <div className="highest-label">
                          🏆 Highest Bid
                        </div>

                      )}


                      <div className="buyer-card-top">

                        <div className="buyer-avatar">
                          {buyer.avatar}
                        </div>

                        <div>

                          <h3>
                            {buyer.buyer}
                          </h3>

                          <span>
                            ✓ Verified Buyer
                          </span>

                        </div>

                      </div>


                      <div className="buyer-money">

                        <span>
                          Available Budget
                        </span>

                        <strong>
                          ₹{buyer.budget.toLocaleString("en-IN")}
                        </strong>

                      </div>


                      <div className="current-bid">

                        <span>
                          Current Bid
                        </span>

                        <strong>
                          ₹{buyer.bid.toLocaleString("en-IN")}
                          <small>/quintal</small>
                        </strong>

                      </div>


                      <div className="bid-status">

                        <span>
                          🟢 {buyer.time}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            </div>


            {/* End Auction */}

            <div className="end-auction-section">

              <div>

                <strong>
                  Ready to close the auction?
                </strong>

                <p>
                  The buyer with the highest bid will win
                  your crop.
                </p>

              </div>


              <button
                className="end-auction-button"
                onClick={endAuction}
              >

                🔴 End Auction

              </button>

            </div>

          </>

        )}


        {/* =================================
            AUCTION RESULT
        ================================= */}

        {auctionEnded && (

          <div className="auction-result">


            <div className="result-icon">
              🏆
            </div>


            <span className="result-label">
              AUCTION COMPLETED
            </span>


            <h1>
              Congratulations!
            </h1>


            <p>
              Your {selectedCrop} auction has been
              successfully completed.
            </p>


            <div className="winner-card">

              <div className="winner-avatar">
                {winner?.avatar}
              </div>


              <div className="winner-info">

                <span>
                  🏆 Winning Buyer
                </span>

                <h2>
                  {winner?.buyer}
                </h2>

                <small>
                  ✓ Verified Buyer
                </small>

              </div>


              <div className="winning-price">

                <span>
                  Final Winning Bid
                </span>

                <strong>
                  ₹{highestBid.toLocaleString("en-IN")}
                </strong>

                <small>
                  per quintal
                </small>

              </div>

            </div>


            <div className="result-stats">


              <div>

                <span>
                  AI Net Realization
                </span>

                <strong>
                  ₹{crop.aiNetRealization.toLocaleString("en-IN")}
                </strong>

              </div>


              <div>

                <span>
                  Winning Price
                </span>

                <strong className="winning-green">
                  ₹{highestBid.toLocaleString("en-IN")}
                </strong>

              </div>


              <div>

                <span>
                  Price Difference
                </span>

                <strong className="winning-orange">

                  ₹
                  {(
                    highestBid -
                    crop.aiNetRealization
                  ).toLocaleString("en-IN")}

                </strong>

              </div>

            </div>


            <div className="result-message">

              💡

              <p>

                <strong>
                  Great result!
                </strong>

                {" "}

                The auction helped you discover the
                best available buyer price for your crop.

              </p>

            </div>


            <button
              className="new-auction-button"
              onClick={resetAuction}
            >

              🔄 Start New Auction

            </button>


          </div>

        )}


        {/* =================================
            DEMO NOTE
        ================================= */}

        <div className="bidding-demo-note">

          <span>
            ℹ️
          </span>

          <p>

            <strong>
              Demo Mode:
            </strong>

            {" "}

            Buyer bids are simulated automatically using
            mock data. In the production version, this
            system can be connected to real buyers,
            real-time bidding and backend services.

          </p>

        </div>


      </main>

    </div>

  );
}

export default Bidding;