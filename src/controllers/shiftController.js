const Shift = require("../models/Shift");
const asyncHandler = require("../utils/asyncHandler");

exports.createShift = asyncHandler(async (req, res, next) => {
  const shift = new Shift(req.body);
  await shift.save();
  res.status(201).json(shift);
});

exports.getAllShifts = asyncHandler(async (req, res, next) => {
  const shifts = await Shift.find().populate(
    "employeeId",
    "firstName lastName"
  );
  res.json(shifts);
});

exports.getMyShifts = asyncHandler(async (req, res, next) => {
  const shifts = await Shift.find({ employeeId: req.user.id });
  res.json(shifts);
});

exports.updateShift = asyncHandler(async (req, res, next) => {
  const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true,
  });

  if (!shift) {
    return res.status(404).json({ message: 'Shift not found' });
  }

  res.status(200).json(shift);
});