const Leave = require("../models/LeaveRequest");
const Swap = require("../models/SwapRequest");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.getSummary = asyncHandler(async (req, res, next) => {
  const [pendingLeaves, openSwaps, recentLeaves, recentSwaps, totalUsers] =
    await Promise.all([
      Leave.countDocuments({ status: "pending" }),
      Swap.countDocuments({ status: "open" }),
      Leave.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "firstName lastName"),
      Swap.find({ status: "pending_approval" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "firstName lastName")
        .populate("acceptedBy", "firstName lastName"),
      User.countDocuments(),
    ]);

  res.json({
    pendingLeaves,
    openSwaps,
    recentLeaves,
    recentSwaps,
    totalUsers,
  });
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // Find all users and exclude their passwords from the result
  const users = await User.find().select("-password");
  res.status(200).json(users);
});
