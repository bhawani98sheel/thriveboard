import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) navigate("/login");

  const authHeaders = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile/me", authHeaders);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks", authHeaders);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

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

  const today = new Date().toDateString();
  const todayTasks = tasks.filter((t) => new Date(t.dueDate).toDateString() === today);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;
  const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>📊 Dashboard</h2>

      {profile && (
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={profile.avatar ? `http://localhost:5000${profile.avatar}` : "/default-avatar.png"}
              alt="avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginRight: "20px",
                objectFit: "cover",
              }}
            />
            <div>
              <h3>{profile.name}</h3>
              <p>{profile.bio}</p>
              <p>🔥 Streak: {profile.stats?.streak || 0} days</p>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <Link to="/profile"><button style={buttonStyle}>Edit Profile</button></Link>
            <button onClick={handleLogout} style={{ ...buttonStyle, background: "red", marginLeft: "10px" }}>
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <h3>📅 Today’s Tasks</h3>
        {totalToday > 0 ? (
          <>
            <p>
              ✅ {completedToday}/{totalToday} completed ({progress}%)
            </p>
            <div style={progressContainer}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: progress === 100 ? "green" : "#2563eb",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          </>
        ) : (
          <p>No tasks for today.</p>
        )}
        <Link to="/planner"><button style={buttonStyle}>Go to Planner</button></Link>
      </div>

      <div style={cardStyle}>
        <h3>📂 Recent Files</h3>
        {files.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {files.slice(0, 5).map((file) => (
              <li key={file._id} style={{ marginBottom: "8px" }}>
                <a href={`http://localhost:5000${file.filepath}`} target="_blank" rel="noreferrer">
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
        <Link to="/files"><button style={buttonStyle}>Manage Files</button></Link>
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  background: "#fff",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "8px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const progressContainer = {
  height: "20px",
  background: "#e5e7eb",
  borderRadius: "10px",
  overflow: "hidden",
};

export default Dashboard;
