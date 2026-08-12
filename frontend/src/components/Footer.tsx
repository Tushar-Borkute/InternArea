import { useLanguage } from "../context/LanguageContext";
import "./footer.css";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-column">
        <a href="/about-us">{t("footer.aboutUs")}</a>
        <a href="/careers">{t("footer.hiring")}</a>
        <a href="/hire-interns">{t("footer.hireInterns")}</a>
        <a href="/post-a-job">{t("footer.postJob")}</a>
        <a href="/competitions">{t("footer.competitions")}</a>
      </div>

      <div className="footer-column">
        <a href="/team-diary">{t("footer.teamDiary")}</a>
        <a href="/blog">{t("footer.blog")}</a>
        <a href="/services">{t("footer.services")}</a>
        <a href="/free-job-alerts">{t("footer.freeJobAlerts")}</a>
      </div>

      <div className="footer-column">
        <a href="/terms-and-conditions">{t("footer.terms")}</a>
        <a href="/privacy-policy">{t("footer.privacy")}</a>
        <a href="/contact-us">{t("footer.contactUs")}</a>
        <a href="/annual-returns">{t("footer.annualReturns")}</a>
        <a href="/grievance-redressal">{t("footer.grievance")}</a>
        <a href="/resume-maker">{t("footer.resumeMaker")}</a>
      </div>

      <div className="footer-column">
        <a href="/sitemap">{t("footer.sitemap")}</a>
        <a href="/college-tpo-registration">{t("footer.collegeTPO")}</a>
        <a href="/companies">{t("footer.companies")}</a>
        <a href="/jobs-for-women">{t("footer.jobsForWomen")}</a>
      </div>
    </footer>
  );
};

export default Footer;