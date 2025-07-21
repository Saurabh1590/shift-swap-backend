const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Renamed for clarity
    offeredShiftDate: { type: Date, required: true },
    offeredShiftType: {
      type: String,
      enum: ["A", "B", "N"],
      required: true,
    },

    // --- NEW FIELD ---
    // The shift type the user wants in exchange
    desiredShiftType: {
        type: String,
        enum: ["A", "B", "N"],
        required: true,
    },

    reason: { type: String, required: true }, // Making reason mandatory for clarity
    status: {
      type: String,
      enum: ["open", "pending_approval", "approved", "rejected"],
      default: "open",
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwapRequest", swapSchema);