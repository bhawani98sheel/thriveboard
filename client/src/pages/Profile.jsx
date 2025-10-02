import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    theme: "light",
    notifications: true,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const profileId = "68de9c8d168595b9d0db2788"; // your seeded profile

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${profileId}`);
        setProfile(res.data);
        setFormData({
          name: res.data.name || "",
          bio: res.data.bio || "",
          theme: res.data.preferences?.theme || "light",
          notifications: res.data.preferences?.notifications ?? true,
        });
      } catch (err) {
        setError("Error fetching profile");
      }
    };
    fetchProfile();
  }, [profileId]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/profile/${profileId}`, {
        name: formData.name,
        bio: formData.bio,
        preferences: {
          theme: formData.theme,
          notifications: formData.notifications,
        },
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      setError("Error updating profile");
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;

    const formDataObj = new FormData();
    formDataObj.append("avatar", avatarFile);

    try {
      const res = await axios.post(`/api/profile/${profileId}/avatar`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setAvatarFile(null);
    } catch (err) {
      setError("Error uploading avatar");
    }
  };

  if (error) return <h2>{error}</h2>;
  if (!profile) return <h2>Loading profile...</h2>;

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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>👤 Profile</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={profile.avatar ? `http://localhost:5000${profile.avatar}` : "/default-avatar.png"}
          alt="Avatar"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
        />
      </div>

      {/* Avatar Upload */}
      <form onSubmit={handleAvatarUpload} style={{ marginBottom: "20px", textAlign: "center" }}>
        <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} />
        <button type="submit" style={{ marginLeft: "10px", padding: "5px 10px" }}>Upload</button>
      </form>

      {!editing ? (
        <>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Theme:</strong> {profile.preferences?.theme}</p>
          <p><strong>Notifications:</strong> {profile.preferences?.notifications ? "Enabled" : "Disabled"}</p>
          <p><strong>Created:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "N/A"}</p>

          <button
            onClick={() => setEditing(true)}
            style={{ marginTop: "20px", padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px" }}
          >
            ✏️ Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ padding: "5px", width: "100%" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Bio: </label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} style={{ padding: "5px", width: "100%" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Theme: </label>
            <select name="theme" value={formData.theme} onChange={handleChange} style={{ padding: "5px", width: "100%" }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input type="checkbox" name="notifications" checked={formData.notifications} onChange={handleChange} /> Enable Notifications
            </label>
          </div>
          <button type="submit" style={{ padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "5px", marginRight: "10px" }}>
            💾 Save
          </button>
          <button type="button" onClick={() => setEditing(false)} style={{ padding: "10px 20px", background: "#dc2626", color: "white", border: "none", borderRadius: "5px" }}>
            ❌ Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default Profile;
