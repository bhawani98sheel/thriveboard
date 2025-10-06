// src/components/PageWrapper.jsx
import React from "react";

export default function PageWrapper({ theme, children }) {
  const wrapperStyle =
    theme === "dark"
      ? {
          background: "#111827", // dark gray
          color: "#f9fafb",     // light text
          minHeight: "100vh",
          width: "100%",        // ✅ full width
          padding: "40px 20px",
          transition: "background 0.3s, color 0.3s",
        }
      : {
          background: "#f9fafb", // light background
          color: "#111827",     // dark text
          minHeight: "100vh",
          width: "100%",        // ✅ full width
          padding: "40px 20px",
          transition: "background 0.3s, color 0.3s",
        };

  return <div style={wrapperStyle}>{children}</div>;
}
