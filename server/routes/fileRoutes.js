// server/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadFile, getUserFiles, deleteFile } = require("../controllers/fileController");

// ✅ Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ Define routes
router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getUserFiles);
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;
