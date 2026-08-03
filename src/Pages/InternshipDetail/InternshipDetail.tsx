import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, IndianRupee, Calendar, Users, BookOpen } from "lucide-react";
import axios from "axios";
import NavBar from "../../components/navBar";
import ApplyModal from "../../components/ApplyModal/ApplyModal";
import Breadcrumb from "../../components/Breadcrumb";
import "./InternshipDetail.css";

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  stipend?: string;
  startdate?: string;
  numberofopenings?: string;
  aboutcompany?: string;
  aboutinternship?: string;
  whocanapply?: string;
  perks?: string;
  additionalinfo?: string;
}

const InternshipDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [intern, setIntern] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/internship/${id}`);
        setIntern(res.data);
      } catch {
        setError("Internship not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIntern();
  }, [id]);

  if (loading) {
    return (
      <div className="id-page">
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Internships", path: "/Internship" }, { label: "Internship Details" }]} />
        <div className="id-center">
          <div className="id-spinner" />
          <p>Loading internship details…</p>
        </div>
      </div>
    );
  }

  if (error || !intern) {
    return (
      <div className="id-page">
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Internships", path: "/Internship" }, { label: "Not Found" }]} />
        <div className="id-center">
          <p style={{ color: "#dc2626" }}>{error || "Internship not found."}</p>
          <Link to="/Internship" className="id-back-btn">← Back to Internships</Link>
        </div>
      </div>
    );
  }

  const perksList = typeof intern.perks === "string"
    ? intern.perks.split(",").map((p) => p.trim()).filter(Boolean)
    : Array.isArray(intern.perks) ? intern.perks : [];

  return (
    <div className="id-page">
      <NavBar />
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Internships", path: "/Internship" },
          { label: intern.title },
        ]}
      />
      <div className="id-container">
        {/* ── Hero ── */}
        <div className="id-hero">
          <div className="id-hero-info">
            <h1>{intern.title}</h1>
            <p className="id-company">{intern.company}</p>
            <div className="id-meta-pills">
              <span className="id-pill"><MapPin size={14} /> {intern.location}</span>
              {intern.stipend && <span className="id-pill"><IndianRupee size={14} /> {intern.stipend}</span>}
              {intern.startdate && <span className="id-pill"><Calendar size={14} /> Start: {intern.startdate}</span>}
              {intern.numberofopenings && <span className="id-pill"><Users size={14} /> {intern.numberofopenings} Openings</span>}
            </div>
          </div>
          <div className="id-hero-actions">
            <span className="id-hiring-badge">Actively Hiring</span>
            <span className="id-category-tag">{intern.category}</span>

          </div>
        </div>

        {/* ── About Company ── */}
        {intern.aboutcompany && (
          <div className="id-section">
            <h2>About {intern.company}</h2>
            <p>{intern.aboutcompany}</p>
          </div>
        )}

        {/* ── About Internship ── */}
        {intern.aboutinternship && (
          <div className="id-section">
            <h2><BookOpen size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />About the Internship</h2>
            <p>{intern.aboutinternship}</p>
          </div>
        )}

        {/* ── Who Can Apply ── */}
        {intern.whocanapply && (
          <div className="id-section">
            <h2>Who Can Apply</h2>
            <p>{intern.whocanapply}</p>
          </div>
        )}

        {/* ── Perks ── */}
        {perksList.length > 0 && (
          <div className="id-section">
            <h2>Perks & Benefits</h2>
            <div className="id-perks">
              {perksList.map((perk, i) => (
                <span key={i} className="id-perk-tag">✓ {perk}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── More Details ── */}
        {(intern.startdate || intern.numberofopenings || intern.additionalinfo) && (
          <div className="id-section">
            <h2>Additional Details</h2>
            <div className="id-detail-grid">
              {intern.startdate && (
                <div className="id-detail-row">
                  <span className="id-detail-label">Start Date</span>
                  <span className="id-detail-value">{intern.startdate}</span>
                </div>
              )}
              {intern.numberofopenings && (
                <div className="id-detail-row">
                  <span className="id-detail-label">Number of Openings</span>
                  <span className="id-detail-value">{intern.numberofopenings}</span>
                </div>
              )}
              {intern.additionalinfo && (
                <div className="id-detail-row" style={{ gridColumn: "1 / -1" }}>
                  <span className="id-detail-label">Additional Info</span>
                  <span className="id-detail-value" style={{ fontWeight: 400, color: "#374151" }}>{intern.additionalinfo}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Apply CTA */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button className="id-apply-btn" onClick={() => setShowModal(true)} style={{ padding: "14px 48px", fontSize: "16px" }}>
            Apply Now
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && intern && (
        <ApplyModal
          jobId={intern._id}
          jobTitle={intern.title}
          company={intern.company}
          type="internship"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default InternshipDetail;
