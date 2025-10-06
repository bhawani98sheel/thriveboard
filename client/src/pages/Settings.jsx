// src/pages/Settings.jsx
import React from "react";

export default function Settings({ theme }) {
  const wrapperStyle =
    theme === "dark"
      ? { background: "#111827", color: "#f9fafb", width: "100%", minHeight: "100vh", padding: "40px" }
      : { background: "#f9fafb", color: "#111827", width: "100%", minHeight: "100vh", padding: "40px" };

  const cardStyle =
    theme === "dark"
      ? { background: "#1f2937", border: "1px solid #374151", padding: "20px", borderRadius: "8px" }
      : { background: "#ffffff", border: "1px solid #ddd", padding: "20px", borderRadius: "8px" };

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={cardStyle}>
          <h2>⚙️ Settings</h2>
          <p>This is your settings page. (You can expand with preferences or integrations)</p>
        </div>
      </div>
    </div>
  );
}
