import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ theme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear JWT
    navigate("/"); // ✅ go back to landing
  };

  // Theme-aware colors
  const bgColor = theme === "dark" ? "#1f2937" : "#2563eb";
  const linkColor = "#fff";
  const activeLinkColor = theme === "dark" ? "#60a5fa" : "#93c5fd";

  const linkStyle = (path) => ({
    color: location.pathname === path ? activeLinkColor : linkColor,
    textDecoration: "none",
    fontWeight: location.pathname === path ? "700" : "500",
  });

  const logoutStyle = {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const mobileLinkStyle = (path) => ({
    color: location.pathname === path ? activeLinkColor : linkColor,
    textDecoration: "none",
    padding: "8px 0",
    fontWeight: location.pathname === path ? "700" : "500",
  });

  return (
    <nav
      style={{
        background: bgColor,
        color: "white",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* ✅ Logo always goes to Landing */}
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ThriveBoard 🚀
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links" style={{ display: "flex", gap: "20px" }}>
          {user ? (
            <>
              <Link to="/dashboard" style={linkStyle("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/planner" style={linkStyle("/planner")}>
                Planner
              </Link>
              <Link to="/files" style={linkStyle("/files")}>
                Files
              </Link>
              <Link to="/profile" style={linkStyle("/profile")}>
                Profile
              </Link>
              <button onClick={handleLogout} style={logoutStyle}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" style={linkStyle("/")}>
                Home
              </Link>
              <Link to="/login" style={linkStyle("/login")}>
                Login
              </Link>
              <Link to="/register" style={linkStyle("/register")}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="mobile-menu"
          style={{
            display: "flex",
            flexDirection: "column",
            background: theme === "dark" ? "#111827" : "#1e40af",
            padding: "10px",
          }}
        >
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={mobileLinkStyle("/dashboard")}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/planner"
                style={mobileLinkStyle("/planner")}
                onClick={() => setMenuOpen(false)}
              >
                Planner
              </Link>
              <Link
                to="/files"
                style={mobileLinkStyle("/files")}
                onClick={() => setMenuOpen(false)}
              >
                Files
              </Link>
              <Link
                to="/profile"
                style={mobileLinkStyle("/profile")}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{ ...logoutStyle, marginTop: "10px" }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                style={mobileLinkStyle("/")}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/login"
                style={mobileLinkStyle("/login")}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={mobileLinkStyle("/register")}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
