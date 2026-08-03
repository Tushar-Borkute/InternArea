import { useState } from "react";
import { Mail, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal/AuthModal";
import { toast } from "react-toastify";
import "./HomeF.css";

const Homef = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("register");

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google! 🎉");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to login with Google");
    }
  };

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <div className="home-container">
        <div className="home-left">
          <div className="home-header">
            <span className="home-badge">
              <Sparkles size={16} /> #1 Career Platform
            </span>
            <h1>
              India's <span className="highlight">#1</span> platform
            </h1>
            <p className="home-subtitle">
              For fresher jobs, internships and career development
            </p>
          </div>

          <div className="signup-card">
            {currentUser ? (
              <div className="user-welcome-box">
                <div className="welcome-header">
                  <UserCheck size={24} color="#0ea5e9" />
                  <div>
                    <h3>Welcome back, {currentUser.displayName || currentUser.email?.split("@")[0]}! 👋</h3>
                    <p>You're logged in and ready to apply.</p>
                  </div>
                </div>
                <div className="welcome-actions">
                  <Link to="/profile" className="welcome-btn primary">
                    My Profile & Applications <ArrowRight size={16} />
                  </Link>
                  <Link to="/Job" className="welcome-btn secondary">
                    Explore Jobs
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h3>Candidate sign up</h3>
                <div className="buttons-container">
                  <button
                    type="button"
                    className="signup-btn google-btn"
                    onClick={handleGoogleLogin}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    className="signup-btn mail-btn"
                    onClick={() => openAuth("register")}
                  >
                    <Mail size={20} />
                    Continue with Email
                  </button>
                </div>
                <p className="agreement-text">
                  By continuing as a candidate, you agree to our{" "}
                  <span onClick={() => openAuth("register")}>T&C</span>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </>
  );
};

export default Homef;
