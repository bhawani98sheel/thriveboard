const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // linked later when JWT is added
  },
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true, // ✅ force due date
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
