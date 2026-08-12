import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/config";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
import {
  KeyRound,
  Mail,
  Phone,
  Lock,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Password Generator: Random password containing ONLY uppercase and lowercase letters (No numbers, no special chars)
  const generateLetterOnlyPassword = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    const length = 12;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      password += letters.charAt(randomIndex);
    }

    setNewPassword(password);
    setConfirmPassword(password);
    setWarningMessage(null);
    toast.info("Generated letter-only password! (Only uppercase & lowercase letters)");
  };

  const copyToClipboard = () => {
    if (!newPassword) {
      toast.error("Please generate or enter a password first");
      return;
    }
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    toast.success("Password copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Password Reset Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarningMessage(null);

    const identifier = resetMethod === "email" ? email.trim() : phone.trim();
    if (!identifier) {
      toast.error(`Please enter your registered ${resetMethod === "email" ? "email address" : "phone number"}`);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 letters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please check again.");
      return;
    }

    // Client-side Rate Limit Check (Once per day)
    const storageKey = `reset_pass_timestamp_${identifier.toLowerCase()}`;
    const lastReset = localStorage.getItem(storageKey);
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    if (lastReset) {
      const timeElapsed = Date.now() - parseInt(lastReset, 10);
      if (timeElapsed < ONE_DAY_MS) {
        const warnText = "You can use this option only once per day.";
        setWarningMessage(warnText);
        toast.warning(warnText);
        return;
      }
    }

    try {
      setLoading(true);

      // Save old password for auth sync fallback if exists
      const currentOldPass = localStorage.getItem(`candidate_pass_${identifier.toLowerCase()}`);
      if (currentOldPass) {
        localStorage.setItem(`candidate_old_pass_${identifier.toLowerCase()}`, currentOldPass);
      }

      // Store updated new password locally
      localStorage.setItem(`candidate_pass_${identifier.toLowerCase()}`, newPassword);

      // Backend route rate limit check & verification
      const res = await axios.post(`${API_BASE_URL}/api/resume/reset-password`, {
        identifier,
        newPassword,
        method: resetMethod,
      });

      if (res.data?.success) {
        // If resetting via email, also trigger Firebase reset email
        if (resetMethod === "email") {
          try {
            await resetPassword(email);
          } catch {
            // Backend reset record succeeded
          }
        }

        // Record timestamp in local storage for 24-hr restriction
        localStorage.setItem(storageKey, Date.now().toString());
        toast.success("Password reset successful! You can now log in with your new password. 🎉");
        setTimeout(() => navigate("/"), 2200);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Failed to reset password.";
      if (err.response?.status === 429 || errMsg.includes("once per day")) {
        const warnText = "You can use this option only once per day.";
        setWarningMessage(warnText);
        toast.warning(warnText);
      } else {
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page-wrapper">
      <NavBar />
      <Breadcrumb items={[{ label: "Home" }, { label: "Forgot Password" }]} />

      <div className="reset-page-container">
        {/* Header Card */}
        <div className="reset-page-header">
          <div className="reset-badge">
            <ShieldCheck size={16} /> Account Security
          </div>
          <h1>Reset Account Password</h1>
          <p>
            Reset your password using either your registered email or phone number. Rate-limited to once per day for maximum security.
          </p>
        </div>

        {/* Form Card */}
        <div className="reset-card">
          <div className="reset-header-icon">
            <KeyRound size={28} color="#0ea5e9" />
          </div>
          <h2>Forgot Password?</h2>
          <p className="reset-subtext">Choose your preferred reset method below:</p>

          {/* Reset Method Tabs */}
          <div className="reset-method-tabs">
            <button
              type="button"
              className={`method-tab ${resetMethod === "email" ? "active" : ""}`}
              onClick={() => {
                setResetMethod("email");
                setWarningMessage(null);
              }}
            >
              <Mail size={16} /> Reset via Email
            </button>
            <button
              type="button"
              className={`method-tab ${resetMethod === "phone" ? "active" : ""}`}
              onClick={() => {
                setResetMethod("phone");
                setWarningMessage(null);
              }}
            >
              <Phone size={16} /> Reset via Phone Number
            </button>
          </div>

          {/* Warning Message Box if reset already requested today */}
          {warningMessage && (
            <div className="once-per-day-warning">
              <AlertTriangle size={20} color="#d97706" />
              <span>{warningMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-form">
            {/* Identifier Field */}
            {resetMethod === "email" ? (
              <div className="reset-input-group">
                <label>Registered Email Address <span className="req">*</span></label>
                <div className="input-box">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setWarningMessage(null);
                    }}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="reset-input-group">
                <label>Registered Phone Number <span className="req">*</span></label>
                <div className="input-box">
                  <Phone size={18} />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setWarningMessage(null);
                    }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Generator Feature */}
            <div className="generator-box">
              <div className="generator-info">
                <Sparkles size={18} color="#0ea5e9" />
                <div>
                  <h4>Smart Password Generator</h4>
                  <p>Generates a random secure password with <strong>only letters (A-Z, a-z)</strong> and no numbers/symbols.</p>
                </div>
              </div>
              <button
                type="button"
                className="generate-pass-btn"
                onClick={generateLetterOnlyPassword}
              >
                <Sparkles size={14} /> Generate Random Password
              </button>
            </div>

            {/* New Password Input with Hide/Unhide Toggle */}
            <div className="reset-input-group">
              <div className="label-with-action">
                <label>New Password (Letters Only) <span className="req">*</span></label>
                {newPassword && (
                  <button type="button" className="copy-pass-link" onClick={copyToClipboard}>
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Password"}
                  </button>
                )}
              </div>
              <div className="input-box">
                <Lock size={18} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password or use generator"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input with Hide/Unhide Toggle */}
            <div className="reset-input-group">
              <label>Confirm New Password <span className="req">*</span></label>
              <div className="input-box">
                <Lock size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="submit-reset-btn" disabled={loading}>
              {loading ? "Updating Password..." : "Reset Password & Update Account"}
            </button>

            <div className="back-to-home-wrap">
              <Link to="/" className="back-link">
                <ArrowLeft size={16} /> Return to Homepage
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
