import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  MapPin,
  ShieldCheck,
  Sparkles,
  Heart,
  ArrowRight
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CountUp from "../components/common/CountUp";
import { getStatsAPI } from "../api/search";

export default function AboutPage({ onNavigate }) {
  const [stats, setStats] = useState({
    verifiedUnits: 15000,
    happyStudents: 50000,
    egyptianCities: 12,
    satisfactionRate: 98
  });

  useEffect(() => {
    getStatsAPI()
      .then((data) => {
        if (data && data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Error fetching stats for about page:", err);
      });
  }, []);

  const values = [
    {
      icon: ShieldCheck,
      title: "Verified & Safe",
      description: "Every listing on Maeesha undergoes a strict manual verification process to guarantee safety and legitimacy for students.",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/20"
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "We tailor our platform to the specific needs of students—proximity to universities, budget-friendly choices, and shared living.",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/20"
    },
    {
      icon: Sparkles,
      title: "Seamless Experience",
      description: "From browsing categories to directly messaging owners, we remove the friction and brokers out of student housing.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors">
      <Navbar onNavigate={onNavigate} currentPage="about" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Egypt's Premier Student Housing Solution
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Connecting Students with <br className="hidden sm:inline" />
            <span className="text-blue-300">Safe, Verified Homes</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Maeesha is more than just a listing website. We are a dedicated platform designed to simplify transition, helping students find their perfect home near universities in Egypt.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Story & Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
              Moving to a new city for university is an exciting milestone, but finding safe, comfortable, and affordable housing has historically been a major challenge in Egypt. Brokering fees, unverified listings, and lack of transparency often lead to frustration.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              We founded **Maeesha** (which translates to living or livelihood) to empower students with options. By providing a platform focused strictly on student needs, we bridge the gap between student tenants and verified property owners.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-5 h-5" /> 100% Verified Listings
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" /> Built for Students
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&auto=format"
              alt="Students studying together in room"
              className="relative rounded-2xl shadow-xl w-full h-[400px] object-cover border border-gray-100 dark:border-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Stats Strip */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <CountUp end={stats.verifiedUnits} suffix="+" />
              </p>
              <p className="text-blue-100 text-sm font-medium">Verified Units</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <CountUp end={stats.happyStudents} suffix="+" />
              </p>
              <p className="text-blue-100 text-sm font-medium">Happy Students</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <CountUp end={stats.egyptianCities} />
              </p>
              <p className="text-blue-100 text-sm font-medium">Egyptian Cities</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <CountUp end={stats.satisfactionRate} suffix="%" />
              </p>
              <p className="text-blue-100 text-sm font-medium">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Our Core Values
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              How we approach the student housing challenge and stand by our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-5`}>
                  <v.icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {v.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Ready to find your next home?
            </h2>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Browse thousands of listings or easily list your unit as a landlord.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate("search")}
                className="bg-white hover:bg-gray-100 text-blue-700 font-semibold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0 font-sans"
              >
                Search Properties <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("login")}
                className="bg-blue-800 hover:bg-blue-900 text-white border border-blue-500/30 font-semibold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
