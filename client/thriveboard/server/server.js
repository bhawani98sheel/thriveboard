const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// DB connection
const connectDB = require("./config/db");
connectDB();

const app = express();

// 🧩 CORS setup — allow frontend (Netlify) + local dev
app.use(cors({
  origin: ["http://localhost:5173", "https://thriveboard.netlify.app"],
  credentials: true,
}));

app.use(express.json());

// Routes
const profileRoutes = require("./routes/profileRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route (for Render check)
app.get("/", (req, res) => {
  res.send("Thriveboard API is running 🚀");
});

// MongoDB Connection Log (optional)
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB Connected");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
