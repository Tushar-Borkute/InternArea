const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true, index: true },
        friendEmail: { type: String, required: true },
        friendName: { type: String, default: "Community Member" },
        friendPhoto: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Friendship", friendshipSchema);
