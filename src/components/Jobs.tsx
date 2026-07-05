import { useState } from "react";
import { MapPin, BadgeIndianRupee } from "lucide-react";
import "./Jobs.css";

const Jobs = () => {
  const categories = [
    "Big brands",
    "Work from home",
    "Part-time",
    "MBA",
    "Engineering",
    "Media",
    "Design",
    "Data Science",
  ];

  const jobs = [
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

    // Work from home
    {
      id: 3,
      category: "Big brands",
      title: "Content Writer",
      company: "Pepper Content",
      location: "Remote",
      salary: "₹3,50,000 - ₹5,00,000 /year",
      hiring: true,
      domain: "job",
    },
    {
      id: 4,
      category: "Big brands",
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
    },
    {
      id: 8,
      category: "MBA",
      title: "Business Development Associate",
      company: "BYJU'S",
      location: "Bangalore",
      salary: "₹6,00,000 - ₹9,00,000 /year",
      hiring: true,
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
    },
    {
      id: 10,
      category: "Engineering",
      title: "Civil Engineer",
      company: "Tata Projects",
      location: "Pune",
      salary: "₹5,00,000 - ₹7,50,000 /year",
      hiring: true,
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
    },
    {
      id: 12,
      category: "Media",
      title: "Journalist",
      company: "Times Group",
      location: "Delhi",
      salary: "₹3,80,000 - ₹6,20,000 /year",
      hiring: true,
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
    },
    {
      id: 14,
      category: "Design",
      title: "Graphic Designer",
      company: "Canva",
      location: "Remote",
      salary: "₹4,00,000 - ₹6,00,000 /year",
      hiring: true,
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
    },
    {
      id: 16,
      category: "Data Science",
      title: "Machine Learning Engineer",
      company: "Microsoft",
      location: "Hyderabad",
      salary: "₹12,00,000 - ₹18,00,000 /year",
      hiring: true,
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState("Big brands");

  const filteredJobs = jobs.filter((job) => job.category === selectedCategory);

  return (
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
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-location">
                <MapPin size={16} /> {job.location}
              </p>
              <p className="job-salary">
                <BadgeIndianRupee size={16} /> {job.salary}
              </p>
            </div>
            <div className="job-card-footer">
              <span className="job-tag">Job</span>

              {job.hiring ? (
                <button className="apply-btn">Apply Now</button>
              ) : (
                <button className="apply-btn" disabled>
                  Closed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
