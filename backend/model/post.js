const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    authorEmail: { type: String, required: true },
    authorName: { type: String, required: true },
    authorPhoto: { type: String, default: "" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
    {
        authorEmail: { type: String, required: true, index: true },
        authorName: { type: String, required: true },
        authorPhoto: { type: String, default: "" },
        caption: { type: String, default: "" },
        mediaUrl: { type: String, default: "" }, // Base64 image/video or URL
        mediaType: { type: String, enum: ["image", "video", "none"], default: "none" },
        likes: { type: [String], default: [] }, // Array of emails who liked
        comments: [commentSchema],
        sharesCount: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
