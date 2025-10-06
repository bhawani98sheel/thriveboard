// src/pages/Files.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Files({ theme }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("/api/files", authHeaders);
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Choose a file first");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post("/api/files", formData, {
        ...authHeaders,
        headers: { ...authHeaders.headers, "Content-Type": "multipart/form-data" },
      });
      setFiles([res.data, ...files]);
      setSelectedFile(null);
    } catch {
      alert("❌ Error uploading file");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`, authHeaders);
      setFiles(files.filter((f) => f._id !== id));
    } catch {
      alert("❌ Error deleting file");
    }
  };

  const wrapperStyle =
    theme === "dark"
      ? { background: "#111827", color: "#f9fafb", width: "100%", minHeight: "100vh", padding: "40px" }
      : { background: "#f9fafb", color: "#111827", width: "100%", minHeight: "100vh", padding: "40px" };

  const cardStyle =
    theme === "dark"
      ? { background: "#1f2937", border: "1px solid #374151", padding: "12px", borderRadius: "6px" }
      : { background: "#ffffff", border: "1px solid #ddd", padding: "12px", borderRadius: "6px" };

  return (
    <div style={wrapperStyle}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2>📂 Files</h2>
        <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button type="submit" style={{ marginLeft: "10px", padding: "6px 12px", borderRadius: "6px", background: theme === "dark" ? "#2563eb" : "#1d4ed8", color: "#fff", border: "none" }}>
            Upload
          </button>
        </form>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {files.map((file) => (
              <li key={file._id} style={{ ...cardStyle, marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href={`http://localhost:5000${file.filepath}`} target="_blank" rel="noreferrer" style={{ color: theme === "dark" ? "#93c5fd" : "#1d4ed8", textDecoration: "none" }}>
                    {file.filename}
                  </a>
                  <button onClick={() => handleDelete(file._id)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
