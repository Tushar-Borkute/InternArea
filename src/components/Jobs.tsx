import { useState, useEffect } from "react";
import { MapPin, Calendar, IndianRupee, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Jobs.css";

// ── Types matching backend Mongoose models ─────────────────────────────────
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary?: string;
  joiningdate?: string;
  numberofopenings?: string;
}

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  stipend?: string;
  startdate?: string;
  numberofopenings?: string;
}

const API = "http://localhost:5000/api";

const Jobs = () => {
  const categories = [
    "Big brands",
    "Work from Home",
    "Part-time",
    "MBA",
    "Engineering",
    "Media",
    "Design",
    "Data Science",
  ];

  // ── State ────────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jobSelectedCategory, setJobSelectedCategory] = useState("Big brands");
  const [internshipSelectedCategory, setInternshipSelectedCategory] =
    useState("Big brands");

  // ── Fetch from backend ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [internshipRes, jobRes] = await Promise.all([
          axios.get(`${API}/internship`),
          axios.get(`${API}/job`),
        ]);
        setInternships(internshipRes.data);
        setJobs(jobRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredJobs = jobs.filter(
    (job) => job.category === jobSelectedCategory
  );

  const filteredInternships = internships.filter(
    (intern) => intern.category === internshipSelectedCategory
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="jobs-loading">
        <Loader2 className="jobs-spinner" size={40} />
        <p>Loading opportunities…</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="jobs-error">
        <p>{error}</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ===== Jobs Section ===== */}
      <section className="jobs-section">
        <div className="jobs-container">
          <div className="jobs-header">
            <h1>What are you looking for today?</h1>
            <h2>Fresher jobs</h2>
          </div>

          <div className="jobs-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  jobSelectedCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() => setJobSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="jobs-list">
          {filteredJobs.length === 0 ? (
            <div className="jobs-empty">
              <p>No jobs found in <strong>{jobSelectedCategory}</strong>.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-location">
                    <MapPin size={16} /> {job.location}
                  </p>
                  {job.salary && (
                    <p className="job-salary">
                      <IndianRupee size={16} /> {job.salary}
                    </p>
                  )}
                  {job.joiningdate && (
                    <p className="job-salary">
                      <Calendar size={16} /> Joining: {job.joiningdate}
                    </p>
                  )}
                </div>
                <div className="job-card-footer">
                  <span className="job-tag">Job</span>
                  <Link to={`/job/${job._id}`} className="apply-link">
                    View Details <span>›</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ===== Internships Section ===== */}
      <section className="internship-section">
        <div className="internship-container">
          <div className="internship-header">
            <h2>Internships</h2>
          </div>

          <div className="internship-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  internshipSelectedCategory === category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() => setInternshipSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="internship-list">
          {filteredInternships.length === 0 ? (
            <div className="jobs-empty">
              <p>
                No internships found in{" "}
                <strong>{internshipSelectedCategory}</strong>.
              </p>
            </div>
          ) : (
            filteredInternships.map((intern) => (
              <div key={intern._id} className="internship-card">
                <div className="internship-card-header">
                  <h3 className="internship-title">{intern.title}</h3>
                  <p className="internship-company">{intern.company}</p>
                  <p className="internship-location">
                    <MapPin size={16} /> {intern.location}
                  </p>
                  {intern.stipend && (
                    <p className="internship-stipend">
                      <IndianRupee size={16} /> {intern.stipend}
                    </p>
                  )}
                  {intern.startdate && (
                    <p className="internship-duration">
                      <Calendar size={16} />
                      <span>Start: {intern.startdate}</span>
                    </p>
                  )}
                </div>
                <div className="internship-card-footer">
                  <span className="internship-tag">Internship</span>
                  <Link to={`/internship/${intern._id}`} className="internship-apply-link">
                    View Details <span>›</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Jobs;
