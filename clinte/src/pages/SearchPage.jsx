import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  Sliders
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PropertyCard from "../components/common/PropertyCard";
import Btn from "../components/common/Btn";
import { cities, properties, propertyTypes } from "../data/mockData";

export default function SearchPage({ onNavigate }) {
  const location = useLocation();
  const initialParams = location.state;
  const [filter, setFilter] = useState("All");

  // Filters state
  const [governorate, setGovernorate] = useState("All");
  const [district, setDistrict] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingFor, setListingFor] = useState("All");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");
  const [selectedFloors, setSelectedFloors] = useState([]);

  // Apply initial search parameters from Hero search
  useEffect(() => {
    if (initialParams) {
      if (initialParams.city && initialParams.city !== "All") {
        setGovernorate(initialParams.city);
      }
      if (initialParams.type && initialParams.type !== "All Types") {
        setFilter(initialParams.type);
      }
    }
  }, [initialParams]);

  const districtMap = {
    Cairo: ["Zamalek", "Nasr City", "Heliopolis", "Maadi", "New Cairo"],
    Giza: ["Mohandessin", "Dokki", "Haram", "Sheikh Zayed"],
    Assiut: ["Said", "El-Mahata", "Al-Azhar", "City"],
    Alexandria: ["Sidi Gaber", "Smouha", "Miami"],
    Mansoura: ["Gayea", "University Area"],
    Tanta: ["Saeed St", "El-Nahas"]
  };

  const handleGovernorateChange = (gov) => {
    setGovernorate(gov);
    setDistrict("All");
  };

  const toggleFloor = (floor) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  const resetFilters = () => {
    setGovernorate("All");
    setDistrict("All");
    setMinPrice("");
    setMaxPrice("");
    setListingFor("All");
    setAvailFrom("");
    setAvailTo("");
    setSelectedFloors([]);
    setFilter("All");
  };

  const filtered = properties.filter((p) => {
    // 1. Property Type (Category filter)
    if (filter !== "All" && p.type !== filter) return false;

    // 2. Governorate
    if (governorate !== "All" && p.governorate !== governorate) return false;

    // 3. District/Area
    if (district !== "All" && p.district !== district) return false;

    // 4. Price
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;

    // 5. Listing Type (Rent vs Sale)
    if (listingFor !== "All" && p.listingFor !== listingFor) return false;

    // 6. Available Period
    if (availFrom && p.availableFrom && p.availableFrom < availFrom) return false;
    if (availTo && p.availableTo && p.availableTo > availTo) return false;

    // 7. Floor
    if (selectedFloors.length > 0) {
      const isPlus15 = selectedFloors.includes("+15");
      const floorMatch = selectedFloors.includes(String(p.floor)) || (isPlus15 && p.floor > 15);
      if (!floorMatch) return false;
    }

    return true;
  });

  const floorOptions = [...Array.from({ length: 15 }, (_, i) => String(i + 1)), "+15"];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar onNavigate={onNavigate} currentPage="search" />

      {/* Main Container Layout */}
      <main className="w-full flex-1 pt-16 flex flex-col lg:flex-row relative">
        
        {/* Filters Sidebar: Fixed on desktop, inline scroll on mobile */}
        <div className="w-full lg:w-80 bg-white lg:border-r border-gray-100 lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:overflow-y-auto lg:z-30 p-5 space-y-5 flex-shrink-0">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Governorate & District */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Governorate
              </label>
              <select
                value={governorate}
                onChange={(e) => handleGovernorateChange(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              >
                <option value="All">All Governorates</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                District / Area
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={governorate === "All"}
                className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All Areas</option>
                {governorate !== "All" &&
                  districtMap[governorate]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Price (EGP)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Min</span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Max</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="10K"
                  className="w-full bg-gray-50 text-gray-900 pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Listing Type
            </label>
            <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
              {["All", "Rent", "Sale"].map((typeOption) => (
                <button
                  key={typeOption}
                  type="button"
                  onClick={() => setListingFor(typeOption)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    listingFor === typeOption
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {typeOption === "Sale" ? "Own" : typeOption}
                </button>
              ))}
            </div>
          </div>

          {/* Available Date Range: In one line with custom reset */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Available Period
              </label>
              {(availFrom || availTo) && (
                <button
                  onClick={() => {
                    setAvailFrom("");
                    setAvailTo("");
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Reset Period
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-semibold">From</span>
                <input
                  type="date"
                  value={availFrom}
                  onChange={(e) => setAvailFrom(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 pl-11 pr-2 py-2.5 rounded-xl border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-semibold">To</span>
                <input
                  type="date"
                  value={availTo}
                  onChange={(e) => setAvailTo(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 pl-8 pr-2 py-2.5 rounded-xl border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Floor Filter */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Floor
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50">
              {floorOptions.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFloors.includes(f)}
                    onChange={() => toggleFloor(f)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 font-medium">
                    {f === "+15" ? "Floor +15" : `Floor ${f}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Content Area: Pushed left on desktop */}
        <div className="flex-1 lg:ml-80 px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1
                className="text-3xl font-extrabold text-gray-900 mb-1"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Search Properties
              </h1>
              <p className="text-gray-500 text-sm">
                Showing {filtered.length} properties in Egypt
              </p>
            </div>

            {/* Quick Property Type tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${
                    filter === t
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl p-8">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 text-lg">No properties found</p>
              <p className="text-gray-500 text-sm mt-1 mb-5">
                Try adjusting or resetting your filter criteria.
              </p>
              <Btn variant="primary" onClick={resetFilters}>
                Clear All Filters
              </Btn>
            </div>
          )}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
