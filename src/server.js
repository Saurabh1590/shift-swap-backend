const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const swapRoutes = require("./routes/swapRoutes");
const userRoutes = require("./routes/userRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const errorMiddleware = require("./middleware/errorMiddleware"); 

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/swap", swapRoutes);
app.use("/api/shift", shiftRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));