import { useState } from "react";
import { Link } from "react-router-dom";
import "./viewApplication.css";
import { applications } from "../../data/applications";

const ViewApplication = () => {

    const [search, setSearch] = useState("");
    const [jobFilter, setJobFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Filter logic
    const filtered = applications.filter((app) => {
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        const matchesJob = jobFilter === "" || app.jobTitle === jobFilter;
        const matchesStatus = statusFilter === "" || app.status === statusFilter;
        return matchesSearch && matchesJob && matchesStatus;
    });

    // Badge color helper
    const getStatusClass = (status: string) => {
        switch (status) {
            case "Shortlisted": return "badge-green";
            case "Rejected": return "badge-red";
            case "Interview Scheduled": return "badge-blue";
            default: return "badge-yellow";
        }
    };

    return (
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
                    placeholder="🔍  Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="viewapplication-select"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                >
                    <option value="">All Job Titles</option>
                    <option value="Frontend Developer Intern">Frontend Developer Intern</option>
                    <option value="Backend Developer Intern">Backend Developer Intern</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Analyst Intern">Data Analyst Intern</option>
                </select>

                <select
                    className="viewapplication-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                </select>
            </div>

            {/* Table */}
            <div className="viewapplication-table-wrapper">
                <table className="viewapplication-table">
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Job Title</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                            <th>View Application</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="viewapplication-empty">
                                    No applications found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((app, index) => (
                                <tr key={app.id}>
                                    <td>{index + 1}</td>
                                    <td className="va-name">{app.name}</td>
                                    <td>{app.jobTitle}</td>
                                    <td>{app.phone}</td>
                                    <td>
                                        <span className={`va-badge ${getStatusClass(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/view-application/${app.id}`}><button className="va-view-btn">View</button></Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewApplication;