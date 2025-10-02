const express = require("express");
const router = express.Router();
const { getTasks, createTask, deleteTask, toggleTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Get all tasks
router.get("/", protect, getTasks);

// Create task
router.post("/", protect, createTask);

// Toggle completion
router.put("/:id/toggle", protect, toggleTask);   // ✅ no () here

// Delete task
router.delete("/:id", protect, deleteTask);

module.exports = router;
