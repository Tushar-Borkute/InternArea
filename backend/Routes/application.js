const express = require("express");
const router = express.Router();
const Application = require("../model/application");
const Subscription = require("../model/subscription");

// POST /api/application — Submit a new application with subscription quota check
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required to submit an application" });
        }

        // 1. Fetch candidate's active subscription plan
        let sub = await Subscription.findOne({ email });
        if (!sub) {
            sub = await Subscription.create({
                email,
                plan: "Free",
                maxApplications: 1,
                usedApplications: 0,
            });
        }

        // 2. Count applications submitted during the current calendar month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyAppsCount = await Application.countDocuments({
            email,
            appliedAt: { $gte: firstDayOfMonth },
        });

        // 3. Enforce plan limit (Free: 1, Bronze: 3, Silver: 5, Gold: unlimited / -1)
        if (sub.maxApplications !== -1 && monthlyAppsCount >= sub.maxApplications) {
            return res.status(403).json({
                error: `Application quota reached for your ${sub.plan} Plan (${sub.maxApplications} application/month). Please upgrade your plan to apply for more internships.`,
                limitReached: true,
                plan: sub.plan,
                maxApplications: sub.maxApplications,
                usedApplications: monthlyAppsCount,
            });
        }

        // 4. Save new application
        const app = new Application({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            college: req.body.college || "",
            degree: req.body.degree || "",
            cgpa: req.body.cgpa || "",
            skills: req.body.skills || "",
            coverLetter: req.body.coverLetter || "",
            jobId: req.body.jobId,
            jobTitle: req.body.jobTitle,
            company: req.body.company,
            type: req.body.type,
        });

        const saved = await app.save();

        // 5. Update subscription usage count
        sub.usedApplications = monthlyAppsCount + 1;
        await sub.save();

        res.status(201).json(saved);
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
});

// GET /api/application — Get all applications (admin)
router.get("/", async (req, res) => {
    try {
        const apps = await Application.find().sort({ appliedAt: -1 });
        res.status(200).json(apps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

// GET /api/application/user/:email — Get applications for a specific user
router.get("/user/:email", async (req, res) => {
    try {
        const apps = await Application.find({ email: req.params.email }).sort({ appliedAt: -1 });
        res.status(200).json(apps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user applications" });
    }
});

// GET /api/application/:id — Get single application (admin detail)
router.get("/:id", async (req, res) => {
    try {
        const app = await Application.findById(req.params.id);
        if (!app) return res.status(404).json({ error: "Application not found" });
        res.status(200).json(app);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch application" });
    }
});

// PATCH /api/application/:id/status — Admin updates status
router.patch("/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }
    try {
        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Application not found" });
        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update status" });
    }
});

module.exports = router;
