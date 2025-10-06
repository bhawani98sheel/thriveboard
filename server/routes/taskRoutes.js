// server/routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const { logActivity } = require("../utils/activityLogger");

// ✅ Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add new task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date required" });
    }

    const newTask = await Task.create({
      user: req.user.id,
      title,
      dueDate,
    });

    // Log activity
    await logActivity(req.user.id, "task", `Added new task: ${title}`);

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Error adding task" });
  }
});

// ✅ Toggle completion
router.put("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    await logActivity(
      req.user.id,
      "task",
      `Marked task "${task.title}" as ${task.completed ? "done ✅" : "not done ❌"}`
    );

    res.json(task);
  } catch (err) {
    console.error("Error toggling task:", err);
    res.status(500).json({ message: "Error toggling task" });
  }
});

// ✅ Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    await logActivity(req.user.id, "task", `Deleted task: ${deleted.title}`);

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
});

module.exports = router;
