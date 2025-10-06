// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Landing({ theme }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Motivational Quotes
  const quotes = [
    "“Success is the sum of small efforts repeated daily.” 💪",
    "“Focus on being productive instead of busy.” 🚀",
    "“Do something today that your future self will thank you for.” 🌱",
    "“Productivity is never an accident, it's always the result of commitment.” ⚡",
    "“Dream big, start small, but most of all, start.” ✨",
  ];

  // Auto-change every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const wrapperStyle =
    theme === "dark"
      ? {
          background: "#111827",
          color: "#f9fafb",
          minHeight: "100vh",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }
      : {
          background: "#f9fafb",
          color: "#111827",
          minHeight: "100vh",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        };

  const buttonStyle = {
    margin: "10px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={wrapperStyle}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "20px" }}>
        🚀 Welcome to ThriveBoard
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "20px", maxWidth: "500px" }}>
        Organize tasks, manage files, and track your productivity — all in one place.
      </p>

      {/* Motivational Quote */}
      <blockquote
        style={{
          fontStyle: "italic",
          fontSize: "20px",
          marginBottom: "40px",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {quotes[quoteIndex]}
      </blockquote>

      {!user ? (
        <div>
          <Link to="/login">
            <button
              style={{
                ...buttonStyle,
                background: theme === "dark" ? "#2563eb" : "#1d4ed8",
                color: "white",
              }}
            >
              🔑 Login
            </button>
          </Link>
          <Link to="/register">
            <button
              style={{
                ...buttonStyle,
                background: theme === "dark" ? "#10b981" : "#059669",
                color: "white",
              }}
            >
              📝 Register
            </button>
          </Link>
        </div>
      ) : (
        <Link to="/dashboard">
          <button
            style={{
              ...buttonStyle,
              background: theme === "dark" ? "#10b981" : "#059669",
              color: "white",
            }}
          >
            📊 Go to Dashboard
          </button>
        </Link>
      )}
    </div>
  );
}

export default Landing;
