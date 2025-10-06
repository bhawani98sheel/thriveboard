// server/controllers/fileController.js
const fs = require("fs");
const path = require("path");
const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = await File.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
    });

    res.json(file);
  } catch (err) {
    console.error("uploadFile error:", err);
    res.status(500).json({ message: "Error uploading file" });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("getUserFiles error:", err);
    res.status(500).json({ message: "Error fetching files" });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(__dirname, "..", "uploads", file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("deleteFile error:", err);
    res.status(500).json({ message: "Error deleting file" });
  }
};
