const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const { logActivity } = require("../utils/activityLogger");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate)
      return res.status(400).json({ message: "Title and due date required" });

    const task = await Task.create({
      user: req.user.id,
      title,
      dueDate,
    });

    await logActivity(req.user.id, "task", `Added new task: ${title}`);
    res.json(task);
  } catch (err) {
    console.error("❌ Error adding task:", err);
    res.status(500).json({ message: "Error adding task" });
  }
});

module.exports = router;
