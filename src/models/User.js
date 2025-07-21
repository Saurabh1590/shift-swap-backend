const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 2, maxlength: 30 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 30 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: [validator.isStrongPassword, "Weak password"],
    },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    weeklyOffDay: { type: Number, min: 0, max: 6 },
    shiftCycle: { type: String, enum: ["A", "N", "B"], default: "A" },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, min: 18, max: 100 },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/026/966/960/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
      validate: [validator.isURL, "Invalid photo URL"],
    },
    about: { type: String, maxlength: 200 },
    skills: [String],
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 🔐 Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔐 Validate Password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
