const fs = require("fs");
const path = require("path");
const Profile = require("../models/Profile");

// @desc Get logged-in user's profile
// @route GET /api/profile/me
// @access Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update profile
// @route PUT /api/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, preferences } = req.body;
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      // if no profile, create one
      profile = new Profile({
        user: req.user._id,
        name,
        bio,
        preferences,
      });
    } else {
      profile.name = name || profile.name;
      profile.bio = bio || profile.bio;
      profile.preferences = preferences || profile.preferences;
      profile.updatedAt = Date.now();
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// @desc Upload avatar
// @route POST /api/profile/avatar
// @access Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.avatar = `/uploads/${req.file.filename}`;
    profile.updatedAt = Date.now();
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error("uploadAvatar error:", err);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

// @desc Delete avatar
// @route DELETE /api/profile/avatar
// @access Private
const deleteAvatar = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (profile.avatar && profile.avatar !== "/images/default-avatar.png") {
      const filePath = path.join(__dirname, "..", profile.avatar.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      profile.avatar = "/images/default-avatar.png";
      profile.updatedAt = Date.now();
      await profile.save();
    }

    res.json({ message: "Avatar deleted", profile });
  } catch (err) {
    console.error("deleteAvatar error:", err);
    res.status(500).json({ message: "Error deleting avatar" });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
};
