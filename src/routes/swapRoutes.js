const express = require("express");
const {
  createSwap,
  getMySwaps,
  getAllSwaps,
  acceptSwap,
  updateSwapStatus
} = require("../controllers/swapController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/role")("admin");
const router = express.Router();

router.post("/", auth, createSwap);
router.get("/my", auth, getMySwaps);
router.get("/all", auth, getAllSwaps);
router.post("/:id/accept", auth, acceptSwap);

// Unified route: /api/swap/:id/accept or /api/swap/:id/reject
router.put("/:id/:status", auth, adminOnly, updateSwapStatus);

module.exports = router;
