import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../constants/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    // Apply attributes to HTML element
    const isRTL = lang === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    
    // Dispatch event to sync state across other components
    window.dispatchEvent(new Event("storage"));
  }, [lang]);

  useEffect(() => {
    // Sync language if changed elsewhere
    const handleGlobalLangChange = () => {
      setLangState(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", handleGlobalLangChange);
    return () => window.removeEventListener("storage", handleGlobalLangChange);
  }, []);

  const t = (keyPath) => {
    if (!keyPath) return "";
    const keys = keyPath.split(".");
    let current = translations[lang];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let engFallback = translations["en"];
        for (const k of keys) {
          if (engFallback && engFallback[k] !== undefined) {
            engFallback = engFallback[k];
          } else {
            return keyPath;
          }
        }
        return engFallback;
      }
    }
    return current;
  };

  const isRTL = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
