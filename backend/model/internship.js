const mongoose = require("mongoose");
const internshipschema = new mongoose.Schema(
    {
        title: String,
        location: String,
        company: String,
        category: String,
        aboutcompany: String,
        aboutinternship: String,
        whocanapply: String,
        perks: Array,
        numberofopenings: String,
        stipend: String,
        startdate: String,
        additionalinfo: String,

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);
module.exports = mongoose.model("internship",internshipschema);