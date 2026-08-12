import { useState } from "react";
import { Send, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthModal from "./AuthModal/AuthModal";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import "./navbar.css";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const openAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="brand" style={{ textDecoration: "none" }}>
            <Send size={28} color="#0ea5e9" />
            <div className="brand-text">
              <span className="brand-blue">INTERN</span>
              <span className="brand-dark">AREA</span>
            </div>
          </Link>

          <div className="nav-links">
            <Link className="nav-link" to="/Job">
              {t("nav.jobs")}
            </Link>
            <Link className="nav-link" to="/Internship">
              {t("nav.internships")}
            </Link>
            <Link className="nav-link public-space-nav-link" to="/public-space">
              Public Space 🌐
            </Link>
            <Link className="nav-link resume-nav-link" to="/resume-builder">
              Resume Builder <span className="nav-premium-tag">₹50</span>
            </Link>
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/profile" className="profile-pill-btn">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="nav-avatar-img" />
                  ) : (
                    <div className="nav-avatar-circle">
                      {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="nav-user-name">
                    {currentUser.displayName || currentUser.email?.split("@")[0]}
                  </span>
                </Link>
                <button className="login-btn" onClick={() => logout()} title={t("nav.logout")}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button className="login-btn" onClick={() => openAuth("login")}>
                  {t("nav.login")}
                </button>
                <button className="register-btn" onClick={() => openAuth("register")}>
                  {t("nav.register")}
                </button>
              </>
            )}

            <Link to="/Admin">
              <button className="admin-btn">{t("nav.admin")}</button>
            </Link>

            <LanguageSelector />
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />
    </>
  );
};

export default NavBar;
