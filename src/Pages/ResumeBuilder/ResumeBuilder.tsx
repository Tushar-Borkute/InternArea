import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../api/config";
import NavBar from "../../components/navBar";
import Breadcrumb from "../../components/Breadcrumb";
import {
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Briefcase,
    Code,
    FileText,
    Plus,
    Trash2,
    CheckCircle2,
    ShieldCheck,
    Lock,
    Sparkles,
    Upload,
    ArrowRight,
    X,
    CreditCard,
    KeyRound,
    Download
} from "lucide-react";
import "./ResumeBuilder.css";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    score: string;
}

interface Experience {
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface Project {
    title: string;
    link: string;
    description: string;
}

const ResumeBuilder = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Form State (Start empty with placeholders, no hardcoded default text)
    const [name, setName] = useState(currentUser?.displayName || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [photo, setPhoto] = useState("");
    const [summary, setSummary] = useState("");

    const [education, setEducation] = useState<Education[]>([
        {
            institution: "",
            degree: "",
            field: "",
            startYear: "",
            endYear: "",
            score: "",
        },
    ]);

    const [experience, setExperience] = useState<Experience[]>([
        {
            company: "",
            role: "",
            duration: "",
            description: "",
        },
    ]);

    const [skillsInput, setSkillsInput] = useState("");
    const [projects, setProjects] = useState<Project[]>([
        {
            title: "",
            link: "",
            description: "",
        },
    ]);

    // Flow & Modal States
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpSentMessage, setOtpSentMessage] = useState("");
    const [demoOtp, setDemoOtp] = useState<string | null>(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [orderInfo, setOrderInfo] = useState<any>(null);

    const [isResumeAttached, setIsResumeAttached] = useState(false);

    // Fetch existing resume if present
    useEffect(() => {
        if (!currentUser?.email) return;
        const fetchResume = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/resume/user/${currentUser.email}`);
                if (res.data?.success && res.data?.resume) {
                    const r = res.data.resume;
                    if (r.name) setName(r.name);
                    if (r.phone) setPhone(r.phone);
                    if (r.location) setLocation(r.location);
                    if (r.photo) setPhoto(r.photo);
                    if (r.summary) setSummary(r.summary);
                    if (r.education?.length) setEducation(r.education);
                    if (r.experience?.length) setExperience(r.experience);
                    if (r.skills?.length) setSkillsInput(r.skills.join(", "));
                    if (r.projects?.length) setProjects(r.projects);
                    if (r.isPaid) setIsResumeAttached(true);
                }
            } catch {
                // No existing resume found, ignore
            }
        };
        fetchResume();
    }, [currentUser]);

    // Handle Photo Upload
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Education Handlers
    const addEducation = () => {
        setEducation([
            ...education,
            { institution: "", degree: "", field: "", startYear: "", endYear: "", score: "" },
        ]);
    };
    const removeEducation = (index: number) => {
        setEducation(education.filter((_, i) => i !== index));
    };
    const handleEduChange = (index: number, field: keyof Education, value: string) => {
        const updated = [...education];
        updated[index][field] = value;
        setEducation(updated);
    };

    // Experience Handlers
    const addExperience = () => {
        setExperience([
            ...experience,
            { company: "", role: "", duration: "", description: "" },
        ]);
    };
    const removeExperience = (index: number) => {
        setExperience(experience.filter((_, i) => i !== index));
    };
    const handleExpChange = (index: number, field: keyof Experience, value: string) => {
        const updated = [...experience];
        updated[index][field] = value;
        setExperience(updated);
    };

    // Project Handlers
    const addProject = () => {
        setProjects([...projects, { title: "", link: "", description: "" }]);
    };
    const removeProject = (index: number) => {
        setProjects(projects.filter((_, i) => i !== index));
    };
    const handleProjChange = (index: number, field: keyof Project, value: string) => {
        const updated = [...projects];
        updated[index][field] = value;
        setProjects(updated);
    };

    // Trigger Resume Download / PDF Print
    const handleDownloadResume = () => {
        window.print();
    };

    // STEP 1: Submit Form & Trigger Email OTP Verification
    const handleStartVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            toast.error("Please fill in your Name, Email, and Phone number");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/api/resume/send-otp`, { email });
            if (res.data?.success) {
                setOtpSentMessage(res.data.message);
                if (res.data.demoOtp) {
                    setDemoOtp(res.data.demoOtp);
                    setOtpInput(res.data.demoOtp);
                }
                setShowOtpModal(true);
                toast.info(`OTP sent to ${email}`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to send verification OTP");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!otpInput || otpInput.length < 4) {
            toast.error("Please enter a valid OTP code");
            return;
        }

        try {
            setOtpVerifying(true);
            const res = await axios.post(`${API_BASE_URL}/api/resume/verify-otp`, {
                email,
                otp: otpInput,
            });

            if (res.data?.success) {
                toast.success("OTP Verified Successfully! Proceeding to Payment.");
                setShowOtpModal(false);
                initiatePaymentOrder();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Invalid OTP code");
        } finally {
            setOtpVerifying(false);
        }
    };

    // STEP 3: Initiate Razorpay Order (₹50)
    const initiatePaymentOrder = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/api/resume/create-order`, {
                email,
                amount: 50,
            });

            if (res.data?.success) {
                setOrderInfo(res.data);
                if (window.Razorpay && !res.data.isTestMode) {
                    openRazorpaySdk(res.data);
                } else {
                    setShowPaymentModal(true);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to create payment order");
        } finally {
            setLoading(false);
        }
    };

    // Razorpay SDK Helper
    const openRazorpaySdk = (order: any) => {
        const options = {
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            name: "InternArea Premium",
            description: "Resume Creation Service Fee (₹50)",
            order_id: order.orderId,
            prefill: {
                name: name,
                email: email,
                contact: phone,
            },
            theme: {
                color: "#0ea5e9",
            },
            handler: function (response: any) {
                finalizePaymentAndSaveResume(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );
            },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // STEP 4: Finalize Payment & Attach Resume to Profile
    const finalizePaymentAndSaveResume = async (
        orderId?: string,
        paymentId?: string,
        signature?: string
    ) => {
        try {
            setPaymentProcessing(true);
            const skillsList = skillsInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const resumePayload = {
                name,
                phone,
                location,
                photo,
                summary,
                education,
                experience,
                skills: skillsList,
                projects,
            };

            const res = await axios.post(`${API_BASE_URL}/api/resume/verify-payment`, {
                email,
                razorpay_order_id: orderId || orderInfo?.orderId || `order_${Date.now()}`,
                razorpay_payment_id: paymentId || `pay_${Date.now()}`,
                razorpay_signature: signature || `sig_${Date.now()}`,
                resumeData: resumePayload,
            });

            if (res.data?.success) {
                toast.success("🎉 Payment Successful! Professional Resume attached to your profile.");
                setIsResumeAttached(true);
                setShowPaymentModal(false);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to finalize resume attachment");
        } finally {
            setPaymentProcessing(false);
        }
    };

    return (
        <div className="resume-builder-page">
            <NavBar />
            <Breadcrumb items={[{ label: "Home" }, { label: "Profile" }, { label: "Resume Creation (Premium)" }]} />

            <div className="builder-container">
                {/* Premium Banner Header */}
                <div className="builder-header-banner">
                    <div className="banner-badge">
                        <Sparkles size={16} /> Premium Feature
                    </div>
                    <h1>Create Professional Internship Resume</h1>
                    <p>
                        Generate an ATS-ready resume and automatically attach it to your candidate profile for future internship applications.
                    </p>

                    <div className="banner-pricing-tag">
                        <span className="price-label">Fee per resume:</span>
                        <span className="price-amount">₹50</span>
                        <span className="price-verified">
                            <ShieldCheck size={16} /> Secured by Razorpay & Email OTP
                        </span>
                    </div>
                </div>

                {isResumeAttached && (
                    <div className="resume-success-callout">
                        <CheckCircle2 size={24} color="#10b981" />
                        <div>
                            <h3>Your Professional Resume is Active & Attached to Profile!</h3>
                            <p>Edit your resume anytime below or download a print-ready copy.</p>
                        </div>
                        <div className="callout-actions">
                            <button className="callout-download-btn" onClick={handleDownloadResume}>
                                <Download size={16} /> Download Resume
                            </button>
                            <button className="callout-profile-btn" onClick={() => navigate("/profile")}>
                                View Profile
                            </button>
                        </div>
                    </div>
                )}

                <div className="builder-layout">
                    {/* LEFT FORM PANE */}
                    <form className="builder-form-pane" onSubmit={handleStartVerification}>
                        {/* Section 1: Personal Info */}
                        <div className="form-card">
                            <div className="form-card-title">
                                <User className="title-icon" size={20} />
                                <h2>1. Personal Information & Photo</h2>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name <span className="req">*</span></label>
                                    <div className="input-with-icon">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Registered Email <span className="req">*</span></label>
                                    <div className="input-with-icon">
                                        <Mail size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number <span className="req">*</span></label>
                                    <div className="input-with-icon">
                                        <Phone size={16} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter 10-digit phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Location / City</label>
                                    <div className="input-with-icon">
                                        <MapPin size={16} />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Mumbai, India"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="photo-upload-container">
                                <label className="form-label">Profile Photo</label>
                                <div className="photo-upload-row">
                                    <div className="photo-preview-box">
                                        {photo ? (
                                            <img src={photo} alt="Candidate Photo" />
                                        ) : (
                                            <User size={32} color="#94a3b8" />
                                        )}
                                    </div>
                                    <div className="photo-upload-btn-wrap">
                                        <label htmlFor="photo-file-input" className="photo-upload-btn">
                                            <Upload size={16} /> Select Photo
                                        </label>
                                        <input
                                            id="photo-file-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            style={{ display: "none" }}
                                        />
                                        <span className="photo-hint">JPG or PNG (Max 2MB)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group margin-top-15">
                                <label>Professional Objective / Summary</label>
                                <textarea
                                    rows={3}
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder="Write a brief overview of your skills, academic achievements, and career goals..."
                                />
                            </div>
                        </div>

                        {/* Section 2: Education */}
                        <div className="form-card">
                            <div className="form-card-header">
                                <div className="form-card-title">
                                    <GraduationCap className="title-icon" size={20} />
                                    <h2>2. Education & Qualifications</h2>
                                </div>
                                <button type="button" className="add-btn" onClick={addEducation}>
                                    <Plus size={16} /> Add Education
                                </button>
                            </div>

                            {education.map((edu, idx) => (
                                <div key={idx} className="repeatable-card">
                                    <div className="repeatable-card-header">
                                        <span>Education Entry #{idx + 1}</span>
                                        {education.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeEducation(idx)}
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>College / University</label>
                                            <input
                                                type="text"
                                                value={edu.institution}
                                                onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                                                placeholder="e.g. IIT Bombay / Delhi University"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Degree & Branch</label>
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => handleEduChange(idx, "degree", e.target.value)}
                                                placeholder="e.g. B.Tech Computer Science"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Start Year</label>
                                            <input
                                                type="text"
                                                value={edu.startYear}
                                                onChange={(e) => handleEduChange(idx, "startYear", e.target.value)}
                                                placeholder="e.g. 2021"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>End Year / Batch</label>
                                            <input
                                                type="text"
                                                value={edu.endYear}
                                                onChange={(e) => handleEduChange(idx, "endYear", e.target.value)}
                                                placeholder="e.g. 2025"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Score / CGPA / Percentage</label>
                                            <input
                                                type="text"
                                                value={edu.score}
                                                onChange={(e) => handleEduChange(idx, "score", e.target.value)}
                                                placeholder="e.g. 8.5 CGPA / 85%"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 3: Work Experience / Internships */}
                        <div className="form-card">
                            <div className="form-card-header">
                                <div className="form-card-title">
                                    <Briefcase className="title-icon" size={20} />
                                    <h2>3. Experience & Internships</h2>
                                </div>
                                <button type="button" className="add-btn" onClick={addExperience}>
                                    <Plus size={16} /> Add Experience
                                </button>
                            </div>

                            {experience.map((exp, idx) => (
                                <div key={idx} className="repeatable-card">
                                    <div className="repeatable-card-header">
                                        <span>Experience Entry #{idx + 1}</span>
                                        {experience.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeExperience(idx)}
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Company / Organization</label>
                                            <input
                                                type="text"
                                                value={exp.company}
                                                onChange={(e) => handleExpChange(idx, "company", e.target.value)}
                                                placeholder="e.g. TechCorp Solutions"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Role / Position</label>
                                            <input
                                                type="text"
                                                value={exp.role}
                                                onChange={(e) => handleExpChange(idx, "role", e.target.value)}
                                                placeholder="e.g. Web Development Intern"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Duration</label>
                                            <input
                                                type="text"
                                                value={exp.duration}
                                                onChange={(e) => handleExpChange(idx, "duration", e.target.value)}
                                                placeholder="e.g. May 2024 - Jul 2024 (3 Months)"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Key Responsibilities & Achievements</label>
                                            <textarea
                                                rows={2}
                                                value={exp.description}
                                                onChange={(e) => handleExpChange(idx, "description", e.target.value)}
                                                placeholder="Describe your contributions, tools used, and key accomplishments..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Section 4: Skills & Projects */}
                        <div className="form-card">
                            <div className="form-card-title">
                                <Code className="title-icon" size={20} />
                                <h2>4. Skills & Key Projects</h2>
                            </div>

                            <div className="form-group">
                                <label>Technical & Soft Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={skillsInput}
                                    onChange={(e) => setSkillsInput(e.target.value)}
                                    placeholder="e.g. React, Node.js, Python, HTML/CSS, SQL, Problem Solving"
                                />
                            </div>

                            <div className="form-card-header margin-top-20">
                                <span className="sub-section-title">Projects</span>
                                <button type="button" className="add-btn" onClick={addProject}>
                                    <Plus size={16} /> Add Project
                                </button>
                            </div>

                            {projects.map((proj, idx) => (
                                <div key={idx} className="repeatable-card">
                                    <div className="repeatable-card-header">
                                        <span>Project #{idx + 1}</span>
                                        {projects.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeProject(idx)}
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Project Title</label>
                                            <input
                                                type="text"
                                                value={proj.title}
                                                onChange={(e) => handleProjChange(idx, "title", e.target.value)}
                                                placeholder="e.g. E-Learning Web Application"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Project Link / Repository</label>
                                            <input
                                                type="url"
                                                value={proj.link}
                                                onChange={(e) => handleProjChange(idx, "link", e.target.value)}
                                                placeholder="e.g. https://github.com/myusername/project"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Description</label>
                                            <textarea
                                                rows={2}
                                                value={proj.description}
                                                onChange={(e) => handleProjChange(idx, "description", e.target.value)}
                                                placeholder="Technologies used and main project features..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Action Box */}
                        <div className="builder-submit-box">
                            <div className="submit-info">
                                <h3>Ready to Generate & Attach Resume?</h3>
                                <p>Verify your registered email via OTP and pay ₹50 to activate your professional resume.</p>
                            </div>
                            <button
                                type="submit"
                                className="proceed-pay-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Sending OTP...</span>
                                ) : (
                                    <>
                                        Verify Email OTP & Pay ₹50 <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* RIGHT LIVE PREVIEW PANE */}
                    <div className="builder-preview-pane">
                        <div className="preview-header">
                            <div className="preview-title-wrap">
                                <FileText size={18} color="#0ea5e9" /> Live Resume Preview
                            </div>
                            <button
                                type="button"
                                className="download-resume-action-btn"
                                onClick={handleDownloadResume}
                            >
                                <Download size={15} /> Download Resume
                            </button>
                        </div>

                        <div className="resume-paper" id="resume-preview-document">
                            {/* Paper Header */}
                            <div className="resume-paper-header">
                                <div className="resume-paper-info">
                                    <h1 className="resume-paper-name">{name || "Your Name"}</h1>
                                    <div className="resume-paper-contact">
                                        {email && <span><Mail size={12} /> {email}</span>}
                                        {phone && <span><Phone size={12} /> {phone}</span>}
                                        {location && <span><MapPin size={12} /> {location}</span>}
                                    </div>
                                </div>
                                {photo && (
                                    <div className="resume-paper-photo">
                                        <img src={photo} alt="Candidate Avatar" />
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {summary && (
                                <div className="resume-paper-section">
                                    <h3 className="section-heading">Professional Summary</h3>
                                    <p className="summary-text">{summary}</p>
                                </div>
                            )}

                            {/* Education */}
                            {education.some((e) => e.institution || e.degree) && (
                                <div className="resume-paper-section">
                                    <h3 className="section-heading">Education</h3>
                                    {education.map((edu, i) => (
                                        (edu.institution || edu.degree) ? (
                                            <div key={i} className="resume-item">
                                                <div className="resume-item-top">
                                                    <span className="item-title">{edu.degree || "Degree"}</span>
                                                    {(edu.startYear || edu.endYear) && (
                                                        <span className="item-date">{edu.startYear} {edu.startYear && edu.endYear ? "-" : ""} {edu.endYear}</span>
                                                    )}
                                                </div>
                                                <div className="resume-item-sub">
                                                    <span>{edu.institution}</span>
                                                    {edu.score && <span className="item-score">{edu.score}</span>}
                                                </div>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {/* Experience */}
                            {experience.some((e) => e.company || e.role) && (
                                <div className="resume-paper-section">
                                    <h3 className="section-heading">Experience & Internships</h3>
                                    {experience.map((exp, i) => (
                                        (exp.company || exp.role) ? (
                                            <div key={i} className="resume-item">
                                                <div className="resume-item-top">
                                                    <span className="item-title">{exp.role || "Position"}</span>
                                                    {exp.duration && <span className="item-date">{exp.duration}</span>}
                                                </div>
                                                <div className="resume-item-sub">
                                                    <span>{exp.company}</span>
                                                </div>
                                                {exp.description && (
                                                    <p className="resume-item-desc">{exp.description}</p>
                                                )}
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}

                            {/* Skills */}
                            {skillsInput.trim() && (
                                <div className="resume-paper-section">
                                    <h3 className="section-heading">Skills</h3>
                                    <div className="resume-skills-grid">
                                        {skillsInput.split(",").map((s, idx) => {
                                            const trimmed = s.trim();
                                            return trimmed ? <span key={idx} className="resume-skill-pill">{trimmed}</span> : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {projects.some((p) => p.title) && (
                                <div className="resume-paper-section">
                                    <h3 className="section-heading">Key Projects</h3>
                                    {projects.map((proj, i) => (
                                        proj.title ? (
                                            <div key={i} className="resume-item">
                                                <div className="resume-item-top">
                                                    <span className="item-title">{proj.title}</span>
                                                    {proj.link && <span className="item-link">{proj.link}</span>}
                                                </div>
                                                {proj.description && (
                                                    <p className="resume-item-desc">{proj.description}</p>
                                                )}
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP VERIFICATION MODAL */}
            {showOtpModal && (
                <div className="modal-overlay">
                    <div className="otp-modal-box">
                        <div className="otp-modal-header">
                            <div className="otp-icon-wrap">
                                <KeyRound size={24} color="#0ea5e9" />
                            </div>
                            <h2>Email Verification OTP</h2>
                            <button className="close-btn" onClick={() => setShowOtpModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="otp-modal-body">
                            <p className="otp-instruct">
                                {otpSentMessage || `An OTP verification code has been sent to ${email} before proceeding to payment.`}
                            </p>

                            {demoOtp && (
                                <div className="demo-otp-banner">
                                    <span>Demo Test Code: <strong>{demoOtp}</strong></span>
                                </div>
                            )}

                            <div className="otp-input-group">
                                <label>Enter 6-Digit OTP Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value)}
                                    placeholder="e.g. 123456"
                                    className="otp-field"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="button"
                                className="verify-otp-btn"
                                onClick={handleVerifyOtp}
                                disabled={otpVerifying}
                            >
                                {otpVerifying ? "Verifying..." : "Verify OTP & Proceed to Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RAZORPAY PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="modal-overlay">
                    <div className="payment-modal-box">
                        <div className="payment-modal-header">
                            <div className="razorpay-logo-badge">
                                <CreditCard size={20} /> Razorpay Gateway
                            </div>
                            <button className="close-btn" onClick={() => setShowPaymentModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="payment-modal-body">
                            <div className="payment-summary-card">
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Service</span>
                                    <span>Resume Creation & Profile Attachment</span>
                                </div>
                                <div className="summary-row">
                                    <span>Registered Email</span>
                                    <span>{email}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Payable</span>
                                    <span className="total-price">₹50.00</span>
                                </div>
                            </div>

                            <div className="payment-sec-notice">
                                <Lock size={16} /> 256-Bit SSL Encrypted Razorpay Checkout
                            </div>

                            <button
                                type="button"
                                className="pay-now-action-btn"
                                onClick={() => finalizePaymentAndSaveResume()}
                                disabled={paymentProcessing}
                            >
                                {paymentProcessing ? (
                                    "Processing Payment..."
                                ) : (
                                    <>Pay ₹50 & Attach Resume to Profile</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
