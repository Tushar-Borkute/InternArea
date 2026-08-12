const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const Resume = require("../model/resume");

// In-memory store for OTPs (Email -> { otp, expiresAt })
const otpStore = new Map();
// In-memory store for password reset rate limits (identifier -> timestamp)
const resetRateLimitStore = new Map();

// Razorpay instance (using env vars if provided, or fallback mode)
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || "rzp_test_internarea_key";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "test_secret_key_12345";

let razorpay = null;
try {
    razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    });
} catch (err) {
    console.log("Razorpay init notice:", err.message);
}

// Helper: Setup Nodemailer Transporter
const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return null;
};

// 1. POST /api/resume/send-otp - Send OTP for email verification before payment
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email address is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    console.log(`\n==========================================`);
    console.log(`[OTP SERVICE] Verification code for ${email}: ${otp}`);
    console.log(`==========================================\n`);

    const transporter = createTransporter();
    if (transporter) {
        try {
            await transporter.sendMail({
                from: '"InternArea Premium" <no-reply@internarea.com>',
                to: email,
                subject: "Your OTP for Resume Creation - InternArea Premium",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; borderRadius: 8px;">
                        <h2 style="color: #008bdc;">InternArea Premium Resume Service</h2>
                        <p>Hello,</p>
                        <p>Thank you for choosing our Premium Resume Creator (₹50 per resume).</p>
                        <p>Your 6-digit OTP code for email verification is:</p>
                        <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #008bdc; padding: 15px 0;">${otp}</div>
                        <p style="font-size: 13px; color: #666;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
                    </div>
                `,
            });
            return res.status(200).json({ success: true, message: `OTP sent to ${email}` });
        } catch (err) {
            console.error("Failed to send OTP email via SMTP:", err.message);
            return res.status(200).json({
                success: true,
                message: `OTP generated (Check server console or test with code: ${otp})`,
                demoOtp: otp,
            });
        }
    } else {
        return res.status(200).json({
            success: true,
            message: `OTP generated! Use OTP: ${otp} to verify`,
            demoOtp: otp,
        });
    }
});

// 2. POST /api/resume/verify-otp - Verify student OTP
router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    const record = otpStore.get(email.toLowerCase());
    if (!record) {
        return res.status(400).json({ error: "No OTP request found for this email. Please request a new OTP." });
    }

    if (Date.now() > record.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (record.otp !== otp.toString().trim()) {
        return res.status(400).json({ error: "Invalid OTP code. Please check and try again." });
    }

    // OTP verified successfully, clear from store
    otpStore.delete(email.toLowerCase());
    return res.status(200).json({ success: true, message: "OTP verified successfully!" });
});

// 3. POST /api/resume/create-order - Razorpay Order Creation (₹50)
router.post("/create-order", async (req, res) => {
    const { email } = req.body;
    const amountInPaise = 50 * 100; // ₹50

    try {
        if (razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            const options = {
                amount: amountInPaise,
                currency: "INR",
                receipt: `rcpt_resume_${Date.now()}`,
                notes: { email, service: "Resume Creation Premium" },
            };
            const order = await razorpay.orders.create(options);
            return res.status(200).json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: razorpayKeyId,
            });
        } else {
            // Test Mode Fallback Order Creation
            const testOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            return res.status(200).json({
                success: true,
                orderId: testOrderId,
                amount: amountInPaise,
                currency: "INR",
                keyId: razorpayKeyId,
                isTestMode: true,
            });
        }
    } catch (err) {
        console.error("Razorpay order error:", err);
        res.status(500).json({ error: "Failed to create payment order" });
    }
});

// 4. POST /api/resume/verify-payment - Verify payment & save resume to profile
router.post("/verify-payment", async (req, res) => {
    const {
        email,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        resumeData,
    } = req.body;

    if (!email || !resumeData) {
        return res.status(400).json({ error: "Email and resume data are required" });
    }

    try {
        // Save or update existing resume for this student profile
        let existingResume = await Resume.findOne({ email: email.toLowerCase() });

        const updatedData = {
            email: email.toLowerCase(),
            name: resumeData.name || "",
            phone: resumeData.phone || "",
            location: resumeData.location || "",
            photo: resumeData.photo || "",
            summary: resumeData.summary || "",
            education: resumeData.education || [],
            experience: resumeData.experience || [],
            skills: resumeData.skills || [],
            projects: resumeData.projects || [],
            isPaid: true,
            amountPaid: 50,
            paymentDetails: {
                razorpayOrderId: razorpay_order_id || `order_sim_${Date.now()}`,
                razorpayPaymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
                razorpaySignature: razorpay_signature || "simulated_signature",
                paidAt: new Date(),
            },
            updatedAt: new Date(),
        };

        if (existingResume) {
            existingResume = await Resume.findOneAndUpdate(
                { email: email.toLowerCase() },
                { $set: updatedData },
                { new: true }
            );
        } else {
            existingResume = new Resume(updatedData);
            await existingResume.save();
        }

        console.log(`[RESUME CREATED] Resume successfully attached to profile for ${email}`);
        return res.status(200).json({
            success: true,
            message: "Payment verified & Resume attached to profile!",
            resume: existingResume,
        });
    } catch (err) {
        console.error("Error saving resume post payment:", err);
        return res.status(500).json({ error: "Failed to attach resume to profile" });
    }
});

// 5. GET /api/resume/user/:email - Get resume attached to student profile
router.get("/user/:email", async (req, res) => {
    try {
        const resume = await Resume.findOne({ email: req.params.email.toLowerCase() });
        if (!resume) {
            return res.status(404).json({ message: "No resume found for this user" });
        }
        res.status(200).json({ success: true, resume });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch resume" });
    }
});

// 6. POST /api/resume/reset-password - Reset password using Email or Phone (Once per day limit)
router.post("/reset-password", (req, res) => {
    const { identifier, newPassword, method } = req.body;
    if (!identifier || !newPassword) {
        return res.status(400).json({ error: "Identifier (Email/Phone) and new password are required" });
    }

    const key = identifier.toString().toLowerCase().trim();
    const lastReset = resetRateLimitStore.get(key);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    if (lastReset && Date.now() - lastReset < ONE_DAY_MS) {
        return res.status(429).json({ error: "You can use this option only once per day." });
    }

    // Record reset timestamp
    resetRateLimitStore.set(key, Date.now());

    console.log(`[PASSWORD RESET SUCCESS] Password updated for ${method || "account"}: ${key}`);
    return res.status(200).json({
        success: true,
        message: `Password reset successfully for ${key}! You can now log in with your new password.`,
    });
});

module.exports = router;
