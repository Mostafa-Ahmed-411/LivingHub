import React, { useState } from "react";
import { Building2, Bell, Menu, X } from "lucide-react";
import Btn from "../common/Btn";

export default function Navbar({ onNavigate, currentPage }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Living<span className="text-blue-600">Hub</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Home", page: "home" },
            { label: "Community", page: "community" },
            { label: "Chat", page: "chat" }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={`text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onNavigate("notifications")}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Btn variant="outline" size="sm" onClick={() => onNavigate("auth")}>
            Login
          </Btn>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("auth")}>
            Get Started
          </Btn>
        </div>

        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {["Home", "Community", "Chat", "Notifications"].map((l) => (
            <button
              key={l}
              onClick={() => {
                onNavigate(l.toLowerCase());
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {l}
            </button>
          ))}
          <div className="flex gap-2 pt-2">
            <Btn
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                onNavigate("auth");
                setOpen(false);
              }}
            >
              Login
            </Btn>
            <Btn
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => {
                onNavigate("auth");
                setOpen(false);
              }}
            >
              Register
            </Btn>
          </div>
        </div>
      )}
    </nav>
  );
}
