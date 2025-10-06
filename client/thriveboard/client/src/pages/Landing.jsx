import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌟 ThriveBoard</h1>
      <p>Track. Plan. Thrive.</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Landing;
