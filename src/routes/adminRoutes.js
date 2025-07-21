const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/role")("admin"); // Correct invocation
const { getSummary, getAllUsers } = require("../controllers/adminController");

router.get("/summary", auth, adminOnly, getSummary);
router.get("/users", auth, adminOnly, getAllUsers);

module.exports = router;