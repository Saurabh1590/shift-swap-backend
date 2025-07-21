const express = require("express");
const {
  createShift,
  getAllShifts,
  getMyShifts,
  updateShift,
} = require("../controllers/shiftController");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/role")("admin");
const router = express.Router();


router.post("/", auth, adminOnly, createShift);
router.get("/", auth, getAllShifts);
router.get("/my", auth, getMyShifts);
router.put("/:id", auth, adminOnly, updateShift);

module.exports = router;