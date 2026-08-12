const express = require("express");
const router = express.Router();
const LoginHistory = require("../model/loginHistory");
const Otp = require("../model/otp");
const { sendOtpEmail } = require("../utils/mailer");

// Helper to determine IP address
const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || "127.0.0.1";
};

// Record login attempt & enforce environment security rules
router.post("/record-login", async (req, res) => {
  try {
    const { email, browser, os, deviceType } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const ipAddress = getClientIp(req);
    const normalizedBrowser = browser || "Unknown Browser";
    const normalizedOs = os || "Unknown OS";
    const normalizedDevice = (deviceType || "desktop").toLowerCase();

    // RULE 1: Mobile Device Access Constraint (Allowed strictly between 10:00 AM and 1:00 PM)
    const now = new Date();
    const currentHour = now.getHours(); // 0 to 23
    const isMobile = normalizedDevice === "mobile" || normalizedOs.toLowerCase().includes("android") || normalizedOs.toLowerCase().includes("ios");

    if (isMobile) {
      // Allowed window: 10:00 AM (10) up to 1:00 PM (13)
      const isWithinTimeWindow = currentHour >= 10 && currentHour < 13;
      if (!isWithinTimeWindow) {
        // Record blocked login attempt in DB
        await LoginHistory.create({
          email,
          browser: normalizedBrowser,
          os: normalizedOs,
          deviceType: "mobile",
          ipAddress,
          status: "Blocked (Mobile Time Constraint)",
        });

        return res.status(403).json({
          success: false,
          blocked: true,
          message: "Access blocked: Mobile logins are only permitted between 10:00 AM and 1:00 PM.",
        });
      }
    }

    // RULE 2: Google Chrome OTP Verification Requirement
    const isChrome = normalizedBrowser.toLowerCase().includes("chrome") && !normalizedBrowser.toLowerCase().includes("edg") && !normalizedBrowser.toLowerCase().includes("opr");

    if (isChrome) {
      // Generate 6-digit OTP code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in database
      await Otp.deleteMany({ email });
      await Otp.create({ email, otp: generatedOtp });

      // Dispatch OTP Email
      await sendOtpEmail(email, generatedOtp);

      // Record OTP Pending attempt in DB
      await LoginHistory.create({
        email,
        browser: normalizedBrowser,
        os: normalizedOs,
        deviceType: normalizedDevice,
        ipAddress,
        status: "OTP Pending",
      });

      return res.json({
        success: true,
        requireOtp: true,
        message: `OTP sent to your registered email (${email}) for Google Chrome login verification.`,
      });
    }

    // Non-Chrome & allowed environment -> Success login log
    await LoginHistory.create({
      email,
      browser: normalizedBrowser,
      os: normalizedOs,
      deviceType: normalizedDevice,
      ipAddress,
      status: "Success",
    });

    return res.json({
      success: true,
      requireOtp: false,
      message: "Login environment verified successfully.",
    });
  } catch (error) {
    console.error("Error in /record-login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Verify OTP for Google Chrome Users
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, browser, os, deviceType } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email, otp: otp.trim() });
    const ipAddress = getClientIp(req);

    if (!otpRecord) {
      await LoginHistory.create({
        email,
        browser: browser || "Google Chrome",
        os: os || "Unknown OS",
        deviceType: deviceType || "desktop",
        ipAddress,
        status: "OTP Failed",
      });

      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please check your email and try again.",
      });
    }

    // Remove OTP after successful use
    await Otp.deleteOne({ _id: otpRecord._id });

    // Record Success login history
    await LoginHistory.create({
      email,
      browser: browser || "Google Chrome",
      os: os || "Unknown OS",
      deviceType: deviceType || "desktop",
      ipAddress,
      status: "Success",
    });

    return res.json({
      success: true,
      message: "OTP verified successfully! Logging you in...",
    });
  } catch (error) {
    console.error("Error in /verify-otp:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch user login history for profile display
router.get("/login-history/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const history = await LoginHistory.find({ email }).sort({ timestamp: -1 }).limit(50);
    return res.json({ success: true, history });
  } catch (error) {
    console.error("Error fetching login history:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
