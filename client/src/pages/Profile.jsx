import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // 🔹 Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile/me", authHeaders);
      setProfile(res.data);
      setName(res.data.name);
      setBio(res.data.bio);
      setTheme(res.data.preferences?.theme || "light");
      setNotifications(res.data.preferences?.notifications ?? true);
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
        { name, bio, preferences: { theme, notifications } },
        authHeaders
      );
      setProfile(res.data);
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
        headers: {
          ...authHeaders.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(res.data);
      setAvatarFile(null);
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
      alert("✅ Avatar deleted!");
    } catch (err) {
      console.error("Delete avatar error:", err);
      alert("❌ Error deleting avatar");
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!profile) return <h2>Loading...</h2>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>👤 Profile</h2>

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
          <input
            type="file"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
          <button type="submit">Upload Avatar</button>
        </form>
        <button
          onClick={handleAvatarDelete}
          style={{
            marginTop: "10px",
            background: "red",
            color: "white",
            padding: "5px 10px",
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
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
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

        <button type="submit" style={{ marginTop: "15px" }}>
          💾 Save Changes
        </button>
      </form>

      {/* Stats */}
      <h3 style={{ marginTop: "20px" }}>📊 Stats</h3>
      <p>
        <strong>Daily Tasks:</strong> {profile.stats?.dailyTasks || 0}
      </p>
      <p>
        <strong>Uploads:</strong> {profile.stats?.uploads || 0}
      </p>
      <p>
        <strong>🔥 Streak:</strong> {profile.stats?.streak || 0} days
      </p>
    </div>
  );
}

export default Profile;
