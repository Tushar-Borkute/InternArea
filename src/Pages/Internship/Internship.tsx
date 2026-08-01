import { Filter, MapPin, IndianRupee } from "lucide-react";
import { useState } from "react";
import "./Internship.css";
import NavBar from "../../components/navBar";

const Job = () => {
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
  const jobs = [
    // ========================= JOBS =========================

    // Big brands
    {
      id: 1,
      category: "Big brands",
      title: "Software Engineer",
      company: "Google",
      location: "Bangalore",
      salary: "₹12,00,000 - ₹18,00,000 /year",
      hiring: false,
      domain: "job",
    },
    {
      id: 2,
      category: "Big brands",
      title: "Product Analyst",
      company: "Amazon",
      location: "Hyderabad",
      salary: "₹10,00,000 - ₹15,00,000 /year",
      hiring: true,
      domain: "job",
    },

    // Work from Home
    {
      id: 3,
      category: "Work from Home",
      title: "Content Writer",
      company: "Pepper Content",
      location: "Remote",
      salary: "₹3,50,000 - ₹5,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 4,
      category: "Work from Home",
      title: "Customer Support Executive",
      company: "Concentrix",
      location: "Remote",
      salary: "₹2,50,000 - ₹4,00,000 /year",
      hiring: true,
      domain: "job",
    },

    // Part-time
    {
      id: 5,
      category: "Part-time",
      title: "Data Entry Operator",
      company: "RemoteHub",
      location: "Remote",
      salary: "₹1,80,000 - ₹2,40,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 6,
      category: "Part-time",
      title: "Online Tutor",
      company: "Chegg",
      location: "Remote",
      salary: "₹2,40,000 - ₹3,60,000 /year",
      hiring: true,
      domain: "job",
    },

    // MBA
    {
      id: 7,
      category: "MBA",
      title: "Management Trainee",
      company: "HDFC Bank",
      location: "Mumbai",
      salary: "₹8,00,000 - ₹11,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 8,
      category: "MBA",
      title: "Business Development Associate",
      company: "BYJU'S",
      location: "Bangalore",
      salary: "₹6,00,000 - ₹9,00,000 /year",
      hiring: true,
      domain: "job",
    },

    // Engineering
    {
      id: 9,
      category: "Engineering",
      title: "Mechanical Engineer",
      company: "L&T",
      location: "Chennai",
      salary: "₹5,50,000 - ₹8,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 10,
      category: "Engineering",
      title: "Civil Engineer",
      company: "Tata Projects",
      location: "Pune",
      salary: "₹5,00,000 - ₹7,50,000 /year",
      hiring: true,
      domain: "job",
    },

    // Media
    {
      id: 11,
      category: "Media",
      title: "Video Editor",
      company: "Zee Studios",
      location: "Mumbai",
      salary: "₹4,00,000 - ₹6,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 12,
      category: "Media",
      title: "Journalist",
      company: "Times Group",
      location: "Delhi",
      salary: "₹3,80,000 - ₹6,20,000 /year",
      hiring: true,
      domain: "job",
    },

    // Design
    {
      id: 13,
      category: "Design",
      title: "UI/UX Designer",
      company: "Figma",
      location: "Bangalore",
      salary: "₹6,00,000 - ₹9,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 14,
      category: "Design",
      title: "Graphic Designer",
      company: "Canva",
      location: "Remote",
      salary: "₹4,00,000 - ₹6,00,000 /year",
      hiring: true,
      domain: "job",
    },

    // Data Science
    {
      id: 15,
      category: "Data Science",
      title: "Data Scientist",
      company: "Flipkart",
      location: "Bangalore",
      salary: "₹10,00,000 - ₹16,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 16,
      category: "Data Science",
      title: "Machine Learning Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      salary: "₹12,00,000 - ₹18,00,000 /year",
      hiring: true,
      domain: "job",
    },

    // ====================== INTERNSHIPS ======================

    // Big brands
    {
      id: 17,
      category: "Big brands",
      title: "Software Development Intern",
      company: "Google",
      location: "Bangalore",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 18,
      category: "Big brands",
      title: "Product Management Intern",
      company: "Amazon",
      location: "Hyderabad",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },

    //Work from Home
    {
      id: 19,
      category: "Work from Home",
      title: "Content Writing Intern",
      company: "Pepper Content",
      location: "Remote",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 20,
      category: "Work from Home",
      title: "Customer Support Intern",
      company: "Concentrix",
      location: "Remote",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },

    //part time
    {
      id: 21,
      category: "Part-time",
      title: "Data Entry Intern",
      company: "RemoteHub",
      location: "Remote",
      stipend: "₹8,000/month",
      duration: "2 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 22,
      category: "Part-time",
      title: "Online Tutor Intern",
      company: "Chegg",
      location: "Remote",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },

    //MBA
    {
      id: 23,
      category: "MBA",
      title: "Business Analyst Intern",
      company: "HDFC Bank",
      location: "Mumbai",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 24,
      category: "MBA",
      title: "Marketing Intern",
      company: "BYJU'S",
      location: "Bangalore",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },

    //Engineering
    {
      id: 25,
      category: "Engineering",
      title: "Mechanical Engineering Intern",
      company: "L&T",
      location: "Chennai",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 26,
      category: "Engineering",
      title: "Civil Engineering Intern",
      company: "Tata Projects",
      location: "Pune",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },

    //Media
    {
      id: 27,
      category: "Media",
      title: "Video Editing Intern",
      company: "Zee Studios",
      location: "Mumbai",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 28,
      category: "Media",
      title: "Journalism Intern",
      company: "Times Group",
      location: "Delhi",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },

    //Design
    {
      id: 29,
      category: "Design",
      title: "UI/UX Design Intern",
      company: "Figma",
      location: "Bangalore",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 30,
      category: "Design",
      title: "Graphic Design Intern",
      company: "Canva",
      location: "Remote",
      stipend: "₹4,000/month",
      duration: "3 Months",
      hiring: true,
      domain: "internship",
    },

    //Data Science
    {
      id: 31,
      category: "Data Science",
      title: "Data Science Intern",
      company: "Flipkart",
      location: "Bangalore",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
    {
      id: 32,
      category: "Data Science",
      title: "Machine Learning Intern",
      company: "Microsoft",
      location: "Hyderabad",
      stipend: "₹4,000/month",
      duration: "6 Months",
      hiring: true,
      domain: "internship",
    },
  ];

  const [checked, setChecked] = useState(false); //work from home checkbox
  const [pchecked, setPchecked] = useState(false); // part time checkbox
  const [salary, setSalary] = useState(0);
  const [search, setSearch] = useState(""); //profile search
  const [lsearch, setLsearch] = useState(""); //location search
  const [filterOpen, setFilterOpen] = useState(false); // mobile drawer
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(lsearch.toLowerCase()),
  );
  const filteredJobs = jobs.filter((job) => {
    const categoryMatch = search.length === 0 || search.includes(job.category);

    const locationMatch =
      lsearch.length === 0 || lsearch.includes(job.location);

    // Parse stipend string like "₹4,000/month" → 4000, then compare
    const stipendAmount = job.stipend
      ? parseInt(job.stipend.replace(/[^0-9]/g, ""), 10)
      : 0;
    const salaryMatch = salary === 0 || stipendAmount >= salary * 1000;

    // const jobTypeMatch =
    //   selectedJobTypes.length === 0 ||
    //   selectedJobTypes.includes(job.category);

    return categoryMatch && locationMatch && salaryMatch && job.domain === "internship";
  });
  return (
    <>
      <div>
        <NavBar />
      </div>
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

              {/* <div className="filter-group">
              <p className="filter-label">Popular categories</p>
              <div className="category-list">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className="category-pill"
                    onClick={() => setSearch(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div> */}

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
                <h1 className="internship-count">{filteredJobs.length} Internships</h1>
                <p>
                  Search and Apply to Latest Internship Vacancies &amp; Openings in India
                </p>
              </div>
            </div>

            <div className="internship-cards">
              {filteredJobs.map((job) => (
                <article key={job.id} className="internship-card">
                  <div className="internship-card-top">
                    <div>
                      <h3 className="internship-title">{job.title}</h3>
                      <p className="internship-company">{job.company}</p>
                    </div>
                    {job.hiring && (
                      <span className="internship-status">Actively hiring</span>
                    )}
                  </div>

                  <div className="internship-meta">
                    <div className="internship-meta-item">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="internship-meta-item">
                      <IndianRupee size={16} />
                      <span>{job.salary ?? job.stipend ?? "N/A"}</span>
                    </div>
                  </div>

                  <div className="internship-footer">
                    <span className="internship-tag">{job.category}</span>
                    <button type="button"
                      className="internship-apply-btn">
                      Apply now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Job;
