// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import SimpleCalendar from "../components/SimpleCalendar";
import RecentActivity from "../components/RecentActivity";

export default function Dashboard({ theme }) {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile/me", authHeaders);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks", authHeaders);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };
  // inside Dashboard.jsx


// after fetching profile, tasks, files we can build activity log
const activities = [];

// files
files.slice(0, 5).forEach((f) => {
  activities.push({ message: `📂 Uploaded ${f.filename}`, time: new Date(f.uploadedAt).toLocaleString() });
});

// tasks
tasks.slice(0, 5).forEach((t) => {
  activities.push({
    message: t.completed ? `✅ Completed task: ${t.title}` : `📝 Added task: ${t.title}`,
    time: new Date(t.dueDate).toLocaleDateString(),
  });
});

// sort by newest
activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Fetch files
  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/files", authHeaders);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTasks();
    fetchFiles();
  }, []);

  // ✅ Live stats
  const completedTasks = tasks.filter((t) => t.completed).length;
  const todayCount = tasks.filter(
    (t) => new Date(t.dueDate).toDateString() === new Date().toDateString()
  ).length;
  const uploadedFiles = files.length;

  return (
    <PageWrapper theme={theme}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📊 Dashboard</h2>

        {/* Profile Card */}
        {profile ? (
          <div
            style={{
              background: theme === "dark" ? "#1f2937" : "#f3f4f6",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3>👤 {profile.name}</h3>
            <p>{profile.bio || "No bio added yet."}</p>
            <p>
              Theme: <b>{profile.preferences?.theme}</b> | Notifications:{" "}
              <b>{profile.preferences?.notifications ? "On" : "Off"}</b>
            </p>
            <p>
              ✅ Tasks done: {completedTasks} | 📂 Files uploaded: {uploadedFiles} | 🔥
              Streak: {profile.stats?.streak || 0} days
            </p>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "gray" }}>
            Please log in to view your dashboard.
          </p>
        )}

        {/* Task Summary + Streak */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: theme === "dark" ? "#1e3a8a" : "#e0f2fe",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h4>📌 Tasks Today</h4>
            <p>{todayCount} tasks scheduled</p>
          </div>

          <div
            style={{
              background: theme === "dark" ? "#064e3b" : "#dcfce7",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h4>🔥 Streak</h4>
            <p>{profile?.stats?.streak || 0} days</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: "20px" }}>
          <RecentActivity />
        </div>

        {/* Calendar */}
        <div
          style={{
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ marginBottom: "10px", fontWeight: "600" }}>
            📅 Task Calendar
          </h4>
          <SimpleCalendar tasks={tasks} />
        </div>
      </div>
    </PageWrapper>
  );
}
