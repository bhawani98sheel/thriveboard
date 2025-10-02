const Task = require("../models/Task");
const Profile = require("../models/Profile");

// @desc Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create task
const createTask = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date required" });
    }

    const task = new Task({
      title,
      dueDate,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Toggle task completion + streak update
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    // 🔥 Check streaks only if toggling a task due today
    const today = new Date().toDateString();
    const todayTasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: new Date(today), $lt: new Date(new Date(today).getTime() + 86400000) },
    });

    const allCompleted = todayTasks.length > 0 && todayTasks.every((t) => t.completed);

    const profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      if (allCompleted) {
        profile.stats.streak += 1; // increment streak if all done
      } else if (!task.completed) {
        // if a task got undone, reset streak
        profile.stats.streak = 0;
      }
      await profile.save();
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
};
