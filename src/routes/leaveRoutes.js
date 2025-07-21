const express = require("express");
const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/role")("admin");
const router = express.Router();

router.post("/", auth, createLeave);
router.get("/my", auth, getMyLeaves);
router.get("/all", auth, adminOnly, getAllLeaves);

// Unified route: /api/leave/:id/approve or /api/leave/:id/reject
router.put("/:id/:status", auth, adminOnly, updateLeaveStatus);

module.exports = router;
