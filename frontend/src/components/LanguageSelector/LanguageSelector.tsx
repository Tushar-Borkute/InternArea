import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LANGUAGE_META, type Language } from "../../locales/translations";
import "./LanguageSelector.css";

const LANGUAGES = Object.entries(LANGUAGE_META) as [Language, typeof LANGUAGE_META[Language]][];

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = async (lang: Language) => {
    setOpen(false);
    await changeLanguage(lang);
  };

  const currentMeta = LANGUAGE_META[language];

  return (
    <div className="lang-selector" ref={ref}>
      <button
        className="lang-trigger-btn"
        onClick={() => setOpen((p) => !p)}
        title={t("nav.selectLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={15} className="lang-globe-icon" />
        <span className="lang-flag">{currentMeta.flag}</span>
        <span className="lang-code">{language.toUpperCase()}</span>
        <ChevronDown
          size={13}
          className={`lang-chevron ${open ? "open" : ""}`}
        />
      </button>

      {open && (
        <div className="lang-dropdown" role="listbox" aria-label="Select language">
          <div className="lang-dropdown-header">{t("nav.selectLanguage")}</div>
          {LANGUAGES.map(([code, meta]) => (
            <button
              key={code}
              className={`lang-option ${language === code ? "active" : ""}`}
              onClick={() => handleSelect(code)}
              role="option"
              aria-selected={language === code}
            >
              <span className="lang-option-flag">{meta.flag}</span>
              <div className="lang-option-text">
                <span className="lang-option-native">{meta.nativeName}</span>
                <span className="lang-option-english">{meta.label}</span>
              </div>
              {language === code && (
                <Check size={14} className="lang-check" />
              )}
              {code === "fr" && (
                <span className="lang-otp-badge">OTP</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
