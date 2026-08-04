import { useLanguage } from "../context/LanguageContext";
import "./TrustedCompanies.css";

const logos = [
  "Google",
  "Amazon",
  "Microsoft",
  "TCS",
  "Infosys",
  "Accenture",
  "Flipkart",
  "Meta",
];

const TrustedCompanies = () => {
  const { t } = useLanguage();
  const repeatedLogos = [...logos, ...logos];

  return (
    <section className="trusted-companies" aria-label="Trusted companies">
      <div className="trusted-companies__inner">
        <div className="trusted-companies__stats">
          <div className="trusted-companies__divider" aria-hidden="true" />
          <div className="trusted-companies__stats-text">
            <h2 className="trusted-companies__count">10K+</h2>
            <p className="trusted-companies__label">{t("trusted.openingsDaily")}</p>
          </div>
        </div>

        <div
          className="trusted-companies__logos"
          aria-label="Partner companies"
        >
          <div className="trusted-companies__logo-track">
            {repeatedLogos.map((logo, index) => (
              <div
                className="trusted-companies__logo-pill"
                key={`${logo}-${index}`}
              >
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
