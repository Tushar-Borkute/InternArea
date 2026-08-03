import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./index.css";
import Breadcrumb from "../../components/Breadcrumb";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  cgpa: string;
  skills: string;
  coverLetter: string;
  jobTitle: string;
  company: string;
  type: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
}

const Vapplication = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/application/${id}`);
        setApp(res.data);
      } catch {
        setApp(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id]);

  const updateStatus = async (status: "Accepted" | "Rejected" | "Pending") => {
    if (!app) return;
    try {
      setUpdating(true);
      const res = await axios.patch(
        `http://localhost:5000/api/application/${app._id}/status`,
        { status }
      );
      setApp(res.data);
      toast.success(`Application marked as ${status}!`);
    } catch {
      toast.error("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Accepted": return "badge-green";
      case "Rejected": return "badge-red";
      default: return "badge-yellow";
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Applications", path: "/viewApplication" },
            { label: "Details" },
          ]}
        />
        <div className="vadetail-page">
          <div className="vadetail-notfound">Loading…</div>
        </div>
      </>
    );
  }

  if (!app) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Applications", path: "/viewApplication" },
            { label: "Not Found" },
          ]}
        />
        <div className="vadetail-page">
          <div className="vadetail-notfound">Application not found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Admin Panel", path: "/adminPanel" },
          { label: "Applications", path: "/viewApplication" },
          { label: app.name },
        ]}
      />
      <div className="vadetail-page">
        <div className="vadetail-card">
          {/* Profile Banner */}
          <div className="vadetail-card-header">
            <div className="vadetail-avatar">{getInitials(app.name)}</div>
            <div className="vadetail-header-info">
              <h1>{app.name}</h1>
              <p>{app.jobTitle} &nbsp;·&nbsp; {app.company}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "6px" }}>
                <span className={`va-badge ${getStatusClass(app.status)}`}>{app.status}</span>
                <span style={{
                  background: app.type === "job" ? "#eff6ff" : "#f5f3ff",
                  color: app.type === "job" ? "#1d4ed8" : "#6d28d9",
                  borderRadius: "12px", padding: "2px 10px",
                  fontSize: "12px", fontWeight: 600, textTransform: "capitalize",
                }}>
                  {app.type}
                </span>
              </div>
            </div>
          </div>

          <div className="vadetail-card-body">
            {/* Contact Info */}
            <div className="vadetail-section">
              <h2>Contact Information</h2>
              <div className="vadetail-grid">
                <div className="vadetail-row">
                  <span className="vadetail-label">Email</span>
                  <span className="vadetail-value">{app.email}</span>
                </div>
                <div className="vadetail-row">
                  <span className="vadetail-label">Phone</span>
                  <span className="vadetail-value">{app.phone}</span>
                </div>
                <div className="vadetail-row">
                  <span className="vadetail-label">Applied Date</span>
                  <span className="vadetail-value">{formatDate(app.appliedAt)}</span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            {(app.college || app.degree || app.cgpa) && (
              <div className="vadetail-section">
                <h2>Academic Information</h2>
                <div className="vadetail-grid">
                  {app.college && (
                    <div className="vadetail-row">
                      <span className="vadetail-label">College</span>
                      <span className="vadetail-value">{app.college}</span>
                    </div>
                  )}
                  {app.degree && (
                    <div className="vadetail-row">
                      <span className="vadetail-label">Degree</span>
                      <span className="vadetail-value">{app.degree}</span>
                    </div>
                  )}
                  {app.cgpa && (
                    <div className="vadetail-row">
                      <span className="vadetail-label">CGPA / %</span>
                      <span className="vadetail-value">{app.cgpa}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {app.skills && (
              <div className="vadetail-section">
                <h2>Skills</h2>
                <div className="vadetail-skills">
                  {app.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                    <span key={skill} className="vadetail-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {app.coverLetter && (
              <div className="vadetail-section">
                <h2>Cover Letter</h2>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, margin: 0 }}>
                  {app.coverLetter}
                </p>
              </div>
            )}
          </div>

          {/* Status Actions */}
          <div className="vadetail-actions">
            <button
              className="vadetail-btn-accept"
              onClick={() => updateStatus("Accepted")}
              disabled={updating || app.status === "Accepted"}
            >
              ✓ Accept
            </button>
            <button
              className="vadetail-btn-pending"
              onClick={() => updateStatus("Pending")}
              disabled={updating || app.status === "Pending"}
            >
              ⏳ Pending
            </button>
            <button
              className="vadetail-btn-reject"
              onClick={() => updateStatus("Rejected")}
              disabled={updating || app.status === "Rejected"}
            >
              ✗ Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vapplication;