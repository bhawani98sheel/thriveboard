const File = require("../models/File");

// Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const file = new File({
      user: req.user._id,
      filename: req.file.originalname,
      filepath: "/uploads/" + req.file.filename,
      size: req.file.size,          // ✅ now saving size
      mimetype: req.file.mimetype,  // ✅ now saving mimetype
    });

    await file.save();
    res.status(201).json(file);
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get user files
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadFile, getFiles, deleteFile };
