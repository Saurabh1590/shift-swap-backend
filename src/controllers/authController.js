const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("../utils/asyncHandler");
const { generateScheduleForUser } = require("../utils/shiftScheduler");

exports.register = asyncHandler(async (req, res, next) => {
  const user = new User(req.body);

  if (user.role === "employee") {
    // 1. Assign a random weekly day off (0-6 for Sun-Sat)
    user.weeklyOffDay = Math.floor(Math.random() * 7);
    // 2. Set the initial shift cycle to 'A' (Morning)
    user.shiftCycle = "A";
  }

  await user.save();

  if (user.role === "employee") {
    await generateScheduleForUser({
      userId: user._id,
      startDate: new Date(),
      weeklyOffDay: user.weeklyOffDay,
      initialShiftType: user.shiftCycle,
    });
  }

  const token = user.generateToken();
  res.status(201).json({ user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password"); // Also select password to compare
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.password = undefined;
  res.status(200).json({ user });
});

exports.getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
