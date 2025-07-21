const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe); 

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
