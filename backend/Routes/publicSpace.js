const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const Friendship = require("../model/friendship");

// Helper: Calculate daily start & end timestamps
const getDayBounds = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
};

// 1. GET /api/public-space/posts - Fetch all community feed posts
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch community posts" });
    }
});

// 2. POST /api/public-space/posts - Create post with Friend-based Posting Limit logic
router.post("/posts", async (req, res) => {
    const { authorEmail, authorName, authorPhoto, caption, mediaUrl, mediaType } = req.body;

    if (!authorEmail) {
        return res.status(400).json({ error: "Author email is required" });
    }

    if (!caption && !mediaUrl) {
        return res.status(400).json({ error: "Post must contain a caption or media content" });
    }

    try {
        const userEmailLower = authorEmail.toLowerCase().trim();

        // 1. Calculate user's friend count
        const friendCount = await Friendship.countDocuments({ userEmail: userEmailLower });

        // 2. Calculate posts created today
        const { startOfDay, endOfDay } = getDayBounds();
        const postsToday = await Post.countDocuments({
            authorEmail: userEmailLower,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        // 3. Enforce posting limits
        // 0 friends -> Cannot post (0 per day)
        // 1 friend -> 1 post/day
        // 2 friends -> 2 posts/day
        // ... N friends (1 to 10) -> N posts/day
        // > 10 friends -> Unlimited
        let maxDailyPosts = friendCount;
        let isUnlimited = false;

        if (friendCount > 10) {
            isUnlimited = true;
        }

        if (friendCount === 0) {
            return res.status(403).json({
                error: "You cannot post yet (0 friends). Add at least 1 friend to unlock posting!",
                friendCount: 0,
                postsToday: 0,
                maxDailyPosts: 0,
            });
        }

        if (!isUnlimited && postsToday >= maxDailyPosts) {
            return res.status(403).json({
                error: `Daily posting limit reached (${postsToday}/${maxDailyPosts} posts today). Add more friends to increase your daily post limit!`,
                friendCount,
                postsToday,
                maxDailyPosts,
            });
        }

        // 4. Create and save post
        const newPost = new Post({
            authorEmail: userEmailLower,
            authorName: authorName || "Community Member",
            authorPhoto: authorPhoto || "",
            caption: caption || "",
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || (mediaUrl ? "image" : "none"),
            likes: [],
            comments: [],
            sharesCount: 0,
        });

        const savedPost = await newPost.save();
        console.log(`[PUBLIC SPACE POST] Post created by ${userEmailLower}. Friends: ${friendCount}, Today: ${postsToday + 1}`);

        res.status(201).json({
            success: true,
            post: savedPost,
            friendCount,
            postsToday: postsToday + 1,
            maxDailyPosts: isUnlimited ? "Unlimited" : maxDailyPosts,
        });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// 3. POST /api/public-space/posts/:id/like - Like or unlike a post
router.post("/posts/:id/like", async (req, res) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        return res.status(400).json({ error: "User email is required" });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const emailLower = userEmail.toLowerCase().trim();
        const index = post.likes.indexOf(emailLower);

        if (index === -1) {
            post.likes.push(emailLower);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json({ success: true, likes: post.likes });
    } catch (err) {
        console.error("Error toggling like:", err);
        res.status(500).json({ error: "Failed to like post" });
    }
});

// 4. POST /api/public-space/posts/:id/comment - Add comment to post
router.post("/posts/:id/comment", async (req, res) => {
    const { authorEmail, authorName, authorPhoto, text } = req.body;
    if (!authorEmail || !text) {
        return res.status(400).json({ error: "Email and comment text are required" });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const newComment = {
            authorEmail: authorEmail.toLowerCase().trim(),
            authorName: authorName || "Candidate",
            authorPhoto: authorPhoto || "",
            text,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();
        res.status(200).json({ success: true, comments: post.comments });
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

// 5. POST /api/public-space/posts/:id/share - Increment share count
router.post("/posts/:id/share", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { sharesCount: 1 } },
            { new: true }
        );
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.status(200).json({ success: true, sharesCount: post.sharesCount });
    } catch (err) {
        console.error("Error sharing post:", err);
        res.status(500).json({ error: "Failed to share post" });
    }
});

// 6. GET /api/public-space/friends/:email - Fetch user's friends & posting quota status
router.get("/friends/:email", async (req, res) => {
    const emailLower = req.params.email.toLowerCase().trim();

    try {
        const friends = await Friendship.find({ userEmail: emailLower });
        const friendCount = friends.length;

        const { startOfDay, endOfDay } = getDayBounds();
        const postsToday = await Post.countDocuments({
            authorEmail: emailLower,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        });

        const isUnlimited = friendCount > 10;
        const maxDailyPosts = isUnlimited ? "Unlimited" : friendCount;
        const remainingPosts = isUnlimited
            ? "Unlimited"
            : Math.max(0, friendCount - postsToday);

        res.status(200).json({
            success: true,
            friendCount,
            postsToday,
            maxDailyPosts,
            remainingPosts,
            isUnlimited,
            friends,
        });
    } catch (err) {
        console.error("Error fetching friends:", err);
        res.status(500).json({ error: "Failed to fetch user friends" });
    }
});

// 7. POST /api/public-space/friends/add - Connect with a friend
router.post("/friends/add", async (req, res) => {
    const { userEmail, friendEmail, friendName, friendPhoto } = req.body;

    if (!userEmail || !friendEmail) {
        return res.status(400).json({ error: "User email and friend email are required" });
    }

    const uLower = userEmail.toLowerCase().trim();
    const fLower = friendEmail.toLowerCase().trim();

    if (uLower === fLower) {
        return res.status(400).json({ error: "You cannot add yourself as a friend" });
    }

    try {
        const existing = await Friendship.findOne({ userEmail: uLower, friendEmail: fLower });
        if (existing) {
            return res.status(400).json({ error: "User is already in your friends list" });
        }

        // Add friendship for user
        const friendship = new Friendship({
            userEmail: uLower,
            friendEmail: fLower,
            friendName: friendName || fLower.split("@")[0],
            friendPhoto: friendPhoto || "",
        });

        await friendship.save();

        // Also reciprocal connection
        const reciprocal = new Friendship({
            userEmail: fLower,
            friendEmail: uLower,
            friendName: uLower.split("@")[0],
            friendPhoto: "",
        });
        await reciprocal.save().catch(() => {}); // Ignore duplicate reciprocal

        const totalFriends = await Friendship.countDocuments({ userEmail: uLower });

        console.log(`[FRIEND ADDED] ${uLower} connected with ${fLower}. Total friends: ${totalFriends}`);
        res.status(200).json({
            success: true,
            message: `Connected with ${friendName || fLower}! Total friends: ${totalFriends}`,
            totalFriends,
        });
    } catch (err) {
        console.error("Error adding friend:", err);
        res.status(500).json({ error: "Failed to add friend" });
    }
});

// 8. GET /api/public-space/users - Get suggested community members
router.get("/users", async (req, res) => {
    try {
        // Return sample community members or distinct post authors
        const authors = await Post.distinct("authorEmail");
        const defaultUsers = [
            { email: "alex.tech@internarea.com", name: "Alex Rivers", photo: "" },
            { email: "priya.dev@internarea.com", name: "Priya Sharma", photo: "" },
            { email: "rohan.design@internarea.com", name: "Rohan Verma", photo: "" },
            { email: "sneha.code@internarea.com", name: "Sneha Patel", photo: "" },
            { email: "david.cloud@internarea.com", name: "David Kim", photo: "" },
            { email: "ananya.ai@internarea.com", name: "Ananya Gupta", photo: "" },
            { email: "vikram.data@internarea.com", name: "Vikram Mehta", photo: "" },
            { email: "tushar@internarea.com", name: "Tushar Borkute", photo: "" },
            { email: "karan.fullstack@internarea.com", name: "Karan Singh", photo: "" },
            { email: "meera.ui@internarea.com", name: "Meera Nair", photo: "" },
            { email: "rahul.backend@internarea.com", name: "Rahul Deshmukh", photo: "" },
            { email: "pooja.frontend@internarea.com", name: "Pooja Kulkarni", photo: "" },
        ];

        res.status(200).json(defaultUsers);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;
