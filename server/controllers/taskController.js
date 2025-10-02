const Task = require("../models/Task");
const Profile = require("../models/Profile");

// Toggle completion
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    // ✅ Update user stats
    const profile = await Profile.findOne({ user: task.user }); // when JWT is ready
    if (profile) {
      const today = new Date().toDateString();

      // Count all tasks due today
      const todayTasks = await Task.find({
        user: task.user,
        dueDate: { $gte: new Date(today), $lt: new Date(today + " 23:59:59") }
      });

      const allCompleted = todayTasks.length > 0 && todayTasks.every((t) => t.completed);

      if (allCompleted) {
        const lastDate = profile.stats.lastCompletedDate
          ? new Date(profile.stats.lastCompletedDate).toDateString()
          : null;

        if (lastDate === today) {
          // already counted today
        } else {
          // ✅ increment streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDate === yesterday.toDateString()) {
            profile.stats.streak += 1;
          } else {
            profile.stats.streak = 1; // restart streak
          }
          profile.stats.lastCompletedDate = new Date();
        }
      }

      await profile.save();
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { toggleTask /* plus your other task functions */ };
