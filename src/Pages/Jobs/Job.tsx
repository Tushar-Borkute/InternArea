import { Filter, MapPin, IndianRupee } from "lucide-react";
import { useState } from "react";
import "./Job.css";
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
      stipend: "₹4,000/month",
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

    // const jobTypeMatch =
    //   selectedJobTypes.length === 0 ||
    //   selectedJobTypes.includes(job.category);

    return categoryMatch && locationMatch &&(job.domain === "job");
  });
  return (
    <>
      <div>
        <NavBar />
      </div>
      <main className="job-page">
        <div className="job-grid">
          <aside className="filter-panel">
            <div className="filter-card">
              <div className="filter-header">
                <div className="filter-icon">
                  <Filter size={18} />
                </div>
                <div>
                  <h2>Filter</h2>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Profile</label>
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
                <label className="filter-label">Location</label>
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

              <div className="filter-group">
                <div className="filter-toggle-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    Work from home
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={pchecked}
                      onChange={() => setPchecked(!pchecked)}
                    />
                    Part time
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <div className="filter-group-row">
                  <p className="filter-label">Annual salary (in lakhs)</p>
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
                <label className="filter-label">Years of experience</label>
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
                Clear filters
              </button>
              
            </div>
          </aside>

          <section className="results-panel">
            <div className="jobs-header">
              <div>
                <h1 className="jobs-count">{filteredJobs.length} Jobs</h1>
                <p>
                  Search and Apply to Latest Job Vacancies & Openings in India
                </p>
              </div>
            </div>

            <div className="job-cards">
              {filteredJobs.map((job) => (
                <article key={job.id} className="job-card">
                  <div className="job-card-top">
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                    {job.hiring && (
                      <span className="job-status">Actively hiring</span>
                    )}
                  </div>

                  <div className="job-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="meta-item">
                      <IndianRupee size={16} />
                      <span>{job.salary ?? job.stipend ?? "N/A"}</span>
                    </div>
                  </div>

                  <div className="job-footer">
                    <span className="job-tag">{job.category}</span>
                    <button type="button" className="apply-btn">
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
