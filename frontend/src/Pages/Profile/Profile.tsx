import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";
import {
  Mail,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  FileText,
  Sparkles,
  PlusCircle,
  ShieldCheck,
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  AlertTriangle,
  Lock,
  Cpu,
  CreditCard,
  Zap,
  Award,
  Receipt,
  Phone,
  Camera,
  Edit2,
  X,
  Trash2,
  Upload,
} from "lucide-react";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
import SubscriptionModal from "../../components/SubscriptionModal/SubscriptionModal";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import "./Profile.css";

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  type: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
}

interface ResumeData {
  _id: string;
  name: string;
  phone: string;
  location: string;
  isPaid: boolean;
  updatedAt: string;
}

interface LoginHistoryItem {
  _id: string;
  email: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "laptop" | "mobile";
  ipAddress: string;
  status: string;
  timestamp: string;
}

interface PaymentRecord {
  orderId: string;
  paymentId: string;
  plan: string;
  amount: number;
  timestamp: string;
  invoiceSent: boolean;
}

interface SubscriptionData {
  email: string;
  plan: string;
  maxApplications: number;
  usedApplications: number;
  paymentHistory: PaymentRecord[];
}

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Custom photo & phone state
  const [userPhoto, setUserPhoto] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const fetchData = async () => {
    if (!currentUser?.email) return;
    try {
      setLoading(true);
      const [appRes, resumeRes, historyRes, subRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/application/user/${currentUser.email}`),
        axios.get(`${API_BASE_URL}/api/resume/user/${currentUser.email}`),
        axios.get(`${API_BASE_URL}/api/auth/login-history/${currentUser.email}`),
        axios.get(`${API_BASE_URL}/api/subscription/${currentUser.email}`),
      ]);

      if (appRes.status === "fulfilled") {
        setApplications(appRes.value.data);
      }
      if (resumeRes.status === "fulfilled" && resumeRes.value.data?.resume) {
        setResume(resumeRes.value.data.resume);
      }
      if (historyRes.status === "fulfilled" && historyRes.value.data?.history) {
        setLoginHistory(historyRes.value.data.history);
      }
      if (subRes.status === "fulfilled" && subRes.value.data?.subscription) {
        setSubscription(subRes.value.data.subscription);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    // Load stored local photo / phone fallback
    const savedPhoto = localStorage.getItem(`candidate_photo_${currentUser.email?.toLowerCase()}`);
    setUserPhoto(currentUser.photoURL || savedPhoto || "");

    const savedPhone = localStorage.getItem(`candidate_phone_${currentUser.email?.toLowerCase()}`);
    setUserPhone(savedPhone || "");

    fetchData();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Compute final phone number display
  const finalPhone = userPhone || resume?.phone || "+91 98765 43210";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUserPhoto(dataUrl);
      if (currentUser.email) {
        localStorage.setItem(`candidate_photo_${currentUser.email.toLowerCase()}`, dataUrl);
      }

      window.dispatchEvent(new Event("profilePhotoUpdated"));

      try {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: dataUrl });
        }
      } catch (err) {
        console.log("Firebase profile update note:", err);
      }

      toast.success("Profile photo updated successfully! 📸");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    setUserPhoto("");
    if (currentUser.email) {
      localStorage.removeItem(`candidate_photo_${currentUser.email.toLowerCase()}`);
    }
    window.dispatchEvent(new Event("profilePhotoUpdated"));

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: "" });
      }
    } catch {}

    setIsPreviewModalOpen(false);
    toast.success("Profile photo removed.");
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    const newP = phoneInput.trim();
    setUserPhone(newP);
    if (currentUser.email) {
      localStorage.setItem(`candidate_phone_${currentUser.email.toLowerCase()}`, newP);
    }
    setIsEditingPhone(false);
    toast.success("Phone number updated successfully! 📱");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return (
          <span className="status-badge status-accepted">
            <CheckCircle2 size={14} /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="status-badge status-rejected">
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return (
          <span className="status-badge status-pending">
            <Clock size={14} /> Pending
          </span>
        );
    }
  };

  const getLoginStatusBadge = (status: string) => {
    if (status === "Success") {
      return (
        <span className="login-status-tag tag-success">
          <CheckCircle2 size={13} /> Success
        </span>
      );
    } else if (status.includes("Blocked")) {
      return (
        <span className="login-status-tag tag-blocked" title={status}>
          <AlertTriangle size={13} /> {status}
        </span>
      );
    } else if (status === "OTP Pending") {
      return (
        <span className="login-status-tag tag-pending">
          <Lock size={13} /> OTP Pending
        </span>
      );
    } else {
      return (
        <span className="login-status-tag tag-failed">
          <XCircle size={13} /> {status}
        </span>
      );
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return <Smartphone size={16} color="#e11d48" />;
      case "laptop":
        return <Laptop size={16} color="#0284c7" />;
      default:
        return <Monitor size={16} color="#0ea5e9" />;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const planName = subscription?.plan || "Free";
  const maxApps = subscription?.maxApplications ?? 1;
  const usedApps = subscription?.usedApplications ?? 0;
  const isUnlimited = maxApps === -1;

  return (
    <>
      <NavBar />
      <Breadcrumb items={[{ label: "Home" }, { label: "My Profile" }]} />

      <div className="profile-container">
        {/* User Card */}
        <div className="profile-header-card">
          <div className="profile-user-info">
            {/* Avatar container with photo upload button & click to view photo */}
            <div className="profile-avatar-wrapper">
              <div
                className="avatar-click-area"
                onClick={() => setIsPreviewModalOpen(true)}
                title="Click to view full photo"
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Profile Avatar"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="profile-photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change / Add Profile Photo"
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
            </div>

            <div className="profile-details">
              <h1>{currentUser.displayName || "Candidate Profile"}</h1>
              <p className="profile-email">
                <Mail size={16} /> {currentUser.email}
              </p>
              <div className="profile-phone-row">
                <p className="profile-phone">
                  <Phone size={16} /> {finalPhone}
                </p>
                {!isEditingPhone ? (
                  <button
                    className="phone-edit-icon-btn"
                    onClick={() => {
                      setPhoneInput(userPhone || finalPhone);
                      setIsEditingPhone(true);
                    }}
                    title="Edit Phone Number"
                  >
                    <Edit2 size={12} />
                  </button>
                ) : (
                  <form onSubmit={handleSavePhone} className="phone-edit-inline-form">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 9876543210"
                      className="phone-inline-input"
                      autoFocus
                    />
                    <button type="submit" className="phone-save-btn">Save</button>
                    <button type="button" className="phone-cancel-btn" onClick={() => setIsEditingPhone(false)}>Cancel</button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <button className="profile-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Active Subscription & Monthly Application Quota Card */}
        <div className="profile-section" style={{ marginBottom: "28px" }}>
          <div className="section-header" style={{ justifyContent: "space-between", display: "flex" }}>
            <h2>
              <Zap size={20} color="#0ea5e9" /> Active Subscription & Application Quota
            </h2>
            <button className="sub-upgrade-btn" onClick={() => setIsSubModalOpen(true)}>
              <CreditCard size={16} /> Manage / Upgrade Plan
            </button>
          </div>

          <div className="sub-status-card">
            <div className="sub-status-left">
              <div className="plan-pill-tag">
                <Award size={18} color="#0ea5e9" />
                <span>Active Plan: <strong>{planName} Plan</strong></span>
              </div>
              <p className="sub-quota-text">
                {isUnlimited ? (
                  <span style={{ color: "#16a34a", fontWeight: "700" }}>
                    🎉 Unlimited Internship Applications Allowed
                  </span>
                ) : (
                  <span>
                    Monthly Application Limit: <strong>{usedApps} of {maxApps}</strong> used this month.
                  </span>
                )}
              </p>
            </div>

            {!isUnlimited && (
              <div className="sub-quota-bar-wrapper">
                <div
                  className="sub-quota-bar-fill"
                  style={{ width: `${Math.min(100, (usedApps / maxApps) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Payment Invoice History */}
          {subscription?.paymentHistory && subscription.paymentHistory.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#334155", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Receipt size={16} color="#0ea5e9" /> Payment Invoice History
              </h3>
              <div className="login-history-table-wrapper">
                <table className="login-history-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Plan Purchased</th>
                      <th>Amount Paid</th>
                      <th>Payment Date (IST)</th>
                      <th>Invoice Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.paymentHistory.map((item, idx) => (
                      <tr key={idx}>
                        <td><code>{item.orderId}</code></td>
                        <td><strong>{item.plan} Plan</strong></td>
                        <td style={{ color: "#16a34a", fontWeight: "bold" }}>₹{item.amount} INR</td>
                        <td>{formatDateTime(item.timestamp)}</td>
                        <td>
                          <span className="login-status-tag tag-success">
                            <CheckCircle2 size={13} /> Emailed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Premium Resume Banner / Status Section */}
        <div className="profile-section" style={{ marginBottom: "28px" }}>
          <div className="section-header">
            <h2>
              <FileText size={20} /> Candidate Profile Resume (Premium)
            </h2>
          </div>

          {resume && resume.isPaid ? (
            <div className="resume-attached-box">
              <div>
                <div className="resume-attached-title">
                  <CheckCircle2 size={18} color="#0284c7" /> Active Premium Resume Attached
                </div>
                <p className="resume-attached-sub">
                  Last updated: {formatDate(resume.updatedAt)} · Automatically linked to your internship applications.
                </p>
              </div>

              <Link to="/resume-builder" className="resume-edit-link">
                <FileText size={16} /> View / Edit Resume
              </Link>
            </div>
          ) : (
            <div className="resume-prompt-box">
              <Sparkles size={28} color="#0ea5e9" style={{ marginBottom: "8px" }} />
              <h3 className="resume-prompt-title">No Premium Resume Attached</h3>
              <p className="resume-prompt-desc">
                Build an ATS-standard resume for ₹50 with Email OTP verification and Razorpay payment.
              </p>
              <Link to="/resume-builder" className="resume-create-link">
                <PlusCircle size={18} /> Create Resume (₹50)
              </Link>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="profile-section" style={{ marginBottom: "28px" }}>
          <div className="section-header">
            <h2>
              <Briefcase size={20} /> My Applications ({applications.length})
            </h2>
          </div>

          {loading ? (
            <div className="profile-loading">Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div className="profile-empty">
              <p>You haven't submitted any applications yet.</p>
              <div className="empty-actions">
                <Link to="/Job" className="empty-btn">Explore Jobs</Link>
                <Link to="/Internship" className="empty-btn secondary">Explore Internships</Link>
              </div>
            </div>
          ) : (
            <div className="apps-grid">
              {applications.map((app) => (
                <div key={app._id} className="app-card">
                  <div className="app-card-top">
                    <div>
                      <h3 className="app-title">{app.jobTitle}</h3>
                      <p className="app-company">{app.company}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="app-card-meta">
                    <span className={`app-type-tag ${app.type}`}>
                      {app.type}
                    </span>
                    <span className="app-date">
                      <Calendar size={14} /> Applied on {formatDate(app.appliedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login History & Security Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>
              <ShieldCheck size={20} color="#0ea5e9" /> Login History & Security Activity ({loginHistory.length})
            </h2>
          </div>

          {loading ? (
            <div className="profile-loading">Loading security activity logs...</div>
          ) : loginHistory.length === 0 ? (
            <div className="profile-empty">
              <p>No login activity recorded yet for this candidate account.</p>
            </div>
          ) : (
            <div className="login-history-table-wrapper">
              <table className="login-history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Browser</th>
                    <th>Operating System</th>
                    <th>Device Type</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((item) => (
                    <tr key={item._id}>
                      <td className="log-time">
                        <Clock size={14} color="#64748b" style={{ marginRight: "6px" }} />
                        {formatDateTime(item.timestamp)}
                      </td>
                      <td className="log-browser">
                        <Globe size={14} color="#0ea5e9" style={{ marginRight: "6px" }} />
                        {item.browser}
                      </td>
                      <td className="log-os">
                        <Cpu size={14} color="#64748b" style={{ marginRight: "6px" }} />
                        {item.os}
                      </td>
                      <td className="log-device">
                        <span className="device-chip">
                          {getDeviceIcon(item.deviceType)}
                          <span style={{ textTransform: "capitalize", marginLeft: "4px" }}>{item.deviceType}</span>
                        </span>
                      </td>
                      <td className="log-ip">
                        <code className="ip-badge">{item.ipAddress}</code>
                      </td>
                      <td className="log-status">{getLoginStatusBadge(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Profile Photo Lightbox Preview Modal */}
      {isPreviewModalOpen && (
        <div
          className="photo-preview-overlay"
          onClick={(e) => e.target === e.currentTarget && setIsPreviewModalOpen(false)}
        >
          <div className="photo-preview-card">
            <button className="photo-preview-close" onClick={() => setIsPreviewModalOpen(false)}>
              <X size={20} />
            </button>

            <h3 className="photo-preview-title">Candidate Profile Photo</h3>

            <div className="photo-preview-img-box">
              {userPhoto ? (
                <img src={userPhoto} alt="Full Profile" className="photo-preview-large-img" />
              ) : (
                <div className="photo-preview-large-placeholder">
                  {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>

            <div className="photo-preview-actions">
              <button
                type="button"
                className="photo-action-btn primary"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <Upload size={16} /> Upload New Photo
              </button>

              {userPhoto && (
                <button
                  type="button"
                  className="photo-action-btn danger"
                  onClick={handleRemovePhoto}
                >
                  <Trash2 size={16} /> Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSubscriptionUpdated={fetchData}
      />
    </>
  );
};

export default Profile;
