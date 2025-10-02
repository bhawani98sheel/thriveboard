import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Planner from "../pages/Planner";
import Files from "../pages/Files";

function AppRoutes() {
  return (
    <>
      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/planner">Planner</Link> |{" "}
        <Link to="/files">Files</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/files" element={<Files />} />
        <Route path="*" element={<h2 style={{ textAlign: "center", color: "red" }}>404 - Not Found</h2>} />
      </Routes>
    </>
  );
}

export default AppRoutes;
