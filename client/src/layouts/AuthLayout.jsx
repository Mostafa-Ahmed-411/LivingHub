import React from "react";
import { Building2 } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout({ onNavigate }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=1000&fit=crop&auto=format"
          alt="Student apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply"
        />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2 cursor-pointer border-0 bg-transparent text-left">
            <div className="w-8 h-8 bg-white/25 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Maeesha
            </span>
          </button>

          <div>
            <h2
              className="text-4xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your perfect home
              <br />
              awaits you
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Join 50,000+ students finding verified housing across Egypt.
            </p>
            <div className="flex gap-3">
              {[
                { value: "15K+", label: "Units" },
                { value: "50K+", label: "Students" },
                { value: "98%", label: "Satisfied" }
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex-1 text-center border border-white/20"
                >
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
