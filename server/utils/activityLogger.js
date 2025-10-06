const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../activity.log");

/**
 * Simple activity logger to record user actions
 * (Optional — just logs to a file for now)
 */
exports.logActivity = async (userId, type, message) => {
  try {
    const entry = `[${new Date().toISOString()}] [User:${userId}] [${type}] ${message}\n`;
    fs.appendFileSync(logFilePath, entry);
  } catch (err) {
    console.error("Error writing activity log:", err.message);
  }
};
