import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";
import { Mail, Calendar, Briefcase, CheckCircle2, Clock, XCircle, LogOut } from "lucide-react";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
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

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    const fetchUserApps = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/application/user/${currentUser.email}`);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.email) {
      fetchUserApps();
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <NavBar />
      <Breadcrumb items={[{ label: "Home" }, { label: "My Profile" }]} />

      <div className="profile-container">
        {/* User Card */}
        <div className="profile-header-card">
          <div className="profile-user-info">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile Avatar"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                {(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}
              </div>
            )}

            <div className="profile-details">
              <h1>{currentUser.displayName || "Candidate Profile"}</h1>
              <p className="profile-email">
                <Mail size={16} /> {currentUser.email}
              </p>
            </div>
          </div>

          <button className="profile-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Applications Section */}
        <div className="profile-section">
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
      </div>
    </>
  );
};

export default Profile;
