const express = require("express");
const router = express.Router();
const { uploadFile, getFiles, deleteFile } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUpload");

router.get("/", protect, getFiles);
router.post("/", protect, upload.single("file"), uploadFile);  // ✅ field name must be "file"
router.delete("/:id", protect, deleteFile);

module.exports = router;
