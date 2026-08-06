import { useState, useEffect } from "react";
import { X, FileCheck } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../api/config";
import "./ApplyModal.css";

interface Props {
  jobId: string;
  jobTitle: string;
  company: string;
  type: "job" | "internship";
  onClose: () => void;
}

const ApplyModal = ({ jobId, jobTitle, company, type, onClose }: Props) => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email || "";
  const savedPhone = userEmail ? localStorage.getItem(`candidate_phone_${userEmail}`) || "" : "";
  const savedCollege = userEmail ? localStorage.getItem(`candidate_college_${userEmail}`) || "" : "";

  const [form, setForm] = useState({
    name: currentUser?.displayName || "",
    email: userEmail,
    phone: savedPhone,
    college: savedCollege,
    degree: "",
    cgpa: "",
    skills: "",
    coverLetter: "",
  });
  const [loading, setLoading] = useState(false);
  const [attachedResume, setAttachedResume] = useState<any>(null);

  useEffect(() => {
    if (!userEmail) return;
    const checkUserResume = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/resume/user/${userEmail}`);
        if (res.data?.success && res.data?.resume) {
          const r = res.data.resume;
          setAttachedResume(r);

          // Auto-fill from attached profile resume
          setForm((prev) => ({
            ...prev,
            name: r.name || prev.name,
            phone: r.phone || prev.phone,
            skills: r.skills?.join(", ") || prev.skills,
            college: r.education?.[0]?.institution || prev.college,
            degree: r.education?.[0]?.degree || prev.degree,
            cgpa: r.education?.[0]?.score || prev.cgpa,
          }));
        }
      } catch {
        // No resume attached
      }
    };
    checkUserResume();
  }, [userEmail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/application`, {
        ...form,
        jobId,
        jobTitle,
        company,
        type,
        attachedResumeId: attachedResume?._id || null,
      });
      toast.success("Application submitted with attached candidate profile resume! 🎉");
      onClose();
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <h2>Apply for {jobTitle}</h2>
            <p>{company} &nbsp;·&nbsp; {type === "job" ? "Job" : "Internship"}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        {/* Attached Resume Banner */}
        {attachedResume && (
          <div className="resume-attached-alert">
            <FileCheck size={18} color="#008bdc" />
            <span><strong>Attached Profile Resume:</strong> Auto-filled from your active candidate resume.</span>
          </div>
        )}

        {/* Form */}
        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Personal Info */}
          <p className="modal-section-title">Personal Information</p>
          <div className="modal-row">
            <div className="modal-field">
              <label>Full Name <span className="req">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
            </div>
            <div className="modal-field">
              <label>Email <span className="req">*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. rahul@email.com" required />
            </div>
            <div className="modal-field">
              <label>Phone <span className="req">*</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" required />
            </div>
            <div className="modal-field">
              <label>Skills</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, React, SQL" />
            </div>
          </div>

          <hr className="modal-divider" />

          {/* Academic Info */}
          <p className="modal-section-title">Academic Information</p>
          <div className="modal-row">
            <div className="modal-field">
              <label>College / University</label>
              <input name="college" value={form.college} onChange={handleChange} placeholder="e.g. IIT Bombay" />
            </div>
            <div className="modal-field">
              <label>Degree</label>
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. B.Tech CS" />
            </div>
            <div className="modal-field">
              <label>CGPA / Percentage</label>
              <input name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="e.g. 8.5 / 85%" />
            </div>
          </div>

          <hr className="modal-divider" />

          {/* Cover Letter */}
          <p className="modal-section-title">Cover Letter</p>
          <div className="modal-field full">
            <label>Why should we hire you?</label>
            <textarea
              name="coverLetter"
              value={form.coverLetter}
              onChange={handleChange}
              placeholder="Tell us about yourself, your motivation, and why you are the right fit..."
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-submit" disabled={loading}>
              {loading ? <span className="modal-spinner" /> : null}
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
