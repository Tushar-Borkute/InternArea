import { Filter, MapPin, IndianRupee, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Job.css";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
import { useLanguage } from "../../context/LanguageContext";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  salary?: string;
  joiningdate?: string;
  numberofopenings?: string;
  aboutjob?: string;
  whocanapply?: string;
  perks?: string;
}

const Job = () => {
  const { t } = useLanguage();

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

  const locations = [
    "Bangalore",
    "Hyderabad",
    "Remote",
    "Mumbai",
    "Chennai",
    "Pune",
    "Delhi",
  ];

  // ── API State ─────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/job");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError(t("jobsPage.loadError"));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // ── Filter State ─────────────────────────────────────────────────────────
  const [checked, setChecked] = useState(false);
  const [pchecked, setPchecked] = useState(false);
  const [salary, setSalary] = useState(0);
  const [search, setSearch] = useState("");
  const [lsearch, setLsearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredLocations = locations.filter((l) =>
    l.toLowerCase().includes(lsearch.toLowerCase()),
  );

  const filteredJobs = jobs.filter((job) => {
    const categoryMatch = search.length === 0 || job.category === search;
    const locationMatch = lsearch.length === 0 || job.location === lsearch;

    const salaryStr = job.salary ?? "";
    const minSalary = salaryStr
      ? parseInt(salaryStr.split(" - ")[0].replace(/[^0-9]/g, ""), 10)
      : 0;
    const salaryMatch = salary === 0 || minSalary >= salary * 100000;

    return categoryMatch && locationMatch && salaryMatch;
  });

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <NavBar />
        <Breadcrumb items={[{ label: t("breadcrumb.home"), path: "/" }, { label: t("breadcrumb.jobs") }]} />
        <main className="job-page">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "120px 20px",
              color: "#1e40af",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            <Loader2 size={40} style={{ animation: "spin 1s linear infinite" }} />
            <p>{t("jobsPage.loading")}</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Breadcrumb items={[{ label: t("breadcrumb.home"), path: "/" }, { label: t("breadcrumb.jobs") }]} />
        <main className="job-page">
          <div
            style={{
              textAlign: "center",
              padding: "100px 20px",
              color: "#dc2626",
              fontSize: "15px",
            }}
          >
            {error}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Breadcrumb items={[{ label: t("breadcrumb.home"), path: "/" }, { label: t("breadcrumb.jobs") }]} />
      <main className="job-page">
        <div className="job-grid">
          <aside className={`filter-panel${filterOpen ? " open" : ""}`}>
            <div className="filter-card">
              <div className="filter-header">
                <div className="filter-icon">
                  <Filter size={18} />
                </div>
                <div>
                  <h2>{t("jobsPage.filter")}</h2>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t("jobsPage.profile")}</label>
                <input
                  className="filter-input"
                  type="text"
                  placeholder="e.g. Data Science"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <div className="dropdown">
                    {filteredCategories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        className="dropdown-item"
                        onClick={() => setSearch(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-group">
                <label className="filter-label">{t("jobsPage.location")}</label>
                <input
                  className="filter-input"
                  type="text"
                  placeholder="e.g. Delhi"
                  value={lsearch}
                  onChange={(e) => setLsearch(e.target.value)}
                />
                {lsearch && (
                  <div className="dropdown">
                    {filteredLocations.map((location) => (
                      <button
                        type="button"
                        key={location}
                        className="dropdown-item"
                        onClick={() => setLsearch(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="filter-group">
                <div className="filter-toggle-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    {t("jobsPage.workFromHome")}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={pchecked}
                      onChange={() => setPchecked(!pchecked)}
                    />
                    {t("jobsPage.partTime")}
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-row">
                  <p className="filter-label">{t("jobsPage.annualSalary")}</p>
                </div>
                <input
                  className="range-input"
                  type="range"
                  min="0"
                  max="10"
                  step="2"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  style={
                    {
                      "--range-progress": `${(salary / 10) * 100}%`,
                    } as React.CSSProperties
                  }
                />
                <div className="slider-labels">
                  <span>0</span>
                  <span>2</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                  <span>10</span>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">{t("jobsPage.yearsExperience")}</label>
                <input
                  className="filter-input"
                  type="text"
                  placeholder="Select years of experience"
                />
              </div>

              <button
                type="button"
                className="button-primary"
                onClick={() => {
                  setSearch("");
                  setLsearch("");
                  setChecked(false);
                  setPchecked(false);
                  setSalary(0);
                }}
              >
                {t("jobsPage.clearFilters")}
              </button>
            </div>
          </aside>

          <section className="results-panel">
            {/* Mobile-only filter toggle */}
            <button
              type="button"
              className="filter-toggle-btn"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <Filter size={16} />
              {filterOpen ? t("jobsPage.hideFilters") : t("jobsPage.showFilters")}
            </button>

            <div className="jobs-header">
              <div>
                <h1 className="jobs-count">{filteredJobs.length} {t("jobsPage.jobs")}</h1>
                <p>{t("jobsPage.searchApply")}</p>
              </div>
            </div>

            <div className="job-cards">
              {filteredJobs.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#6b7280",
                    fontSize: "15px",
                  }}
                >
                  {t("jobsPage.noJobsFound")}
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <article key={job._id} className="job-card">
                    <div className="job-card-top">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-company">{job.company}</p>
                      </div>
                      <span className="job-status">{t("jobsPage.activelyHiring")}</span>
                    </div>

                    <div className="job-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      {job.salary && (
                        <div className="meta-item">
                          <IndianRupee size={16} />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <div className="job-footer">
                      <span className="job-tag">{job.category}</span>
                      <Link to={`/job/${job._id}`} className="apply-btn">
                        {t("jobsPage.applyNow")}
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Job;
