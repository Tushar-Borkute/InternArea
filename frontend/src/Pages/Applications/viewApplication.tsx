import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./viewApplication.css";
import Breadcrumb from "../../components/Breadcrumb";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  type: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
}

const ViewApplication = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/application");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || app.status === statusFilter;
    const matchType = typeFilter === "" || app.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Accepted": return "badge-green";
      case "Rejected": return "badge-red";
      default: return "badge-yellow";
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/" },
          { label: "Admin Panel", path: "/adminPanel" },
          { label: "Applications" },
        ]}
      />
      <div className="viewapplication-page">
        <header className="viewapplication-header">
          <h1>Application List</h1>
          <p>Manage and review candidate applications</p>
        </header>

        {/* Search + Filters */}
        <div className="viewapplication-toolbar">
          <input
            type="text"
            className="viewapplication-search"
            placeholder="🔍  Search by name or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="viewapplication-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
          </select>

          <select
            className="viewapplication-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="viewapplication-table-wrapper">
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>
              Loading applications…
            </div>
          ) : (
            <table className="viewapplication-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>Name</th>
                  <th>Job / Internship</th>
                  <th>Type</th>
                  <th>Phone</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="viewapplication-empty">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app, index) => (
                    <tr key={app._id}>
                      <td>{index + 1}</td>
                      <td className="va-name">{app.name}</td>
                      <td>{app.jobTitle} <span style={{ color: "#9ca3af" }}>@ {app.company}</span></td>
                      <td>
                        <span style={{
                          background: app.type === "job" ? "#eff6ff" : "#f5f3ff",
                          color: app.type === "job" ? "#1d4ed8" : "#6d28d9",
                          borderRadius: "12px",
                          padding: "2px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}>
                          {app.type}
                        </span>
                      </td>
                      <td>{app.phone}</td>
                      <td>{formatDate(app.appliedAt)}</td>
                      <td>
                        <span className={`va-badge ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/view-application/${app._id}`}>
                          <button className="va-view-btn">View</button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewApplication;