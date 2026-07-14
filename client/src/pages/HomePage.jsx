import React, { useState, useEffect } from "react";
import {
  Zap,
  MapPin,
  Building2,
  Search,
  Users,
  Layers,
  Home as HomeIcon,
  BedDouble,
  Star,
  ArrowRight
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PropertyCard from "../components/common/PropertyCard";
import Btn from "../components/common/Btn";
import CountUp from "../components/common/CountUp";
import { getStatsAPI } from "../api/search";
import { cities, properties, testimonials } from "../data/mockData";

function Hero({ onNavigate }) {
  const [city, setCity] = useState("Cairo");
  const [type, setType] = useState("All Types");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1920&h=1080&fit=crop&auto=format"
          alt="Cairo cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-900/75 to-blue-700/65" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-12">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/25">
          <Zap className="w-4 h-4 text-amber-300" />
          Egypt's #1 Student Housing Platform
        </div>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-tight tracking-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Find Your Perfect
          <br />
          <span className="text-blue-300">Student Home</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover verified apartments, studios, rooms, and beds near your university. Safe,
          affordable, and just a click away.
        </p>

        <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-3 sm:p-4 shadow-2xl mb-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white pl-9 pr-4 py-3 rounded-xl border border-white/30 appearance-none focus:outline-none focus:ring-2 focus:ring-white/40 text-sm font-medium"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="text-gray-900 bg-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white pl-9 pr-4 py-3 rounded-xl border border-white/30 appearance-none focus:outline-none focus:ring-2 focus:ring-white/40 text-sm font-medium"
              >
                {["All Types", "Apartment", "Room", "Studio", "Bed"].map((t) => (
                  <option key={t} value={t} className="text-gray-900 bg-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigate("search", { city, type })}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
            >
              <Search className="w-4 h-4" /> Search Now
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5 text-white/80 text-sm">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300" /> 12+ Egyptian Cities
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-300" /> 50,000+ Students
          </span>
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-400" /> 15,000+ Verified Units
          </span>
        </div>
      </div>

      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </div> */}
    </section>
  );
}

function Categories({ onNavigate }) {
  const [categories, setCategories] = useState({
    apartments: 3240,
    studios: 1850,
    rooms: 4120,
    beds: 2670
  });

  useEffect(() => {
    getStatsAPI()
      .then((data) => {
        if (data && data.success && data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => {
        console.error("Error fetching category stats:", err);
      });
  }, []);

  const cats = [
    {
      label: "Apartments",
      icon: Building2,
      count: categories.apartments,
      bg: "bg-blue-50 hover:bg-blue-100",
      border: "border-blue-100",
      iconBg: "bg-blue-600",
      tc: "text-blue-700",
      suffix: "+"
    },
    {
      label: "Studios",
      icon: Layers,
      count: categories.studios,
      bg: "bg-purple-50 hover:bg-purple-100",
      border: "border-purple-100",
      iconBg: "bg-purple-600",
      tc: "text-purple-700",
      suffix: "+"
    },
    {
      label: "Rooms",
      icon: HomeIcon,
      count: categories.rooms,
      bg: "bg-green-50 hover:bg-green-100",
      border: "border-green-100",
      iconBg: "bg-green-600",
      tc: "text-green-700",
      suffix: "+"
    },
    {
      label: "Bed Spaces",
      icon: BedDouble,
      count: categories.beds,
      bg: "bg-amber-50 hover:bg-amber-100",
      border: "border-amber-100",
      iconBg: "bg-amber-500",
      tc: "text-amber-700",
      suffix: "+"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Browse by Category
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Find exactly what fits your budget and lifestyle
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cats.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onNavigate("search", { type: cat.label.slice(0, -1) })}
            className={`${cat.bg} border ${cat.border} rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${cat.iconBg} shadow-sm flex items-center justify-center mx-auto mb-3`}
            >
              <cat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">{cat.label}</p>
            <p className={`text-sm font-semibold ${cat.tc}`}>
              <CountUp end={cat.count} suffix={cat.suffix} />
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedUnits({ onNavigate }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? properties : properties.filter((p) => p.governorate === filter);

  return (
    <section className="py-16 bg-gray-50/60">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Featured Units
            </h2>
            <p className="text-gray-500">Hand-picked, verified listings for students</p>
          </div>
          <div className="relative flex-shrink-0 w-56">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[position:right_1rem_center] bg-no-repeat cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
            >
              <option value="All">All Governorates</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Btn variant="outline" size="lg" onClick={() => onNavigate("search")}>
            View All Properties <ArrowRight className="w-4 h-4" />
          </Btn>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
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
        console.error("Error fetching stats:", err);
      });
  }, []);

  const items = [
    { value: stats.verifiedUnits, label: "Verified Units", suffix: "+" },
    { value: stats.happyStudents, label: "Happy Students", suffix: "+" },
    { value: stats.egyptianCities, label: "Egyptian Cities", suffix: "" },
    { value: stats.satisfactionRate, label: "Satisfaction Rate", suffix: "%" }
  ];

  return (
    <section className="py-16 bg-blue-600">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {items.map((s) => (
            <div key={s.label}>
              <p
                className="text-4xl font-extrabold text-white mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-blue-200 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          What Students Say
        </h2>
        <p className="text-gray-500">Real experiences from real students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">
                  {t.year} &middot; {t.university}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen">
      <Navbar onNavigate={onNavigate} currentPage="home" />
      <Hero onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <FeaturedUnits onNavigate={onNavigate} />
      <StatsStrip />
      <Testimonials />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
