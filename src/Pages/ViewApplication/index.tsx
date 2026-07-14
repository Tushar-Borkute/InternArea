import { useParams, Link } from "react-router-dom";
import { applications } from "../../data/applications";
import "./index.css";

const Vapplication = () => {
    const { id } = useParams();
    const app = applications.find((a) => a.id === Number(id));

    const getStatusClass = (status: string) => {
        switch (status) {
            case "Shortlisted": return "badge-green";
            case "Rejected": return "badge-red";
            case "Interview Scheduled": return "badge-blue";
            default: return "badge-yellow";
        }
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    if (!app) {
        return (
            <div className="vadetail-page">
                <Link to="/viewApplication" className="vadetail-back-btn">
                    ← Back to Applications
                </Link>
                <div className="vadetail-notfound">Candidate not found.</div>
            </div>
        );
    }

    return (
        <div className="vadetail-page">
            {/* Back Button */}
            <Link to="/viewApplication" className="vadetail-back-btn">
                ← Back to Applications
            </Link>

            <div className="vadetail-card">

                {/* Profile Banner */}
                <div className="vadetail-card-header">
                    <div className="vadetail-avatar">{getInitials(app.name)}</div>
                    <div className="vadetail-header-info">
                        <h1>{app.name}</h1>
                        <p>{app.jobTitle}</p>
                        <span className={`va-badge ${getStatusClass(app.status)}`}>
                            {app.status}
                        </span>
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
                                <span className="vadetail-value">{app.appliedDate}</span>
                            </div>
                            <div className="vadetail-row">
                                <span className="vadetail-label">Experience</span>
                                <span className="vadetail-value">{app.experience}</span>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div className="vadetail-section">
                        <h2>Academic Information</h2>
                        <div className="vadetail-grid">
                            <div className="vadetail-row">
                                <span className="vadetail-label">College</span>
                                <span className="vadetail-value">{app.college}</span>
                            </div>
                            <div className="vadetail-row">
                                <span className="vadetail-label">Degree</span>
                                <span className="vadetail-value">{app.degree}</span>
                            </div>
                            <div className="vadetail-row">
                                <span className="vadetail-label">CGPA</span>
                                <span className="vadetail-value">{app.cgpa}</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="vadetail-section">
                        <h2>Skills</h2>
                        <div className="vadetail-skills">
                            {app.skills.map((skill) => (
                                <span key={skill} className="vadetail-skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Accept / Reject Buttons */}
                <div className="vadetail-actions">
                    <button
                        className="vadetail-btn-accept"
                        onClick={() => alert(`${app.name} has been Accepted!`)}
                    >
                        ✓ Accept
                    </button>
                    <button
                        className="vadetail-btn-reject"
                        onClick={() => alert(`${app.name} has been Rejected.`)}
                    >
                        ✗ Reject
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Vapplication;