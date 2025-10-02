const Profile = require("../models/Profile");

// @desc   Get profile by ID
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Create new profile
const createProfile = async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Update profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Upload avatar
// @route  POST /api/profile/:id/avatar
const uploadAvatar = async (req, res) => {
  try {
    console.log("File received:", req.file); // ✅ debug log

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.avatar = `/uploads/${req.file.filename}`;
    profile.updatedAt = Date.now();
    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading avatar", error: error.message });
  }
};

module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
  uploadAvatar, // ✅ export avatar upload
};
