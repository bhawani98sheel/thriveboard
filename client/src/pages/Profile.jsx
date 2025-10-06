// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile({ theme, setProfile: updateAppProfile }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [prefTheme, setPrefTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // 🔹 Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile/me", authHeaders);
      setProfile(res.data);
      setName(res.data.name);
      setBio(res.data.bio);
      setPrefTheme(res.data.preferences?.theme || "light");
      setNotifications(res.data.preferences?.notifications ?? true);

      // ✅ keep App.jsx in sync too
      if (updateAppProfile) updateAppProfile(res.data);
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError("Error fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🔹 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/profile",
        { name, bio, preferences: { theme: prefTheme, notifications } },
        authHeaders
      );
      setProfile(res.data);

      // ✅ sync App.jsx instantly
      if (updateAppProfile) updateAppProfile(res.data);

      alert("✅ Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Error updating profile");
    }
  };

  // 🔹 Upload avatar
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await axios.post("/api/profile/avatar", formData, {
        ...authHeaders,
        headers: { ...authHeaders.headers, "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setAvatarFile(null);

      // ✅ sync App.jsx instantly
      if (updateAppProfile) updateAppProfile(res.data);

      alert("✅ Avatar uploaded!");
    } catch (err) {
      console.error("Upload avatar error:", err);
      alert("❌ Error uploading avatar");
    }
  };

  // 🔹 Delete avatar
  const handleAvatarDelete = async () => {
    try {
      const res = await axios.delete("/api/profile/avatar", authHeaders);
      setProfile(res.data.profile);

      // ✅ sync App.jsx instantly
      if (updateAppProfile) updateAppProfile(res.data.profile);

      alert("✅ Avatar deleted!");
    } catch (err) {
      console.error("Delete avatar error:", err);
      alert("❌ Error deleting avatar");
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!profile) return <h2>Loading...</h2>;

  // 🔹 Theme-aware wrapper
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
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>👤 Profile</h2>

          {/* Avatar Section */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={
                profile.avatar
                  ? `http://localhost:5000${profile.avatar}`
                  : "/default-avatar.png"
              }
              alt="Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <form onSubmit={handleAvatarUpload} style={{ marginTop: "10px" }}>
              <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
              <button type="submit" style={{ marginLeft: "10px" }}>Upload</button>
            </form>
            <button
              onClick={handleAvatarDelete}
              style={{
                marginTop: "10px",
                background: "red",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              🗑 Delete Avatar
            </button>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdate}>
            <label>Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>Theme:</label>
            <select
              value={prefTheme}
              onChange={(e) => setPrefTheme(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            <label>
              Notifications:
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                style={{ marginLeft: "10px" }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                borderRadius: "6px",
                background: theme === "dark" ? "#2563eb" : "#1d4ed8",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              💾 Save Changes
            </button>
          </form>

          {/* Stats */}
          <h3 style={{ marginTop: "20px" }}>📊 Stats</h3>
          <p><strong>Daily Tasks:</strong> {profile.stats?.dailyTasks || 0}</p>
          <p><strong>Uploads:</strong> {profile.stats?.uploads || 0}</p>
          <p><strong>🔥 Streak:</strong> {profile.stats?.streak || 0} days</p>
        </div>
      </div>
    </div>
  );
}
