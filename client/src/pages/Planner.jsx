import React, { useEffect, useState } from "react";
import axios from "axios";

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    try {
      const res = await axios.post("/api/tasks", { title, dueDate });
      setTasks([...tasks, res.data]);
      setTitle("");
      setDueDate("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Group tasks
  const today = new Date().toDateString();
  const todayTasks = tasks.filter((t) => new Date(t.dueDate).toDateString() === today);
  const upcomingTasks = tasks.filter((t) => new Date(t.dueDate) > new Date());
  const overdueTasks = tasks.filter((t) => new Date(t.dueDate) < new Date() && !t.completed);

  // Progress bar for today
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;
  const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div style={{ maxWidth: "650px", margin: "50px auto" }}>
      <h2 style={{ textAlign: "center" }}>📅 Planner</h2>

      {/* Progress Bar */}
      {totalToday > 0 && (
        <div style={{ margin: "20px 0" }}>
          <p>
            ✅ {completedToday}/{totalToday} tasks completed today ({progress}%)
          </p>
          <div
            style={{
              height: "20px",
              background: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: progress === 100 ? "green" : "#2563eb",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={addTask} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 2, padding: "10px" }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          ➕ Add
        </button>
      </form>

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <>
          <h3 style={{ color: "red" }}>⚠️ Overdue</h3>
          <TaskList tasks={overdueTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </>
      )}

      {/* Today */}
      <h3>📌 Today</h3>
      <TaskList tasks={todayTasks} toggleTask={toggleTask} deleteTask={deleteTask} />

      {/* Upcoming */}
      {upcomingTasks.length > 0 && (
        <>
          <h3 style={{ color: "green" }}>🌱 Upcoming</h3>
          <TaskList tasks={upcomingTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </>
      )}
    </div>
  );
}

// Reusable Task List Component
function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: task.completed ? "#d1fae5" : "#f3f4f6", // ✅ completed = green bg
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <span
            onClick={() => toggleTask(task._id, task.completed)}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
              fontWeight: task.completed ? "bold" : "normal",
              color: task.completed ? "green" : "black",
            }}
          >
            {task.title} — <small>{new Date(task.dueDate).toLocaleDateString()}</small>
          </span>
          <button
            onClick={() => deleteTask(task._id)}
            style={{ background: "red", color: "white", border: "none", padding: "5px 10px" }}
          >
            🗑 Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Planner;
