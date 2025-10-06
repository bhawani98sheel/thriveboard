// src/components/RecentActivity.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Upload, Bell } from "lucide-react";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const res = await axios.get("/api/activity", authHeaders);
      setActivities(res.data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Detect current theme
  const theme =
    document.documentElement.classList.contains("dark") ? "dark" : "light";

  // Styles
  const cardStyle = {
    light: { background: "#ffffff", color: "#111827" },
    dark: { background: "#1f2937", color: "#f9fafb" },
  };
  const dividerStyle = {
    light: { borderBottom: "1px solid #e5e7eb" },
    dark: { borderBottom: "1px solid #374151" },
  };
  const buttonStyle = {
    light: { color: "#2563eb" },
    dark: { color: "#60a5fa" },
  };
  const mutedText = {
    light: { color: "#6b7280" },
    dark: { color: "#9ca3af" },
  };

  // Pick icon by activity type
  const getIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckCircle style={{ color: "#22c55e" }} size={18} />;
      case "upload":
        return <Upload style={{ color: "#3b82f6" }} size={18} />;
      case "notify":
        return <Bell style={{ color: "#eab308" }} size={18} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        ...cardStyle[theme],
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        padding: "16px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "12px",
        }}
      >
        📌 Recent Activity
      </h3>

      <div style={{ maxHeight: "240px", overflowY: "auto" }}>
        {activities.length > 0 ? (
          activities.slice(0, 7).map((activity, idx) => (
            <div key={activity.id || idx}>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                  padding: "6px 0",
                }}
              >
                {getIcon(activity.type)}
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>
                    {activity.message}
                  </p>
                  <p style={{ fontSize: "12px", ...mutedText[theme] }}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {idx < activities.length - 1 && (
                <div style={dividerStyle[theme]} />
              )}
            </div>
          ))
        ) : (
          <p
            style={{
              fontSize: "14px",
              textAlign: "center",
              padding: "12px",
              ...mutedText[theme],
            }}
          >
            No recent activity yet.
          </p>
        )}
      </div>

      <button
        style={{
          marginTop: "12px",
          width: "100%",
          fontSize: "14px",
          fontWeight: "500",
          textAlign: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          ...buttonStyle[theme],
        }}
        onClick={() => alert("⚡ Hook this to /activity page later")}
      >
        View All
      </button>
    </div>
  );
}
