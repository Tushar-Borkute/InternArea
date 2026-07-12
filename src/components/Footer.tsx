import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <a href="/about-us">About us</a>
        <a href="/careers">We're hiring</a>
        <a href="/hire-interns">Hire interns for your company</a>
        <a href="/post-a-job">Post a Job</a>
        <a href="/competitions">Competitions</a>
      </div>

      <div className="footer-column">
        <a href="/team-diary">Team Diary</a>
        <a href="/blog">Blog</a>
        <a href="/services">Our Services</a>
        <a href="/free-job-alerts">Free Job Alerts</a>
      </div>

      <div className="footer-column">
        <a href="/terms-and-conditions">Terms & Conditions</a>
        <a href="/privacy-policy">Privacy</a>
        <a href="/contact-us">Contact us</a>
        <a href="/annual-returns">Annual Returns</a>
        <a href="/grievance-redressal">Grievance Redressal</a>
        <a href="/resume-maker">Resume Maker</a>
      </div>

      <div className="footer-column">
        <a href="/sitemap">Sitemap</a>
        <a href="/college-tpo-registration">College TPO Registration</a>
        <a href="/companies">List of Companies</a>
        <a href="/jobs-for-women">Jobs for Women</a>
      </div>
    </footer>
  );
};

export default Footer;