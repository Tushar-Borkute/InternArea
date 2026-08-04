import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import translations, { type Language, type TranslationKey } from "../locales/translations";

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  pendingFrench: boolean;
  setPendingFrench: (v: boolean) => void;
  confirmFrench: () => void;
  cancelFrench: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};

const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem("internarea_language");
  if (saved && ["en", "es", "hi", "pt", "zh", "fr"].includes(saved)) {
    return saved as Language;
  }
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getSavedLanguage);
  const [pendingFrench, setPendingFrench] = useState(false);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] ?? translations["en"][key] ?? key;
    },
    [language]
  );

  const changeLanguage = useCallback(async (lang: Language) => {
    if (lang === "fr") {
      // Trigger OTP flow — the OTP modal is managed via pendingFrench flag
      setPendingFrench(true);
      return;
    }
    setLanguage(lang);
    localStorage.setItem("internarea_language", lang);
  }, []);

  const confirmFrench = useCallback(() => {
    setLanguage("fr");
    localStorage.setItem("internarea_language", "fr");
    setPendingFrench(false);
  }, []);

  const cancelFrench = useCallback(() => {
    setPendingFrench(false);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        pendingFrench,
        setPendingFrench,
        confirmFrench,
        cancelFrench,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
