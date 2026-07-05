import { Send, Search } from "lucide-react";
import "./navBar.css";

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
          <button className="nav-link">Jobs</button>
          <button className="nav-link">Internships</button>
          <button className="nav-link">Courses</button>
        </div>

        <div className="nav-actions">
          <div className="search-pill">
            <Search size={16} />
            <input type="text" placeholder="Search" />
          </div>

          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>

          <a className="for-employers" href="#">
            For Employers
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
