// src/pages/Planner.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Planner({ theme }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks", authHeaders);
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
      const res = await axios.post("/api/tasks", { title, dueDate }, authHeaders);
      setTasks([...tasks, res.data]);
      setTitle("");
      setDueDate("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle completion
  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`/api/tasks/${id}/toggle`, {}, authHeaders);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, authHeaders);
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

  // Progress
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;
  const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Theme wrapper
  const wrapperStyle =
    theme === "dark"
      ? { background: "#111827", color: "#f9fafb", minHeight: "100vh", padding: "40px" }
      : { background: "#f9fafb", color: "#111827", minHeight: "100vh", padding: "40px" };

  const cardStyle =
    theme === "dark"
      ? { background: "#1f2937", border: "1px solid #374151", padding: "20px", borderRadius: "8px" }
      : { background: "#ffffff", border: "1px solid #ddd", padding: "20px", borderRadius: "8px" };

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        <div style={cardStyle}>
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
                  background: theme === "dark" ? "#374151" : "#e5e7eb",
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

          {/* Add Task */}
          <form
            onSubmit={addTask}
            style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
          >
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
              <TaskList
                tasks={overdueTasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                theme={theme}
              />
            </>
          )}

          {/* Today */}
          <h3>📌 Today</h3>
          <TaskList
            tasks={todayTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            theme={theme}
          />

          {/* Upcoming */}
          {upcomingTasks.length > 0 && (
            <>
              <h3 style={{ color: "green" }}>🌱 Upcoming</h3>
              <TaskList
                tasks={upcomingTasks}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                theme={theme}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Task List
function TaskList({ tasks, toggleTask, deleteTask, theme }) {
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
            background: task.completed
              ? (theme === "dark" ? "#065f46" : "#d1fae5")
              : (theme === "dark" ? "#1f2937" : "#f3f4f6"),
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <span
            onClick={() => toggleTask(task._id)}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
              fontWeight: task.completed ? "bold" : "normal",
              color: task.completed ? "green" : theme === "dark" ? "#f9fafb" : "black",
            }}
          >
            {task.title} —{" "}
            <small>{new Date(task.dueDate).toLocaleDateString()}</small>
          </span>
          <button
            onClick={() => deleteTask(task._id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🗑 Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
