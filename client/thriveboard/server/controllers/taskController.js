const Task = require("../models/Task");
const Profile = require("../models/Profile");
const { logActivity } = require("../utils/activityLogger");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

exports.createTask = async (req, res) => {
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
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error adding task" });
  }
};
