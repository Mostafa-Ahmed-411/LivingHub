import React from "react";
import { Building2 } from "lucide-react";

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
          <div>
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Living<span className="text-blue-400">Hub</span>
              </span>
            </button>
            <p className="text-sm leading-relaxed mb-4 text-gray-500">
              Egypt's premier student housing platform connecting students with safe, verified
              accommodations.
            </p>
            <div className="flex gap-2">
              {["T", "F", "I", "L"].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer text-xs font-bold text-gray-300"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: ["How it Works", "Browse Units", "List Property", "Pricing"]
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "Safety Tips", "Community"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Privacy Policy"]
            }
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <button className="text-sm text-gray-500 hover:text-white transition-colors">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">&copy; 2025 LivingHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((l) => (
              <button key={l} className="text-gray-500 hover:text-white transition-colors">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
