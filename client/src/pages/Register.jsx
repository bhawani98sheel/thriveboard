// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register({ theme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", { name, email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard"); // after register
    } catch (err) {
      alert("❌ Registration failed");
    }
  };

  const wrapperStyle =
    theme === "dark"
      ? {
          background: "#111827",
          color: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }
      : {
          background: "#f9fafb",
          color: "#111827",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        };

  const cardStyle =
    theme === "dark"
      ? { background: "#1f2937", padding: "30px", borderRadius: "8px", width: "350px" }
      : { background: "#ffffff", padding: "30px", borderRadius: "8px", width: "350px" };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📝 Register</h2>
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "10px", padding: "10px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "10px", padding: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "10px", padding: "10px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#1048b9ff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
