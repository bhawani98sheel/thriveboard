// server/routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} = require("../controllers/profileController");

// ✅ Setup multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ Routes
router.get("/me", authMiddleware, getMyProfile);
router.put("/", authMiddleware, updateProfile);
router.post("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", authMiddleware, deleteAvatar);

module.exports = router;
