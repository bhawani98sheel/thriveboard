const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");


dotenv.config();
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/tasks", require("./routes/taskRoutes"));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
