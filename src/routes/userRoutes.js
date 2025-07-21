const express = require("express");
const auth = require("../middleware/auth");
const { updateUserProfile } = require("../controllers/userController"); // Import it
const router = express.Router();

router.patch("/profile", auth, updateUserProfile);

module.exports = router;