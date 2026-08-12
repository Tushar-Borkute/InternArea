const mongoose = require("mongoose");
const jobschema = new mongoose.Schema(
    {
        title: String,
        location: String,
        company: String,
        category: String,
        aboutcompany: String,
        aboutjob: String,
        whocanapply: String,
        perks: Array,
        numberofopenings: String,
        salary: String,
        joiningdate: String,
        additionalinfo: String,

        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);
module.exports = mongoose.model("job",jobschema);