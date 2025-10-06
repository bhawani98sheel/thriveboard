const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUpload");

const {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/", protect, updateProfile);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", protect, deleteAvatar);

module.exports = router;
