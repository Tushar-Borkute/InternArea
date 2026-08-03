import { Filter, MapPin, IndianRupee, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Internship.css";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";

interface Internship {
  _id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  stipend?: string;
  startdate?: string;
  numberofopenings?: string;
  aboutinternship?: string;
  whocanapply?: string;
  perks?: string;
}

const InternshipPage = () => {
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
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/internship");
        setInternships(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load internships. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
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

  const filteredInternships = internships.filter((intern) => {
    const categoryMatch = search.length === 0 || intern.category === search;
    const locationMatch = lsearch.length === 0 || intern.location === lsearch;

    // Parse stipend like "₹8,000/month" → 8000
    const stipendAmount = intern.stipend
      ? parseInt(intern.stipend.replace(/[^0-9]/g, ""), 10)
      : 0;
    const salaryMatch = salary === 0 || stipendAmount >= salary * 1000;

    return categoryMatch && locationMatch && salaryMatch;
  });

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Internships" }]} />
        <main className="internship-page">
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
            <p>Loading internships…</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Internships" }]} />
        <main className="internship-page">
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
      <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Internships" }]} />
      <main className="internship-page">
        <div className="internship-grid">
          <aside className={`internship-filter-panel${filterOpen ? " open" : ""}`}>
            <div className="internship-filter-card">
              <div className="internship-filter-header">
                <div className="internship-filter-icon">
                  <Filter size={18} />
                </div>
                <div>
                  <h2>Filter</h2>
                </div>
              </div>

              <div className="internship-filter-group">
                <label className="internship-filter-label">Profile</label>
                <input
                  className="internship-filter-input"
                  type="text"
                  placeholder="e.g. Data Science"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <div className="internship-dropdown">
                    {filteredCategories.map((category) => (
                      <button
                        type="button"
                        key={category}
                        className="internship-dropdown-item"
                        onClick={() => setSearch(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="internship-filter-group">
                <label className="internship-filter-label">Location</label>
                <input
                  className="internship-filter-input"
                  type="text"
                  placeholder="e.g. Delhi"
                  value={lsearch}
                  onChange={(e) => setLsearch(e.target.value)}
                />
                {lsearch && (
                  <div className="internship-dropdown">
                    {filteredLocations.map((location) => (
                      <button
                        type="button"
                        key={location}
                        className="internship-dropdown-item"
                        onClick={() => setLsearch(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="internship-filter-group">
                <div className="internship-filter-toggle-row">
                  <label className="internship-checkbox-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    Work from home
                  </label>
                  <label className="internship-checkbox-label">
                    <input
                      type="checkbox"
                      checked={pchecked}
                      onChange={() => setPchecked(!pchecked)}
                    />
                    Part time
                  </label>
                </div>
              </div>

              <div className="internship-filter-group">
                <div className="internship-filter-group-row">
                  <p className="internship-filter-label">
                    Desired minimum monthly stipend (₹)
                  </p>
                </div>
                <input
                  className="internship-range-input"
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
                <div className="internship-slider-labels">
                  <span>0</span>
                  <span>2k</span>
                  <span>4k</span>
                  <span>6k</span>
                  <span>8k</span>
                  <span>10k</span>
                </div>
              </div>

              <div className="internship-filter-group">
                <label className="internship-filter-label">
                  Years of experience
                </label>
                <input
                  className="internship-filter-input"
                  type="text"
                  placeholder="Select years of experience"
                />
              </div>

              <button
                type="button"
                className="internship-button-primary"
                onClick={() => {
                  setSearch("");
                  setLsearch("");
                  setChecked(false);
                  setPchecked(false);
                  setSalary(0);
                }}
              >
                Clear filters
              </button>
            </div>
          </aside>

          <section className="internship-results-panel">
            {/* Mobile-only filter toggle */}
            <button
              type="button"
              className="internship-filter-toggle-btn"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              <Filter size={16} />
              {filterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="internship-header">
              <div>
                <h1 className="internship-count">
                  {filteredInternships.length} Internships
                </h1>
                <p>
                  Search and Apply to Latest Internship Vacancies &amp; Openings in India
                </p>
              </div>
            </div>

            <div className="internship-cards">
              {filteredInternships.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#6b7280",
                    fontSize: "15px",
                  }}
                >
                  No internships found matching your filters.
                </div>
              ) : (
                filteredInternships.map((intern) => (
                  <article key={intern._id} className="internship-card">
                    <div className="internship-card-top">
                      <div>
                        <h3 className="internship-title">{intern.title}</h3>
                        <p className="internship-company">{intern.company}</p>
                      </div>
                      <span className="internship-status">Actively hiring</span>
                    </div>

                    <div className="internship-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{intern.location}</span>
                      </div>
                      {intern.stipend && (
                        <div className="meta-item">
                          <IndianRupee size={16} />
                          <span>{intern.stipend}</span>
                        </div>
                      )}
                    </div>

                    <div className="internship-footer">
                      <span className="internship-tag">{intern.category}</span>
                      <Link
                        to={`/internship/${intern._id}`}
                        className="internship-apply-btn"
                      >
                        Apply now
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

export default InternshipPage;
