import React from "react";
import { Building2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer({ onNavigate }) {
  const columns = [
    {
      title: "Find Housing",
      links: [
        { label: "Browse Units", action: () => onNavigate("search") },
        { label: "Student Community", action: () => onNavigate("community") }
      ]
    },
    {
      title: "Partners",
      links: [
        { label: "List Your Property", action: () => onNavigate("unit-form") },
        { label: "Owner Dashboard", action: () => onNavigate("owner") }
      ]
    },
    {
      title: "About",
      links: [
        { label: "About Maeesha", action: () => onNavigate("about") },
        { label: "How it Works", action: () => onNavigate("about") }
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
              Egypt's premier student housing platform connecting students with safe, verified
              accommodations.
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
          <p className="text-sm text-gray-600">&copy; 2026 Maeesha. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => onNavigate("about")} className="text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate("about")} className="text-gray-500 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
