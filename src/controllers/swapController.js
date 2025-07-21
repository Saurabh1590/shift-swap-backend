const Swap = require("../models/SwapRequest");
const Shift = require("../models/Shift");
const asyncHandler = require("../utils/asyncHandler");
const { isActionAllowed } = require('../utils/shiftConfig');

exports.createSwap = asyncHandler(async (req, res, next) => {
  const { offeredShiftDate, offeredShiftType, desiredShiftType, reason } = req.body;

  if (!offeredShiftDate || !offeredShiftType || !desiredShiftType || !reason) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // 1. Check if the user's OWN shift is at least 8 hours away.
  if (!isActionAllowed(offeredShiftDate, offeredShiftType)) {
    return res.status(400).json({ message: `Your offered shift is less than 8 hours away.` });
  }

  // 2. Check if the DESIRED shift is also at least 8 hours away.
  if (!isActionAllowed(offeredShiftDate, desiredShiftType)) {
    return res.status(400).json({ message: `The desired shift is less than 8 hours away or has already passed for the day.` });
  }

  const newSwap = new Swap({
    user: req.user.id,
    offeredShiftDate,
    offeredShiftType,
    desiredShiftType,
    reason,
  });

  await newSwap.save();
  res.status(201).json(newSwap);
});

exports.acceptSwap = asyncHandler(async (req, res, next) => {
  const swap = await Swap.findById(req.params.id);
  if (!swap) return res.status(404).json({ error: "Swap not found" });
  if (swap.status !== "open") return res.status(400).json({ error: "Swap is not available" });
  if (swap.user.equals(req.user.id)) return res.status(400).json({ error: "Cannot accept your own swap" });

  // Validate the offered shift's time limit
  if (!isActionAllowed(swap.offeredShiftDate, swap.offeredShiftType)) {
    return res.status(400).json({ message: `This swap can no longer be accepted as it is less than 8 hours before the shift starts.` });
  }

  // Check if the accepting user has a conflicting shift that is too soon
  const acceptingUserShift = await Shift.findOne({
    employeeId: req.user.id,
    date: swap.offeredShiftDate,
  });

  if (acceptingUserShift) {
    if (!isActionAllowed(acceptingUserShift.date, acceptingUserShift.shiftType)) {
       return res.status(400).json({ message: `You cannot accept this swap as your own shift is less than 8 hours away.` });
    }
  }

  swap.acceptedBy = req.user.id;
  swap.status = "pending_approval";
  await swap.save();
  res.json({ message: "Swap accepted. Awaiting admin approval.", swap });
});

exports.getMySwaps = asyncHandler(async (req, res, next) => {

  const swaps = await Swap.find({
    $or: [{ user: req.user.id }, { acceptedBy: req.user.id }],
  })
    .populate("user", "firstName lastName")
    .populate("acceptedBy", "firstName lastName");

  res.json(swaps);
});

exports.getAllSwaps = asyncHandler(async (req, res, next) => {
  const swaps = await Swap.find()
    .populate("user", "firstName lastName")
    .populate("acceptedBy", "firstName lastName");
  res.json(swaps);
});

exports.updateSwapStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const swap = await Swap.findById(req.params.id);
  if (!swap) return res.status(404).json({ error: "Swap not found" });
  if (swap.status !== "pending_approval") return res.status(400).json({ error: "Swap is not pending approval" });

  if (status === "approved") {
    const originalPosterId = swap.user;
    const acceptingUserId = swap.acceptedBy;
    const shiftDate = swap.offeredShiftDate;

    // Find the original shift being offered for swap
    const offeredShift = await Shift.findOne({
      employeeId: originalPosterId,
      date: shiftDate,
      shiftType: swap.offeredShiftType,
    });
    if (!offeredShift) return res.status(404).json({ error: "The original shift to be swapped could not be found." });

    // Find if the accepting user has a shift to trade
    const shiftToTrade = await Shift.findOne({
      employeeId: acceptingUserId,
      date: shiftDate,
      shiftType: swap.desiredShiftType,
    });
    
    // --- SMART LOGIC ---
    if (shiftToTrade) {
      // SCENARIO 1: It's a TRADE
      // Swap the employee IDs on both shifts
      offeredShift.employeeId = acceptingUserId;
      shiftToTrade.employeeId = originalPosterId;
      await offeredShift.save();
      await shiftToTrade.save();

    } else {
      // SCENARIO 2: It's a COVER (accepting user is on a rest day)
      // Re-assign the offered shift to the accepting user
      offeredShift.employeeId = acceptingUserId;
      await offeredShift.save();
    }
  }

  swap.status = status;
  await swap.save();
  res.json({ message: `Swap has been ${status}.`, swap });
});

exports.getAllSwaps = asyncHandler(async (req, res, next) => {
  const swaps = await Swap.find()
    .populate("user", "firstName lastName")
    .populate("acceptedBy", "firstName lastName"); // <-- ADD THIS LINE

  res.json(swaps);
});