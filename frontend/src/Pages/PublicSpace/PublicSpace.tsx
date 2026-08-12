import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/config";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
import {
  Users,
  Image,
  Video,
  Heart,
  MessageCircle,
  Share2,
  Send,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  TrendingUp,
  Crown
} from "lucide-react";
import "./PublicSpace.css";

interface CommentItem {
  _id?: string;
  authorEmail: string;
  authorName: string;
  authorPhoto?: string;
  text: string;
  createdAt: string;
}

interface PostItem {
  _id: string;
  authorEmail: string;
  authorName: string;
  authorPhoto?: string;
  caption: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "none";
  likes: string[];
  comments: CommentItem[];
  sharesCount: number;
  createdAt: string;
}

interface CommunityUser {
  email: string;
  name: string;
  photo?: string;
}

const PublicSpace = () => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email?.toLowerCase() || "";
  const userName = currentUser?.displayName || userEmail.split("@")[0] || "Student";
  const userPhoto = currentUser?.photoURL || "";

  // Feed & Quota State
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [friendCount, setFriendCount] = useState(0);
  const [postsToday, setPostsToday] = useState(0);
  const [maxDailyPosts, setMaxDailyPosts] = useState<number | string>(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [friendsList, setFriendsList] = useState<any[]>([]);

  // Create Post Form State
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "none">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested Members State
  const [suggestedUsers, setSuggestedUsers] = useState<CommunityUser[]>([]);
  const [connectingEmail, setConnectingEmail] = useState<string | null>(null);

  // Expand Comment Section
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

  // Fetch Feed & User Quota Info
  useEffect(() => {
    fetchFeed();
    if (userEmail) {
      fetchUserQuota();
    }
    fetchSuggestedUsers();
  }, [userEmail]);

  const fetchFeed = async () => {
    try {
      setLoadingPosts(true);
      const res = await axios.get(`${API_BASE_URL}/api/public-space/posts`);
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load community feed");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUserQuota = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/public-space/friends/${userEmail}`);
      if (res.data?.success) {
        setFriendCount(res.data.friendCount);
        setPostsToday(res.data.postsToday);
        setMaxDailyPosts(res.data.maxDailyPosts);
        setIsUnlimited(res.data.isUnlimited);
        if (Array.isArray(res.data.friends)) {
          setFriendsList(res.data.friends);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/public-space/users`);
      if (Array.isArray(res.data)) {
        setSuggestedUsers(res.data);
      }
    } catch {
      // Ignore fallback
    }
  };

  // Media Upload Reader
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size should be less than 15MB");
      return;
    }

    const isVid = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
      setMediaType(isVid ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
      toast.error("Please login to share posts in the Public Space");
      return;
    }

    if (!caption && !mediaUrl) {
      toast.error("Please add a caption or upload media to publish");
      return;
    }

    // Check Posting Limits
    if (friendCount === 0) {
      toast.warning("You currently have 0 friends and cannot post. Connect with community members to unlock posting!");
      return;
    }

    if (!isUnlimited && typeof maxDailyPosts === "number" && postsToday >= maxDailyPosts) {
      toast.warning(`Daily posting limit reached (${postsToday}/${maxDailyPosts}). Add more friends to increase your quota!`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/api/public-space/posts`, {
        authorEmail: userEmail,
        authorName: userName,
        authorPhoto: userPhoto,
        caption,
        mediaUrl,
        mediaType,
      });

      if (res.data?.success) {
        toast.success("🎉 Post published to Public Space!");
        setCaption("");
        setMediaUrl("");
        setMediaType("none");
        fetchFeed();
        fetchUserQuota();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Failed to publish post";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Friend / Connect Action
  const handleAddFriend = async (targetUser: CommunityUser | { email: string; name: string; photo?: string }) => {
    if (!userEmail) {
      toast.error("Please login to connect with friends");
      return;
    }

    try {
      setConnectingEmail(targetUser.email);
      const res = await axios.post(`${API_BASE_URL}/api/public-space/friends/add`, {
        userEmail: userEmail,
        friendEmail: targetUser.email,
        friendName: targetUser.name,
        friendPhoto: targetUser.photo || "",
      });

      if (res.data?.success) {
        toast.success(`Connected with ${targetUser.name}! Your daily post quota has increased.`);
        fetchUserQuota();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add friend");
    } finally {
      setConnectingEmail(null);
    }
  };

  // Like / Unlike Post
  const handleToggleLike = async (postId: string) => {
    if (!userEmail) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/public-space/posts/${postId}/like`, {
        userEmail,
      });

      if (res.data?.success) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p._id === postId ? { ...p, likes: res.data.likes } : p))
        );
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  // Submit Comment
  const handleAddComment = async (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!userEmail) {
      toast.error("Please login to comment");
      return;
    }
    if (!text) return;

    try {
      setSubmittingComment(postId);
      const res = await axios.post(`${API_BASE_URL}/api/public-space/posts/${postId}/comment`, {
        authorEmail: userEmail,
        authorName: userName,
        authorPhoto: userPhoto,
        text,
      });

      if (res.data?.success) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p._id === postId ? { ...p, comments: res.data.comments } : p))
        );
        setCommentInput((prev) => ({ ...prev, [postId]: "" }));
        toast.success("Comment added!");
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(null);
    }
  };

  // Share Post Action
  const handleSharePost = async (post: PostItem) => {
    try {
      await axios.post(`${API_BASE_URL}/api/public-space/posts/${post._id}/share`);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === post._id ? { ...p, sharesCount: p.sharesCount + 1 } : p))
      );
      navigator.clipboard.writeText(`${window.location.origin}/public-space`);
      toast.success("Post link copied to clipboard!");
    } catch {
      toast.error("Failed to share post");
    }
  };

  // Calculate User Quota Badge
  const getQuotaBadgeInfo = () => {
    if (isUnlimited) {
      return { text: "Community Legend (Unlimited Posts)", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.15)" };
    }
    if (friendCount === 0) {
      return { text: "No Connections (0 Posts/Day)", color: "#ef4444", bg: "#fef2f2" };
    }
    if (friendCount === 1) {
      return { text: "Novice (1 Post/Day)", color: "#0ea5e9", bg: "#f0f9ff" };
    }
    if (friendCount === 2) {
      return { text: "Contributor (2 Posts/Day)", color: "#10b981", bg: "#ecfdf5" };
    }
    return { text: `Active Builder (${friendCount} Posts/Day)`, color: "#8b5cf6", bg: "#f5f3ff" };
  };

  const badgeInfo = getQuotaBadgeInfo();

  return (
    <div className="public-space-page">
      <NavBar />
      <Breadcrumb items={[{ label: "Home" }, { label: "Public Space" }]} />

      <div className="public-space-container">
        {/* Banner Header */}
        <div className="public-space-header">
          <div className="header-badge">
            <Sparkles size={16} /> Community Public Space
          </div>
          <h1>Connect, Share & Engage</h1>
          <p>
            Upload photos, videos, like, comment, and network with fellow candidates. **Your daily posting limit grows with your friend network!**
          </p>

          <div className="quota-pill-row">
            <div className="quota-pill">
              <Users size={16} /> <span>{friendCount} Friends</span>
            </div>
            <div className="quota-pill highlight">
              <TrendingUp size={16} /> <span>Daily Quota: {maxDailyPosts} Posts</span>
            </div>
            <div className="quota-pill badge-pill" style={{ color: badgeInfo.color, background: badgeInfo.bg }}>
              {isUnlimited ? <Crown size={16} /> : <ShieldCheck size={16} />}
              <span>{badgeInfo.text}</span>
            </div>
          </div>
        </div>

        <div className="public-space-layout">
          {/* MAIN FEED CONTENT */}
          <div className="feed-column">
            {/* CONNECTION & POSTING QUOTA DASHBOARD CARD */}
            <div className="quota-dashboard-card">
              <div className="dashboard-top">
                <div className="dashboard-title">
                  <TrendingUp color="#0ea5e9" size={20} />
                  <div>
                    <h3>Daily Posting Quota Tracker</h3>
                    <p>Posting limits are unlocked based on your friend connections.</p>
                  </div>
                </div>
                <div className="quota-usage-tag">
                  {postsToday} / {isUnlimited ? "∞" : maxDailyPosts} Posts Used Today
                </div>
              </div>

              {/* Rules Callout */}
              <div className="rules-grid">
                <div className={`rule-chip ${friendCount === 0 ? "current" : ""}`}>
                  <span className="rule-num">0 Friends</span>
                  <span className="rule-desc">0 Posts/Day</span>
                </div>
                <div className={`rule-chip ${friendCount === 1 ? "current" : ""}`}>
                  <span className="rule-num">1 Friend</span>
                  <span className="rule-desc">1 Post/Day</span>
                </div>
                <div className={`rule-chip ${friendCount === 2 ? "current" : ""}`}>
                  <span className="rule-num">2 Friends</span>
                  <span className="rule-desc">2 Posts/Day</span>
                </div>
                <div className={`rule-chip ${friendCount > 2 && friendCount <= 10 ? "current" : ""}`}>
                  <span className="rule-num">N Friends</span>
                  <span className="rule-desc">N Posts/Day</span>
                </div>
                <div className={`rule-chip ${isUnlimited ? "current gold" : ""}`}>
                  <span className="rule-num">&gt;10 Friends</span>
                  <span className="rule-desc">Unlimited 🎉</span>
                </div>
              </div>

              {/* Warning Banner if 0 Friends or Quota Reached */}
              {friendCount === 0 ? (
                <div className="quota-warning-banner red">
                  <AlertTriangle size={18} />
                  <span>
                    You currently have <strong>0 friends</strong> and cannot post. Connect with community members on the right sidebar to unlock your posting quota!
                  </span>
                </div>
              ) : !isUnlimited && typeof maxDailyPosts === "number" && postsToday >= maxDailyPosts ? (
                <div className="quota-warning-banner yellow">
                  <AlertTriangle size={18} />
                  <span>
                    You have reached your daily limit of <strong>{maxDailyPosts} post(s)</strong>. Add more friends to increase your daily limit!
                  </span>
                </div>
              ) : null}
            </div>

            {/* CREATE POST CARD */}
            <div className="create-post-card">
              <div className="create-post-header">
                {userPhoto ? (
                  <img src={userPhoto} alt="User Avatar" className="post-author-avatar" />
                ) : (
                  <div className="post-avatar-placeholder">
                    {userName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="create-post-input-wrap">
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={
                      friendCount === 0
                        ? "Connect with a friend below to unlock posting..."
                        : "Share photos, videos, or internship experiences with the community..."
                    }
                    disabled={friendCount === 0}
                  />
                </div>
              </div>

              {/* Media Preview Box */}
              {mediaUrl && (
                <div className="media-preview-box">
                  <button
                    type="button"
                    className="media-remove-btn"
                    onClick={() => {
                      setMediaUrl("");
                      setMediaType("none");
                    }}
                  >
                    <X size={16} />
                  </button>

                  {mediaType === "video" ? (
                    <video src={mediaUrl} controls className="media-preview-video" />
                  ) : (
                    <img src={mediaUrl} alt="Media Preview" className="media-preview-img" />
                  )}
                </div>
              )}

              {/* Create Post Actions Toolbar */}
              <div className="create-post-toolbar">
                <div className="upload-options">
                  <label htmlFor="post-image-file" className="upload-btn">
                    <Image size={18} color="#0ea5e9" /> Photo
                  </label>
                  <input
                    id="post-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUpload}
                    style={{ display: "none" }}
                    disabled={friendCount === 0}
                  />

                  <label htmlFor="post-video-file" className="upload-btn">
                    <Video size={18} color="#10b981" /> Video
                  </label>
                  <input
                    id="post-video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleMediaUpload}
                    style={{ display: "none" }}
                    disabled={friendCount === 0}
                  />
                </div>

                <button
                  type="button"
                  className="publish-post-btn"
                  onClick={handleCreatePost}
                  disabled={
                    isSubmitting ||
                    friendCount === 0 ||
                    (!isUnlimited && typeof maxDailyPosts === "number" && postsToday >= maxDailyPosts)
                  }
                >
                  {isSubmitting ? (
                    "Publishing..."
                  ) : (
                    <>
                      Publish Post <Send size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* COMMUNITY FEED LIST */}
            <div className="feed-posts-wrapper">
              <h2 className="feed-title">
                <Sparkles size={20} color="#0ea5e9" /> Public Community Feed ({posts.length})
              </h2>

              {loadingPosts ? (
                <div className="feed-loading">Loading community posts...</div>
              ) : posts.length === 0 ? (
                <div className="feed-empty">
                  <Users size={36} color="#94a3b8" />
                  <h3>No Posts in Public Space Yet</h3>
                  <p>Be the first candidate to share your projects or internship journey!</p>
                </div>
              ) : (
                posts.map((post) => {
                  const isLikedByMe = post.likes.includes(userEmail);
                  const isCommentsOpen = !!expandedComments[post._id];

                  return (
                    <div key={post._id} className="post-card">
                      {/* Post Header */}
                      <div className="post-card-header">
                        {post.authorPhoto ? (
                          <img src={post.authorPhoto} alt="Author Avatar" className="post-author-avatar" />
                        ) : (
                          <div className="post-avatar-placeholder">
                            {post.authorName[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="post-author-info">
                          <div className="author-name-row">
                            <h4>{post.authorName}</h4>
                            {post.authorEmail.toLowerCase() === userEmail ? (
                              <span className="author-you-tag">You</span>
                            ) : friendsList.some(
                                (f) => f.friendEmail.toLowerCase() === post.authorEmail.toLowerCase()
                              ) ? (
                              <span className="author-connected-tag">
                                <CheckCircle2 size={13} /> Connected
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="connect-btn post-connect-btn"
                                onClick={() =>
                                  handleAddFriend({
                                    email: post.authorEmail,
                                    name: post.authorName,
                                    photo: post.authorPhoto,
                                  })
                                }
                                disabled={connectingEmail === post.authorEmail}
                              >
                                <UserPlus size={13} /> Connect
                              </button>
                            )}
                          </div>
                          <span className="post-author-email">{post.authorEmail}</span>
                        </div>
                        <span className="post-timestamp">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Post Caption */}
                      {post.caption && <p className="post-caption">{post.caption}</p>}

                      {/* Post Media Display */}
                      {post.mediaUrl && (
                        <div className="post-media-container">
                          {post.mediaType === "video" ? (
                            <div className="video-wrapper">
                              <video src={post.mediaUrl} controls className="post-video-player" />
                            </div>
                          ) : (
                            <img src={post.mediaUrl} alt="Post Attachment" className="post-image-attachment" />
                          )}
                        </div>
                      )}

                      {/* Post Action Stats */}
                      <div className="post-stats-bar">
                        <span>{post.likes.length} Likes</span>
                        <span>·</span>
                        <span>{post.comments.length} Comments</span>
                        <span>·</span>
                        <span>{post.sharesCount} Shares</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="post-actions-toolbar">
                        <button
                          type="button"
                          className={`action-btn ${isLikedByMe ? "liked" : ""}`}
                          onClick={() => handleToggleLike(post._id)}
                        >
                          <Heart size={18} fill={isLikedByMe ? "#ef4444" : "none"} color={isLikedByMe ? "#ef4444" : "#64748b"} />
                          <span>{isLikedByMe ? "Liked" : "Like"}</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn"
                          onClick={() =>
                            setExpandedComments((prev) => ({ ...prev, [post._id]: !prev[post._id] }))
                          }
                        >
                          <MessageCircle size={18} color="#64748b" />
                          <span>Comment</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => handleSharePost(post)}
                        >
                          <Share2 size={18} color="#64748b" />
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {isCommentsOpen && (
                        <div className="comments-expand-section">
                          {/* Write Comment */}
                          <div className="add-comment-row">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInput[post._id] || ""}
                              onChange={(e) =>
                                setCommentInput({ ...commentInput, [post._id]: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post._id);
                              }}
                            />
                            <button
                              type="button"
                              className="send-comment-btn"
                              onClick={() => handleAddComment(post._id)}
                              disabled={submittingComment === post._id}
                            >
                              <Send size={14} />
                            </button>
                          </div>

                          {/* Comments List */}
                          <div className="comments-list">
                            {post.comments.length === 0 ? (
                              <p className="no-comments">No comments yet. Be the first to comment!</p>
                            ) : (
                              post.comments.map((c, i) => (
                                <div key={i} className="comment-bubble">
                                  <div className="comment-author">
                                    <strong>{c.authorName}</strong>
                                    <span className="comment-time">
                                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                  <p className="comment-text">{c.text}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: FRIENDS & CONNECTIONS */}
          <div className="sidebar-column">
            {/* My Friends Widget */}
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <Users color="#0ea5e9" size={20} />
                <div>
                  <h3>My Network Connections</h3>
                  <p>{friendCount} Connected Friend(s)</p>
                </div>
              </div>

              {friendsList.length === 0 ? (
                <div className="sidebar-empty">
                  <p>You haven't added any connections yet.</p>
                </div>
              ) : (
                <div className="friends-mini-list">
                  {friendsList.map((f, i) => (
                    <div key={i} className="friend-mini-item">
                      <div className="friend-mini-avatar">
                        {f.friendName[0]?.toUpperCase()}
                      </div>
                      <div className="friend-mini-details">
                        <span className="friend-mini-name">{f.friendName}</span>
                        <span className="friend-mini-email">{f.friendEmail}</span>
                      </div>
                      <CheckCircle2 size={16} color="#10b981" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Connections Widget */}
            <div className="sidebar-card">
              <div className="sidebar-card-title">
                <UserPlus color="#10b981" size={20} />
                <div>
                  <h3>Build Connections & Unlock Quota</h3>
                  <p>Add friends to increase your daily post limit.</p>
                </div>
              </div>

              <div className="suggested-users-list">
                {suggestedUsers
                  .filter((u) => u.email.toLowerCase() !== userEmail)
                  .map((u) => {
                    const isAlreadyFriend = friendsList.some(
                      (f) => f.friendEmail.toLowerCase() === u.email.toLowerCase()
                    );

                    return (
                      <div key={u.email} className="suggested-user-item">
                        <div className="suggested-user-avatar">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div className="suggested-user-info">
                          <span className="suggested-name">{u.name}</span>
                          <span className="suggested-email">{u.email}</span>
                        </div>

                        {isAlreadyFriend ? (
                          <span className="friend-added-tag">
                            <CheckCircle2 size={14} /> Connected
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="connect-btn"
                            onClick={() => handleAddFriend(u)}
                            disabled={connectingEmail === u.email}
                          >
                            <UserPlus size={14} /> Connect
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSpace;
