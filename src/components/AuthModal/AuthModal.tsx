import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, User, LogIn, Phone, GraduationCap, ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, initialTab = "login" }: AuthModalProps) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Logged in with Google! 🎉");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }
    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("Password reset link sent! 📧 Please check your email inbox / spam folder.");
      setIsResetting(false);
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      let msg = "Failed to send password reset email.";
      if (err.code === "auth/user-not-found") {
        msg = "No candidate account found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many reset attempts. Please wait a few minutes and try again.";
      } else if (err.message) {
        msg = err.message.replace("Firebase: ", "");
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }

    if (tab === "register") {
      if (!name || !phone) {
        toast.error("Please fill all required registration fields (*)");
        return;
      }
    }

    try {
      setLoading(true);
      if (tab === "login") {
        await loginWithEmail(email, password);
        toast.success("Welcome back! 👋");
      } else {
        await registerWithEmail(email, password, name);
        // Store extra profile details locally for application pre-fill
        localStorage.setItem(`candidate_phone_${email.toLowerCase()}`, phone);
        if (college) localStorage.setItem(`candidate_college_${email.toLowerCase()}`, college);
        toast.success("Account created successfully! 🎉");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      let errText = err.message || "Authentication failed";
      if (errText.includes("auth/invalid-credential") || errText.includes("auth/wrong-password")) {
        errText = "Incorrect password or email. Please check your password or reset it.";
      }
      toast.error(errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-card">
        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {isResetting ? (
          <div className="auth-body" style={{ padding: "32px 24px" }}>
            <button
              type="button"
              className="auth-back-btn"
              onClick={() => setIsResetting(false)}
            >
              <ArrowLeft size={16} /> Back to Login
            </button>

            <div className="reset-header">
              <div className="reset-icon-circle">
                <KeyRound size={24} color="#0ea5e9" />
              </div>
              <h2>Forgot Password?</h2>
              <p>Enter your account email to receive a password reset link.</p>
            </div>

            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="auth-input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Header */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            <div className="auth-body">
              {/* Google Button */}
              <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="auth-divider">
                <span>OR</span>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {tab === "register" && (
                  <>
                    <div className="auth-input-group">
                      <label>Full Name<span style={{ color: "#dc2626" }}> *</span></label>
                      <div className="input-wrapper">
                        <User size={18} />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label>Phone Number<span style={{ color: "#dc2626" }}> *</span></label>
                      <div className="input-wrapper">
                        <Phone size={18} />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label>College / University</label>
                      <div className="input-wrapper">
                        <GraduationCap size={18} />
                        <input
                          type="text"
                          placeholder="e.g. IIT Bombay / Delhi University"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="auth-input-group">
                  <label>Email Address<span style={{ color: "#dc2626" }}> *</span></label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <div className="input-label-row">
                    <label>Password<span style={{ color: "#dc2626" }}> *</span></label>
                    {tab === "login" && (
                      <button
                        type="button"
                        className="forgot-pass-link"
                        onClick={() => {
                          onClose();
                          navigate("/reset-password");
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    "Processing..."
                  ) : tab === "login" ? (
                    <>
                      <LogIn size={18} style={{ marginRight: 6 }} /> Login
                    </>
                  ) : (
                    "Create Candidate Account"
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
