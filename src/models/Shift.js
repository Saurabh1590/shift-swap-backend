const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  date: Date,
  shiftType: { type: String, enum: ["A", "B", "N"] },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Shift", shiftSchema);