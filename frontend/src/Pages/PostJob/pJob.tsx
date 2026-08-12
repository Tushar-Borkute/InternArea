import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./pJob.css";
import Breadcrumb from "../../components/Breadcrumb";

const Pjob = () => {
    const navigate = useNavigate();
    const [job, setJob] = useState({
        title: "",
        location: "",
        company: "",
        category: "",
        aboutcompany: "",
        aboutjob: "",
        whocanapply: "",
        perks: "",
        numberofopenings: "",
        salary: "",
        joiningdate: "",
        additionalinfo: "",
    });

    const [isloading, setisloading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setJob({
            ...job,
            [e.target.name]: e.target.value,
        });
    }

    const handlesubmit = async (e: any) => {
        e.preventDefault();
        if (job.title === "" || job.company === "" || job.location === "") {
            toast.error("Please fill all the fields");
            return;
        }

        try {
            setisloading(true);
            await axios.post("https://internarea-2.onrender.com/api/job/", job);
            toast.success("Job posted successfully!");
            navigate("/adminPanel");
        } catch (error) {
            console.log(error);
            toast.error("Failed to post job");
        } finally {
            setisloading(false);
        }
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { label: "Home", path: "/" },
                    { label: "Admin Panel", path: "/adminPanel" },
                    { label: "Post Job" },
                ]}
            />
            <div className="pjob-page">
                <div className="pjob-card">
                    {/* Header */}
                    <div className="pjob-header">
                        <h1>Post New Job</h1>
                        <p>Create a new job opportunity for candidates</p>
                    </div>

                    {/* Form */}
                    <form className="pjob-form" onSubmit={handlesubmit}>

                        {/* Row 1: Title + Location */}
                        <div className="pjob-row">
                            <div className="pjob-form-group">
                                <label htmlFor="title">
                                    <span className="field-icon">🏢</span>
                                    Title<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Frontend Developer"
                                    value={job.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="pjob-form-group">
                                <label htmlFor="location">
                                    <span className="field-icon">📍</span>
                                    Location<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="location"
                                    name="location"
                                    placeholder="e.g. Mumbai, India"
                                    value={job.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Company Name + Category */}
                        <div className="pjob-row">
                            <div className="pjob-form-group">
                                <label htmlFor="company">
                                    <span className="field-icon">🏬</span>
                                    Company Name<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="company"
                                    name="company"
                                    placeholder="e.g. Tech Solutions Inc"
                                    value={job.company}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="pjob-form-group">
                                <label htmlFor="category">
                                    <span className="field-icon">🏷️</span>
                                    Category<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="category"
                                    name="category"
                                    placeholder="e.g. Software Development"
                                    value={job.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3: About Company (full width) */}
                        <div className="pjob-row-full">
                            <div className="pjob-form-group">
                                <label htmlFor="aboutcompany">
                                    <span className="field-icon">ℹ️</span>
                                    About Company<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="medium"
                                    id="aboutcompany"
                                    name="aboutcompany"
                                    placeholder="Describe your company..."
                                    value={job.aboutcompany}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 4: About Job (full width) */}
                        <div className="pjob-row-full">
                            <div className="pjob-form-group">
                                <label htmlFor="aboutjob">
                                    <span className="field-icon">💼</span>
                                    About Job<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="medium"
                                    id="aboutjob"
                                    name="aboutjob"
                                    placeholder="Describe the job role and responsibilities..."
                                    value={job.aboutjob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 5: Who Can Apply + Perks */}
                        <div className="pjob-row">
                            <div className="pjob-form-group">
                                <label htmlFor="whocanapply">
                                    <span className="field-icon">👥</span>
                                    Who Can Apply<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="medium"
                                    id="whocanapply"
                                    name="whocanapply"
                                    placeholder="Eligibility criteria..."
                                    value={job.whocanapply}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="pjob-form-group">
                                <label htmlFor="perks">
                                    <span className="field-icon">🎁</span>
                                    Perks<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="medium"
                                    id="perks"
                                    name="perks"
                                    placeholder="List the perks and benefits..."
                                    value={job.perks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 6: Number of Openings + Salary */}
                        <div className="pjob-row">
                            <div className="pjob-form-group">
                                <label htmlFor="numberofopenings">
                                    <span className="field-icon">👥</span>
                                    Number of Openings<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="numberofopenings"
                                    name="numberofopenings"
                                    placeholder="e.g. 5"
                                    value={job.numberofopenings}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="pjob-form-group">
                                <label htmlFor="salary">
                                    <span className="field-icon">💰</span>
                                    Salary<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="salary"
                                    name="salary"
                                    placeholder="e.g. ₹8,00,000/year"
                                    value={job.salary}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 7: Joining Date + Additional Information */}
                        <div className="pjob-row">
                            <div className="pjob-form-group">
                                <label htmlFor="joiningdate">
                                    <span className="field-icon">📅</span>
                                    Joining Date<span className="required-star">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="joiningdate"
                                    name="joiningdate"
                                    value={job.joiningdate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="pjob-form-group">
                                <label htmlFor="additionalinfo">
                                    <span className="field-icon">ℹ️</span>
                                    Additional Information<span className="required-star">*</span>
                                </label>
                                <textarea
                                    className="short"
                                    id="additionalinfo"
                                    name="additionalinfo"
                                    placeholder="Any additional details..."
                                    value={job.additionalinfo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="pjob-submit-btn" disabled={isloading}>
                            {isloading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                                    Posting...
                                </div>
                            ) : (
                                "Post Job"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Pjob;