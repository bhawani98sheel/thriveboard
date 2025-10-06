const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    size: { type: Number, required: true },      // ✅ required
    mimetype: { type: String, required: true },  // ✅ required
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
