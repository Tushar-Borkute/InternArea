const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    skills: { type: String, default: "" },
    coverLetter: { type: String, default: "" },

    // Which job/internship was applied to
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, enum: ["job", "internship"], required: true },

    // Admin managed status
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },

    appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", applicationSchema);
