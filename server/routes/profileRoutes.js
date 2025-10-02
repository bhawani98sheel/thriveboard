const express = require("express");
const {
  getProfileById,
  createProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/profileController");

const upload = require("../middleware/fileUpload");

const router = express.Router();

router.get("/:id", getProfileById);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.post("/:id/avatar", upload.single("avatar"), uploadAvatar); // ✅ avatar route

module.exports = router;
