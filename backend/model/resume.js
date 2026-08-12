const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, index: true },
        name: { type: String, required: true },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        photo: { type: String, default: "" }, // Base64 string or image URL
        summary: { type: String, default: "" },
        
        education: [
            {
                institution: { type: String, default: "" },
                degree: { type: String, default: "" },
                field: { type: String, default: "" },
                startYear: { type: String, default: "" },
                endYear: { type: String, default: "" },
                score: { type: String, default: "" },
            },
        ],
        
        experience: [
            {
                company: { type: String, default: "" },
                role: { type: String, default: "" },
                duration: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
        
        skills: { type: [String], default: [] },
        
        projects: [
            {
                title: { type: String, default: "" },
                link: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
        
        isPaid: { type: Boolean, default: false },
        amountPaid: { type: Number, default: 50 },
        paymentDetails: {
            razorpayOrderId: { type: String, default: "" },
            razorpayPaymentId: { type: String, default: "" },
            razorpaySignature: { type: String, default: "" },
            paidAt: { type: Date },
        },
        
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
