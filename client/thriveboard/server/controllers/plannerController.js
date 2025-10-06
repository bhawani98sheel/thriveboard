const Planner = require('../models/Planner')

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Planner.find({ user: req.user.userId })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' })
  }
}

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body

    const task = new Planner({
      user: req.user.userId,
      title,
      description,
      date,
      priority
    })

    await task.save()
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' })
  }
}

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, date, completed, priority } = req.body

    const task = await Planner.findOne({
      _id: req.params.taskId,
      user: req.user.userId
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    task.title = title
    task.description = description
    task.date = date
    task.completed = completed
    task.priority = priority

    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' })
  }
}

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Planner.findOneAndDelete({
      _id: req.params.taskId,
      user: req.user.userId
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' })
  }
}