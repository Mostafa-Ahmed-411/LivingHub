import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  Sliders,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PropertyCard from "../components/common/PropertyCard";
import Btn from "../components/common/Btn";
import { cities, propertyTypes } from "../constants/staticData";
import { searchUnitsAPI } from "../api/search";
import { mapBackendUnitToProperty } from "../utils/propertyMapper";
import { useLanguage } from "../context/LanguageContext";

export default function SearchPage({ onNavigate }) {
  const location = useLocation();
  const initialParams = location.state;
  const [filter, setFilter] = useState("All");
  const { t, lang, isRTL } = useLanguage();

  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filters state
  const [governorate, setGovernorate] = useState("All");
  const [district, setDistrict] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingFor, setListingFor] = useState("All");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [nearestUniversity, setNearestUniversity] = useState("");
  const [availability, setAvailability] = useState("available");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");

  // Pagination states
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // API loading & results state
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Reset page to 1 whenever any filter state changes
  useEffect(() => {
    setPage(1);
  }, [
    filter,
    governorate,
    district,
    minPrice,
    maxPrice,
    listingFor,
    availFrom,
    availTo,
    selectedFloors,
    nearestUniversity,
    availability,
    minRating,
    sort
  ]);

  const districtMap = {
    Assiut: ["محطة", "شارع سيد", "المكتبات", "فريال"]
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
    setNearestUniversity("");
    setAvailability("available");
    setMinRating(0);
    setSort("newest");
    setPage(1);
  };

  // Fetch results from backend API on filter/page changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit: 15
        };
        if (filter && filter !== "All") params.unitType = filter.toLowerCase();
        if (listingFor && listingFor !== "All") params.listingType = listingFor.toLowerCase();
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (governorate && governorate !== "All") params.governorate = governorate;
        if (district && district !== "All") params.district = district;
        if (nearestUniversity) params.nearestUniversity = nearestUniversity;
        if (availFrom) params.availableFrom = availFrom;
        if (availTo) params.availableTo = availTo;
        if (selectedFloors.length > 0) {
          params.floors = selectedFloors.join(",");
        }
        params.availability = availability;
        params.sort = sort;

        const data = await searchUnitsAPI(params);
        setUnits(data.units || []);
        setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch units from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [
    filter,
    governorate,
    district,
    minPrice,
    maxPrice,
    listingFor,
    availFrom,
    availTo,
    selectedFloors,
    nearestUniversity,
    availability,
    minRating,
    sort,
    page
  ]);

  const displayedUnits = units.map(mapBackendUnitToProperty);
  const floorOptions = [...Array.from({ length: 15 }, (_, i) => String(i + 1)), "+15"];

  const typeOptionsTranslation = {
    "All": lang === "en" ? "All" : "الكل",
    "Apartment": lang === "en" ? "Apartment" : "شقة",
    "Room": lang === "en" ? "Room" : "غرفة",
    "Studio": lang === "en" ? "Studio" : "استوديو",
    "Bed": lang === "en" ? "Bed" : "سرير"
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar onNavigate={onNavigate} currentPage="search" />

      {/* Main Container Layout */}
      <main className="w-full flex-1 pt-16 flex flex-col lg:flex-row relative">
        
        {/* Expand Trigger Button: fixed left tab */}
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="fixed left-0 top-24 z-40 bg-white border border-l-0 border-gray-200 p-2.5 rounded-r-xl shadow-md cursor-pointer hover:bg-gray-50 flex items-center justify-center transition-all duration-300 text-blue-600 hover:text-blue-700"
            title={lang === "en" ? "Show Filters" : "إظهار الفلاتر"}
          >
            <ChevronRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        )}

        {/* Filters Sidebar: sticky, width reduced to lg:w-64 and collapsible */}
        <div
          className={`bg-white border-gray-100 lg:border-r lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:z-20 p-4 space-y-4 flex-shrink-0 transition-all duration-300 ${
            isCollapsed 
              ? "hidden" 
              : "block w-full lg:w-64"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
              <Sliders className="w-3.5 h-3.5 text-blue-600" /> {t("search.filters")}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                <RefreshCw className="w-2.5 h-2.5" /> {t("search.reset")}
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg cursor-pointer border-0"
                title={t("search.collapse")}
              >
                <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Governorate & District */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {t("search.governorate")}
              </label>
              <select
                value={governorate}
                onChange={(e) => handleGovernorateChange(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer"
              >
                <option value="All">{t("featured.allGovs")}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {t("search.district")}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={governorate === "All"}
                className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="All">{lang === "en" ? "All Areas" : "كل الأحياء"}</option>
                {governorate !== "All" &&
                  districtMap[governorate]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Nearest University */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t("search.nearestUni")}
            </label>
            <input
              type="text"
              value={nearestUniversity}
              onChange={(e) => setNearestUniversity(e.target.value)}
              placeholder="e.g. Al-Azhar, MSA"
              className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>


          {/* Price Range */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t("search.priceRange")}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="relative">
                <span className={`absolute ${isRTL ? "right-2.5" : "left-2.5"} top-1/2 -translate-y-1/2 text-gray-400 text-[10px]`}>
                  {lang === "en" ? "Min" : "الأدنى"}
                </span>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className={`w-full bg-gray-50 text-gray-900 ${isRTL ? "pr-12 pl-2" : "pl-12 pr-2"} py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                />
              </div>
              <div className="relative">
                <span className={`absolute ${isRTL ? "right-2.5" : "left-2.5"} top-1/2 -translate-y-1/2 text-gray-400 text-[10px]`}>
                  {lang === "en" ? "Max" : "الأقصى"}
                </span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="10K"
                  className={`w-full bg-gray-50 text-gray-900 ${isRTL ? "pr-12 pl-2" : "pl-12 pr-2"} py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                />
              </div>
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t("search.listingFor")}
            </label>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5">
              {["All", "Rent", "Sale"].map((typeOption) => (
                <button
                  key={typeOption}
                  type="button"
                  onClick={() => setListingFor(typeOption)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-0 ${
                    listingFor === typeOption
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {typeOption === "All" ? (lang === "en" ? "All" : "الكل") : typeOption === "Rent" ? (lang === "en" ? "Rent" : "إيجار") : (lang === "en" ? "Own" : "تمليك")}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t("search.availability")}
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="available">{t("search.available")}</option>
              <option value="all">{lang === "en" ? "All Statuses" : "كل الحالات"}</option>
            </select>
          </div>

          {/* Available Date Range */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t("search.availableFrom")}
              </label>
              {(availFrom || availTo) && (
                <button
                  onClick={() => {
                    setAvailFrom("");
                    setAvailTo("");
                  }}
                  className="text-[9px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer bg-transparent border-0"
                >
                  {t("search.reset")}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="relative">
                <span className={`absolute ${isRTL ? "right-1.5" : "left-1.5"} top-1/2 -translate-y-1/2 text-gray-400 text-[8px] font-bold`}>
                  {lang === "en" ? "From" : "من"}
                </span>
                <input
                  type="date"
                  value={availFrom}
                  onChange={(e) => setAvailFrom(e.target.value)}
                  className={`w-full bg-gray-50 text-gray-900 ${isRTL ? "pr-7 pl-1" : "pl-7 pr-1"} py-2 rounded-xl border border-gray-200 text-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium`}
                />
              </div>
              <div className="relative">
                <span className={`absolute ${isRTL ? "right-1.5" : "left-1.5"} top-1/2 -translate-y-1/2 text-gray-400 text-[8px] font-bold`}>
                  {lang === "en" ? "To" : "إلى"}
                </span>
                <input
                  type="date"
                  value={availTo}
                  onChange={(e) => setAvailTo(e.target.value)}
                  className={`w-full bg-gray-50 text-gray-900 ${isRTL ? "pr-7 pl-1" : "pl-7 pr-1"} py-2 rounded-xl border border-gray-200 text-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Floor Filter: Multi-select with Reset button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {t("search.floorLevel")}
              </label>
              {selectedFloors.length > 0 && (
                <button
                  onClick={() => setSelectedFloors([])}
                  className="text-[9px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer bg-transparent border-0"
                >
                  {t("search.reset")}
                </button>
              )}
            </div>
            <div className="max-h-32 overflow-y-auto border border-gray-100 rounded-xl p-2 space-y-1.5 bg-gray-50/50">
              {floorOptions.map((f) => (
                <label key={f} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFloors.includes(f)}
                    onChange={() => toggleFloor(f)}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-medium">
                    {f === "+15" ? (lang === "en" ? "Floor +15" : "الطابق +15") : (lang === "en" ? `Floor ${f}` : `الطابق ${f}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Content Area */}
        <div className="flex-1 px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-2xl font-extrabold text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {lang === "en" ? "Search Properties" : "بحث العقارات"}
                </h1>
              </div>
              <p className="text-gray-500 text-sm">
                {lang === "en" ? `Showing ${pagination.total} properties in Egypt` : `نعرض ${pagination.total} عقاراً في مصر`}
              </p>
            </div>

            {/* Sort & Quick Property Type tabs */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white text-gray-900 px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
              >
                <option value="newest">{t("search.newest")}</option>
                <option value="oldest">{lang === "en" ? "Oldest" : "الأقدم أولاً"}</option>
                <option value="price_asc">{t("search.priceLowHigh")}</option>
                <option value="price_desc">{t("search.priceHighLow")}</option>
                <option value="nearest_university">{lang === "en" ? "Nearest to University" : "الأقرب للجامعة"}</option>
                <option value="farthest_university">{lang === "en" ? "Farthest from University" : "الأبعد عن الجامعة"}</option>
              </select>

              <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
                {propertyTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 cursor-pointer ${
                      filter === t
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {typeOptionsTranslation[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loader or Error banner */}
          {loading ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl p-8">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="font-semibold text-gray-900">{lang === "en" ? "Loading properties..." : "جاري تحميل العقارات..."}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl p-8 text-red-700">
              <p className="font-bold text-lg mb-2">{lang === "en" ? "Something went wrong" : "حدث خطأ ما"}</p>
              <p className="text-sm mb-4">{error}</p>
              <Btn variant="outline" onClick={() => window.location.reload()}>
                {lang === "en" ? "Try Again" : "إعادة المحاولة"}
              </Btn>
            </div>
          ) : displayedUnits.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedUnits.map((p) => (
                  <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pb-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} /> {lang === "en" ? "Previous" : "السابق"}
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          page === pNum
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    className="px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    {lang === "en" ? "Next" : "التالي"} <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl p-8">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 text-lg">{lang === "en" ? "No properties found" : "لم يتم العثور على عقارات"}</p>
              <p className="text-gray-500 text-sm mt-1 mb-5">
                {t("search.noResults")}
              </p>
              <Btn variant="primary" onClick={resetFilters}>
                {lang === "en" ? "Clear All Filters" : "مسح جميع الفلاتر"}
              </Btn>
            </div>
          )}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
