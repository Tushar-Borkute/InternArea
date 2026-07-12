import { Send, Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./navbar.css";

// (no-op handlers for now)
const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <Send size={28} color="#0ea5e9" />
          <div className="brand-text">
            <span className="brand-blue">INTERN</span>
            <span className="brand-dark">AREA</span>
          </div>
        </div>

        <div className="nav-links">
          <Link className="nav-link" to="/Job">
            Jobs
          </Link>
          <a className="nav-link" href="/Internship">
            Internships
          </a>
          <a className="nav-link" href="/dsaf">
            Courses
          </a>
        </div>

        <div className="nav-actions">
          <div className="search-pill">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>

          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>

          <a href="/gggg" className="for-employers">
            For Employers <span>›</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
