const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  browser: {
    type: String,
    default: "Unknown Browser",
  },
  os: {
    type: String,
    default: "Unknown OS",
  },
  deviceType: {
    type: String,
    enum: ["desktop", "laptop", "mobile"],
    default: "desktop",
  },
  ipAddress: {
    type: String,
    default: "127.0.0.1",
  },
  status: {
    type: String,
    enum: ["Success", "Blocked (Mobile Time Constraint)", "OTP Pending", "OTP Failed"],
    default: "Success",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginHistory", loginHistorySchema);
