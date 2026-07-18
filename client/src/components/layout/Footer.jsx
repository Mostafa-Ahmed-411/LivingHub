import React from "react";
import { Building2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer({ onNavigate }) {
  const { t, lang } = useLanguage();

  const columns = [
    {
      title: t("footer.findHousing"),
      links: [
        { label: t("footer.browseUnits"), action: () => onNavigate("search") },
        { label: t("footer.studentCommunity"), action: () => onNavigate("community") }
      ]
    },
    {
      title: t("footer.partners"),
      links: [
        { label: t("footer.listProperty"), action: () => onNavigate("unit-form") },
        { label: t("footer.ownerDashboard"), action: () => onNavigate("owner") }
      ]
    },
    {
      title: t("footer.about"),
      links: [
        { label: t("footer.aboutMaeesha"), action: () => onNavigate("about") },
        { label: t("footer.howItWorks"), action: () => onNavigate("about") }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
          <div>
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 mb-4 bg-transparent border-0 cursor-pointer text-left">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Mae<span className="text-blue-400">esha</span>
              </span>
            </button>
            <p className="text-sm leading-relaxed mb-6 text-gray-500">
              {t("footer.desc")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-gray-400"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={l.action}
                      className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-left"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">&copy; 2026 Maeesha. {lang === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}</p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => onNavigate("about")} className="text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0">
              {t("footer.privacy")}
            </button>
            <button onClick={() => onNavigate("about")} className="text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0">
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
