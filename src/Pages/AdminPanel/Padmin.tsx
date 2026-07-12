import {
  Mail,
  Briefcase,
  Send,
  Users,
  BarChart2,
  Settings,
} from "lucide-react";
import "./Padmin.css";

const Padmin = () => {
  return (
    <div className="padmin-wrapper">
      {/* Header */}
      <div className="padmin-header">
        <h1 className="padmin-title">Admin Dashboard</h1>
        <p className="padmin-subtitle">
          Manage your jobs, internships, and applications
        </p>
      </div>

      {/* Stats Row */}
      <div className="padmin-stats">
        <div className="padmin-stat-card">
          <p className="padmin-stat-label">Total Applications</p>
          <div className="padmin-stat-row">
            <p className="padmin-stat-value">2,345</p>
            <span className="padmin-stat-badge positive">+12%</span>
          </div>
        </div>

        <div className="padmin-stat-card">
          <p className="padmin-stat-label">Active Jobs</p>
          <div className="padmin-stat-row">
            <p className="padmin-stat-value">45</p>
            <span className="padmin-stat-badge positive">+3%</span>
          </div>
        </div>

        <div className="padmin-stat-card">
          <p className="padmin-stat-label">Active Internships</p>
          <div className="padmin-stat-row">
            <p className="padmin-stat-value">89</p>
            <span className="padmin-stat-badge positive">+24%</span>
          </div>
        </div>

        <div className="padmin-stat-card">
          <p className="padmin-stat-label">Conversion Rate</p>
          <div className="padmin-stat-row">
            <p className="padmin-stat-value">5.25%</p>
            <span className="padmin-stat-badge negative">-1.3%</span>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="padmin-actions">
        <div className="padmin-action-card">
          <div className="padmin-action-icon blue">
            <Mail size={20} />
          </div>
          <div className="padmin-action-info">
            <p className="padmin-action-title">View Applications</p>
            <p className="padmin-action-desc">
              View and manage all applications from candidates
            </p>
          </div>
        </div>

        <div className="padmin-action-card">
          <div className="padmin-action-icon green">
            <Briefcase size={20} />
          </div>
          <div className="padmin-action-info">
            <p className="padmin-action-title">Post Job</p>
            <p className="padmin-action-desc">
              Create and publish new job opportunities
            </p>
          </div>
        </div>

        <div className="padmin-action-card">
          <div className="padmin-action-icon purple">
            <Send size={20} />
          </div>
          <div className="padmin-action-info">
            <p className="padmin-action-title">Post Internship</p>
            <p className="padmin-action-desc">
              Create and manage internship positions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Padmin;