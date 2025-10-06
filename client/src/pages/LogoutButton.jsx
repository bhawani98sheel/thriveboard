import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ clear user token/session
    navigate("/"); // ✅ go to Landing page
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "red",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      🚪 Logout
    </button>
  );
}

export default LogoutButton;
