const express = require("express");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
  createFPO,
  joinFPO,
  getAvailableFPOs,
  getFPOById,
  getFPOContributions,
  getBuyerFPOs,
  getBuyerFPOById,
  createFPOPurchase,
  getFPOPurchases,
  getMyFPOPurchases,
  updateFPOPurchaseStatus
} = require("../controllers/fpoController");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("farmer"),
  getAvailableFPOs
);

router.post(
  "/",
  protect,
  authorize("farmer"),
  createFPO
);

router.get(
  "/buyer",
  protect,
  authorize("buyer"),
  getBuyerFPOs
);

router.get(
  "/:fpoId/buyer",
  protect,
  authorize("buyer"),
  getBuyerFPOById
);
router.post(
  "/:fpoId/buy",
  protect,
  authorize("buyer"),
  createFPOPurchase
);
router.get(
  "/:fpoId/purchases",
  protect,
  authorize("farmer"),
  getFPOPurchases
);

router.get(
  "/my-purchases",
  protect,
  authorize("buyer"),
  getMyFPOPurchases
);

router.get(
  "/:fpoId",
  protect,
  authorize("farmer"),
  getFPOById
);

router.get(
  "/:fpoId/contributions",
  protect,
  authorize("farmer"),
  getFPOContributions
);

router.post(
  "/:fpoId/join",
  protect,
  authorize("farmer"),
  joinFPO
);
router.patch(
  "/:fpoId/purchases/:purchaseId",
  protect,
  authorize("farmer"),
  updateFPOPurchaseStatus
);


module.exports = router;