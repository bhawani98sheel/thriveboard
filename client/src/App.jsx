// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [profile, setProfile] = useState(null);
  const [theme, setTheme] = useState("light");
  const [tasks, setTasks] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // fetch profile + tasks
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [profileRes, tasksRes] = await Promise.all([
          axios.get("/api/profile/me", authHeaders),
          axios.get("/api/tasks", authHeaders),
        ]);
        setProfile(profileRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ watch profile changes and update theme
  useEffect(() => {
    if (profile?.preferences?.theme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [profile]);

  // ✅ apply/remove dark class when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <Router>
      {user && <Navbar theme={theme} />}
      <Routes>
        <Route path="/" element={<Landing theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/register" element={<Register theme={theme} />} />
        <Route
          path="/dashboard"
          element={<Dashboard profile={profile} tasks={tasks} theme={theme} />}
        />
        <Route path="/files" element={<Files theme={theme} />} />
        <Route
          path="/planner"
          element={<Planner tasks={tasks} setTasks={setTasks} theme={theme} />}
        />
        <Route
  path="/profile"
  element={<Profile profile={profile} setProfile={setProfile} theme={theme} />}
/>

       
        <Route
          path="/settings"
          element={<Settings profile={profile} theme={theme} />}
        />
      </Routes>
      
    </Router>
  );
}

export default App;
