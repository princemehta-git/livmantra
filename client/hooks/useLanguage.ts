import { useState, useEffect } from "react";

export type Language = "en" | "hi";

const LANGUAGE_STORAGE_KEY = "livmantra_language";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLanguage === "en" || savedLanguage === "hi") {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    changeLanguage(newLang);
  };

  return {
    language,
    changeLanguage,
    toggleLanguage,
  };
}

