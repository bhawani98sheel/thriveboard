import React, { useEffect, useState } from "react";
import axios from "axios";

function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const authHeaders = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // Fetch files
  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/files", authHeaders);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload file
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Choose a file first");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile); // ✅ must match backend `upload.single("file")`

      const res = await axios.post("/api/files", formData, {
        ...authHeaders,
        headers: {
          ...authHeaders.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      setFiles([res.data, ...files]);
      setSelectedFile(null);
      alert("✅ File uploaded!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("❌ Error uploading file");
    }
  };

  // Delete file
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/files/${id}`, authHeaders);
      setFiles(files.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h2>📂 Files</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button type="submit" style={{ marginLeft: "10px" }}>Upload</button>
      </form>

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((file) => (
            <li
              key={file._id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <a
                href={`http://localhost:5000${file.filepath}`}
                target="_blank"
                rel="noreferrer"
              >
                {file.filename}
              </a>
              <button
                onClick={() => handleDelete(file._id)}
                style={{
                  marginLeft: "10px",
                  background: "red",
                  color: "white",
                  padding: "3px 8px",
                }}
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Files;
