const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const updates = req.body;

  // For security, explicitly remove role from the updates object
  // so a user cannot change their own role.
  delete updates.role;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({ user });
});