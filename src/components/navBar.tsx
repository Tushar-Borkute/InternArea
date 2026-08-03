import { useState } from "react";
import { Send, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal/AuthModal";
import "./navbar.css";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
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
              Jobs
            </Link>
            <Link className="nav-link" to="/Internship">
              Internships
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
                <button className="login-btn" onClick={() => logout()} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button className="login-btn" onClick={() => openAuth("login")}>
                  Login
                </button>
                <button className="register-btn" onClick={() => openAuth("register")}>
                  Register
                </button>
              </>
            )}

            <Link to="/Admin">
              <button className="admin-btn">Admin</button>
            </Link>
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
