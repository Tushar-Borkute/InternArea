import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, IndianRupee, Calendar, Users, Briefcase } from "lucide-react";
import axios from "axios";
import NavBar from "../../components/navBar";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import Breadcrumb from "../../components/Breadcrumb";
import "./JobDetail.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary?: string;
  joiningdate?: string;
  numberofopenings?: string;
  aboutcompany?: string;
  aboutjob?: string;
  whocanapply?: string;
  perks?: string;
  additionalinfo?: string;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/job/${id}`);
        setJob(res.data);
      } catch {
        setError("Job not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="jd-page">
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Jobs", path: "/Job" }, { label: "Job Details" }]} />
        <div className="jd-center">
          <div className="jd-spinner" />
          <p>Loading job details…</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="jd-page">
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Jobs", path: "/Job" }, { label: "Not Found" }]} />
        <div className="jd-center">
          <p style={{ color: "#dc2626" }}>{error || "Job not found."}</p>
          <Link to="/Job" className="jd-back-btn">← Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const perksList = typeof job.perks === "string"
    ? job.perks.split(",").map((p) => p.trim()).filter(Boolean)
    : Array.isArray(job.perks) ? job.perks : [];

  return (
    <div className="jd-page">
      <NavBar />
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Jobs", path: "/Job" },
          { label: job.title },
        ]}
      />
      <div className="jd-container">
        {/* ── Hero ── */}
        <div className="jd-hero">
          <div className="jd-hero-info">
            <h1>{job.title}</h1>
            <p className="jd-company">{job.company}</p>
            <div className="jd-meta-pills">
              <span className="jd-pill"><MapPin size={14} /> {job.location}</span>
              {job.salary && <span className="jd-pill"><IndianRupee size={14} /> {job.salary}</span>}
              {job.joiningdate && <span className="jd-pill"><Calendar size={14} /> Joining: {job.joiningdate}</span>}
              {job.numberofopenings && <span className="jd-pill"><Users size={14} /> {job.numberofopenings} Openings</span>}
            </div>
          </div>
          <div className="jd-hero-actions">
            <span className="jd-hiring-badge">Actively Hiring</span>
            <span className="jd-category-tag">{job.category}</span>

          </div>
        </div>

        {/* ── About Company ── */}
        {job.aboutcompany && (
          <div className="jd-section">
            <h2>About {job.company}</h2>
            <p>{job.aboutcompany}</p>
          </div>
        )}

        {/* ── About Job ── */}
        {job.aboutjob && (
          <div className="jd-section">
            <h2><Briefcase size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />About the Job</h2>
            <p>{job.aboutjob}</p>
          </div>
        )}

        {/* ── Who Can Apply ── */}
        {job.whocanapply && (
          <div className="jd-section">
            <h2>Who Can Apply</h2>
            <p>{job.whocanapply}</p>
          </div>
        )}

        {/* ── Perks ── */}
        {perksList.length > 0 && (
          <div className="jd-section">
            <h2>Perks & Benefits</h2>
            <div className="jd-perks">
              {perksList.map((perk, i) => (
                <span key={i} className="jd-perk-tag">✓ {perk}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── More Details ── */}
        {(job.joiningdate || job.numberofopenings || job.additionalinfo) && (
          <div className="jd-section">
            <h2>Additional Details</h2>
            <div className="jd-detail-grid">
              {job.joiningdate && (
                <div className="jd-detail-row">
                  <span className="jd-detail-label">Joining Date</span>
                  <span className="jd-detail-value">{job.joiningdate}</span>
                </div>
              )}
              {job.numberofopenings && (
                <div className="jd-detail-row">
                  <span className="jd-detail-label">Number of Openings</span>
                  <span className="jd-detail-value">{job.numberofopenings}</span>
                </div>
              )}
              {job.additionalinfo && (
                <div className="jd-detail-row" style={{ gridColumn: "1 / -1" }}>
                  <span className="jd-detail-label">Additional Info</span>
                  <span className="jd-detail-value" style={{ fontWeight: 400, color: "#374151" }}>{job.additionalinfo}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Apply CTA at bottom */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button className="jd-apply-btn" onClick={() => setShowModal(true)} style={{ padding: "14px 48px", fontSize: "16px" }}>
            Apply Now
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && job && (
        <ApplyModal
          jobId={job._id}
          jobTitle={job.title}
          company={job.company}
          type="job"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default JobDetail;
