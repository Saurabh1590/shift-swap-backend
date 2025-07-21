const Leave = require("../models/LeaveRequest");
const asyncHandler = require("../utils/asyncHandler");


exports.createLeave = asyncHandler(async (req, res, next) => {
  const leave = new Leave({ ...req.body, user: req.user.id });
  await leave.save();
  res.status(201).json(leave);
});

exports.getMyLeaves = asyncHandler(async (req, res, next) => {
  const leaves = await Leave.find({ user: req.user.id });
  res.json(leaves);
});

exports.updateLeaveStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.params;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const leave = await Leave.findById(req.params.id);
  if (!leave) {
    return res.status(404).json({ error: "Leave not found" });
  }

  leave.status = status;
  await leave.save();

  res.json(leave);
});

exports.getAllLeaves = asyncHandler(async (req, res, next) => {
  const leaves = await Leave.find().populate("user", "firstName lastName");
  res.json(leaves);
});