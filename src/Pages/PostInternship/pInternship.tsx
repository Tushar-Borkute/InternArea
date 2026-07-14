import { useState } from "react";
import "./pInternship.css";

const Pinternship = () => {
    const [intern, setIntern] = useState({
        title: "",
        location: "",
        company: "",
        category: "",
        aboutcompany: "",
        aboutinternship: "",
        whocanapply: "",
        perks: "",
        numberofopenings: "",
        stipend: "",
        startdate: "",
        additionalinfo: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setIntern({
            ...intern,
            [e.target.name]: e.target.value,
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        alert("Internship posted successfully!");
    }

    return (
        <div className="pinternship-page">
            <div className="pinternship-card">
                {/* Header */}
                <div className="pinternship-header">
                    <h1>Post New Internship</h1>
                    <p>Create a new internship opportunity for students</p>
                </div>

                {/* Form */}
                <form className="pinternship-form" onSubmit={handleSubmit}>

                    {/* Row 1: Title + Location */}
                    <div className="pinternship-row">
                        <div className="pinternship-form-group">
                            <label htmlFor="title">
                                <span className="field-icon">🏢</span>
                                Title<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="title"
                                name="title"
                                placeholder="e.g. Frontend Developer Intern"
                                value={intern.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pinternship-form-group">
                            <label htmlFor="location">
                                <span className="field-icon">📍</span>
                                Location<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="location"
                                name="location"
                                placeholder="e.g. Mumbai, India"
                                value={intern.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Company Name + Category */}
                    <div className="pinternship-row">
                        <div className="pinternship-form-group">
                            <label htmlFor="company">
                                <span className="field-icon">🏬</span>
                                Company Name<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="company"
                                name="company"
                                placeholder="e.g. Tech Solutions Inc"
                                value={intern.company}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pinternship-form-group">
                            <label htmlFor="category">
                                <span className="field-icon">🏷️</span>
                                Category<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="category"
                                name="category"
                                placeholder="e.g. Software Development"
                                value={intern.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: About Company (full width) */}
                    <div className="pinternship-row-full">
                        <div className="pinternship-form-group">
                            <label htmlFor="aboutcompany">
                                <span className="field-icon">ℹ️</span>
                                About Company<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="medium"
                                id="aboutcompany"
                                name="aboutcompany"
                                placeholder="Describe your company..."
                                value={intern.aboutcompany}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 4: About Internship (full width) */}
                    <div className="pinternship-row-full">
                        <div className="pinternship-form-group">
                            <label htmlFor="aboutinternship">
                                <span className="field-icon">🏢</span>
                                About Internship<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="medium"
                                id="aboutinternship"
                                name="aboutinternship"
                                placeholder="Describe the internship role..."
                                value={intern.aboutinternship}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 5: Who Can Apply + Perks */}
                    <div className="pinternship-row">
                        <div className="pinternship-form-group">
                            <label htmlFor="whocanapply">
                                <span className="field-icon">👥</span>
                                Who Can Apply<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="medium"
                                id="whocanapply"
                                name="whocanapply"
                                placeholder="Eligibility criteria..."
                                value={intern.whocanapply}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pinternship-form-group">
                            <label htmlFor="perks">
                                <span className="field-icon">ℹ️</span>
                                Perks<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="medium"
                                id="perks"
                                name="perks"
                                placeholder="List the perks..."
                                value={intern.perks}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 6: Number of Openings + Stipend */}
                    <div className="pinternship-row">
                        <div className="pinternship-form-group">
                            <label htmlFor="numberofopenings">
                                <span className="field-icon">👥</span>
                                Number of Openings<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="numberofopenings"
                                name="numberofopenings"
                                placeholder="e.g. 5"
                                value={intern.numberofopenings}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pinternship-form-group">
                            <label htmlFor="stipend">
                                <span className="field-icon">💲</span>
                                Stipend<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="stipend"
                                name="stipend"
                                placeholder="e.g. ₹15,000/month"
                                value={intern.stipend}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Row 7: Start Date + Additional Information */}
                    <div className="pinternship-row">
                        <div className="pinternship-form-group">
                            <label htmlFor="startdate">
                                <span className="field-icon">📅</span>
                                Start Date<span className="required-star">*</span>
                            </label>
                            <input
                                type="date"
                                id="startdate"
                                name="startdate"
                                value={intern.startdate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pinternship-form-group">
                            <label htmlFor="additionalinfo">
                                <span className="field-icon">ℹ️</span>
                                Additional Information<span className="required-star">*</span>
                            </label>
                            <textarea
                                className="short"
                                id="additionalinfo"
                                name="additionalinfo"
                                placeholder="Any additional details..."
                                value={intern.additionalinfo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="pinternship-submit-btn">
                        Post Internship
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Pinternship;