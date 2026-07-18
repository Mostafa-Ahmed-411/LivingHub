import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  BedDouble,
  Layers,
  Activity,
  Building2,
  Star,
  MessageSquare,
  Calendar,
  // Amenities icons
  Wind,
  Droplet,
  Utensils,
  Flame,
  Home,
  Sun,
  Tv,
  Wifi,
  Sparkles,
  Shield,
  Camera,
  User,
  X
} from "lucide-react";
import Badge from "../components/common/Badge";
import Btn from "../components/common/Btn";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getUnitByIdAPI, getRecommendedUnitsAPI, getActiveAdAPI } from "../api/search";
import { mapBackendUnitToProperty } from "../utils/propertyMapper";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function UnitDetailPage({ onNavigate }) {
  const location = useLocation();
  const [liked, setLiked] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  const typeLabels = {
    "All Types": lang === "en" ? "All Types" : "كل الأنواع",
    "Apartment": lang === "en" ? "Apartment" : "شقة",
    "Room": lang === "en" ? "Room" : "غرفة",
    "Studio": lang === "en" ? "Studio" : "استوديو",
    "Bed": lang === "en" ? "Bed" : "سرير"
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedData = localStorage.getItem("clientData");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeAd, setActiveAd] = useState(null);
  const [adPopupOpen, setAdPopupOpen] = useState(false);

  const [unlockInfo, setUnlockInfo] = useState({
    unlocked: false,
    freeUnlocksUsed: 0,
    paidUnlocksRemaining: 0,
    paidUnlocksExpiresAt: null
  });
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    method: "vodafone_cash",
    transactionId: "",
    proofImage: null
  });
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const checkUnlock = async () => {
    const unitId = location.state?._id || location.state?.id;
    if (!unitId || !currentUser) return;
    try {
      const response = await api.get(`/unlock/unlock-status/${unitId}`);
      if (response.data) {
        setUnlockInfo(response.data);
      }
    } catch (err) {
      console.error("Error checking unlock status:", err);
    }
  };

  const handleUnlock = async () => {
    const unitId = location.state?._id || location.state?.id;
    if (!unitId) return;
    setUnlockLoading(true);
    try {
      const response = await api.post(`/unlock/unlock-unit/${unitId}`);
      if (response.data && response.data.unlocked) {
        setUnlockInfo(prev => ({ ...prev, unlocked: true }));
        alert(lang === "en" ? "Landlord details revealed successfully! You can now see contact details and send messages." : "تم كشف بيانات المالك بنجاح! يمكنك الآن رؤية تفاصيل التواصل وإرسال رسالة.");
        checkUnlock();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert((lang === "en" ? "Reveal failed: " : "فشل كشف البيانات: ") + errorMsg);
    } finally {
      setUnlockLoading(false);
    }
  };

  const handlePurchasePackage = async (e) => {
    e.preventDefault();
    if (!purchaseForm.transactionId) {
      alert(lang === "en" ? "Please enter transaction ID to confirm." : "يرجى إدخال رقم العملية للتأكيد.");
      return;
    }
    if (!purchaseForm.proofImage) {
      alert(lang === "en" ? "Please attach payment proof image." : "يرجى إرفاق صورة إثبات الدفع.");
      return;
    }

    setPurchaseLoading(true);
    const formData = new FormData();
    formData.append("method", purchaseForm.method);
    formData.append("transactionId", purchaseForm.transactionId);
    formData.append("proofImage", purchaseForm.proofImage);

    try {
      await api.post("/unlock/request-contact-package", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPurchaseSuccess(true);
      alert(lang === "en" ? "Recharge request submitted successfully! The admin will review it and activate your package." : "تم إرسال طلب الشحن بنجاح! سيقوم الأدمن بمراجعته وتفعيل باقتك فوراً.");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      alert((lang === "en" ? "Failed to submit request: " : "فشل إرسال الطلب: ") + errorMsg);
    } finally {
      setPurchaseLoading(false);
    }
  };

  useEffect(() => {
    const fetchUnit = async () => {
      const unitId = location.state?._id || location.state?.id;
      if (unitId) {
        try {
          const data = await getUnitByIdAPI(unitId);
          if (data && data.unit) {
            setProperty(mapBackendUnitToProperty(data.unit));
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Error fetching unit details:", err);
        }
      }

      if (location.state) {
        setProperty(mapBackendUnitToProperty(location.state));
        setLoading(false);
      } else {
        try {
          const data = await getRecommendedUnitsAPI();
          if (data && data.units && data.units.length > 0) {
            setProperty(mapBackendUnitToProperty(data.units[0]));
          }
        } catch (err) {
          console.error("Fallback recommended units fetch failed:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    const loadActiveAd = async () => {
      try {
        const res = await getActiveAdAPI();
        if (res && res.ad) {
          setActiveAd(res.ad);
          setAdPopupOpen(true);
          setTimeout(() => {
            setAdPopupOpen(false);
          }, 3000);
        }
      } catch (err) {
        console.error("Failed to load active advertisement popup:", err);
      }
    };

    fetchUnit();
    checkUnlock();
    loadActiveAd();
  }, [location.state, currentUser]);

  const sharedAmenities = [
    { key: "hasFridge", label: "Fridge", icon: Wind },
    { key: "hasWashingMachine", label: "Washing Machine", icon: Activity },
    { key: "hasBathroom", label: "Shared Bathroom", icon: Droplet },
    { key: "hasKitchen", label: "Shared Kitchen", icon: Utensils },
    { key: "hasHeater", label: "Heater", icon: Flame }
  ];

  const amenityArabic = {
    hasFridge: "ثلاجة",
    hasWashingMachine: "غسالة",
    hasBathroom: "حمام مشترك",
    hasKitchen: "مطبخ مشترك",
    hasHeater: "سخان",
    hasBalcony: "شرفة",
    hasWindow: "نافذة",
    hasAC: "تكييف",
    hasTV: "شاشة تلفاز",
    hasWardrobe: "خزانة ملابس",
    hasWiFi: "واي فاي",
    hasCleaner: "خدمة تنظيف",
    hasSecurity: "حراسة / أمن",
    hasCameras: "كاميرات مراقبة"
  };

  const roomAmenities = [
    { key: "hasBalcony", label: "Balcony", icon: Home },
    { key: "hasWindow", label: "Window", icon: Sun },
    { key: "hasAC", label: "AC", icon: Wind },
    { key: "hasTV", label: "TV Screen", icon: Tv },
    { key: "hasWardrobe", label: "Wardrobe", icon: Layers }
  ];

  const servicesAmenities = [
    { key: "hasWiFi", label: "WiFi", icon: Wifi },
    { key: "hasCleaner", label: "Cleaner", icon: Sparkles },
    { key: "hasSecurity", label: "Security", icon: Shield },
    { key: "hasCameras", label: "Security Cameras", icon: Camera }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Navbar onNavigate={onNavigate} currentPage="search" />
        <p className="text-gray-500 font-medium">Property not found.</p>
        <Btn variant="primary" onClick={() => onNavigate("search")} className="mt-4">
          Back to Search
        </Btn>
      </div>
    );
  }

  const p = property;
  const freeRemaining = Math.max(0, 2 - (unlockInfo.freeUnlocksUsed || 0));
  const paidRemaining = unlockInfo.paidUnlocksRemaining || 0;
  const isPaidExpired = unlockInfo.paidUnlocksExpiresAt ? new Date(unlockInfo.paidUnlocksExpiresAt) < new Date() : true;
  const activePaidRemaining = isPaidExpired ? 0 : paidRemaining;
  const reqUserIsOwnerOrAdmin = currentUser && (
    currentUser.role === "admin" ||
    (p && p.ownerId && (p.ownerId === currentUser.id || p.ownerId === currentUser._id || p.ownerId === currentUser.id || p.ownerId === currentUser._id))
  );
  const hasRating = p.rating > 0;
  const ratingText = hasRating ? Number(p.rating).toFixed(1) : "New";

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar onNavigate={onNavigate} currentPage="search" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1">
        <button
          onClick={() => onNavigate("search")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} /> {t("detail.backBtn")}
        </button>

        {/* Gallery - Two main images side-by-side */}
        <div className="grid grid-cols-2 gap-3 mb-8 rounded-2xl overflow-hidden h-80">
          <img
            src={p.image}
            alt="Main 1"
            className="w-full h-full object-cover"
          />
          <img
            src={p.image2 || p.image}
            alt="Main 2"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{typeLabels[p.type] || p.type}</Badge>
                  <Badge variant="success">{p.listingFor === "Rent" ? (lang === "en" ? "Rent" : "إيجار") : (lang === "en" ? "Own" : "تمليك")}</Badge>
                  {p.verified && <Badge variant="warning">{t("detail.verified")}</Badge>}
                </div>
                <h1
                  className="text-2xl font-bold text-gray-900 mb-1.5"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {p.title}
                </h1>
                <p className="text-gray-500 flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" /> {p.location}
                </p>
              </div>
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2.5 rounded-xl border-2 transition-all ${
                  liked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Features Strip */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 mb-6 justify-between lg:justify-start lg:gap-8">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BedDouble className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {p.type === "Bed" || p.type === "Studio" 
                      ? (lang === "en" ? `Bed ${p.roomBedNumber}/${p.roomBeds}` : `سرير ${p.roomBedNumber}/${p.roomBeds}`) 
                      : (lang === "en" ? `${p.beds} Beds` : `${p.beds} أسرة`)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lang === "en" ? (p.type === "Apartment" ? "Rooms" : "Bed Configuration") : (p.type === "Apartment" ? "الغرف" : "تفاصيل السرير")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {lang === "en" ? `${p.baths || 1} Bathrooms` : `${p.baths || 1} حمام`}
                  </p>
                  <p className="text-xs text-gray-400">{lang === "en" ? "Washrooms" : "حمامات الشقة"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {lang === "en" ? `${p.aptPeople || 4} Pax` : `${p.aptPeople || 4} أفراد`}
                  </p>
                  <p className="text-xs text-gray-400">{lang === "en" ? "Total in Flat" : "السعة الكلية للمكان"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {lang === "en" ? `Floor ${p.floor}` : `الطابق ${p.floor}`}
                  </p>
                  <p className="text-xs text-gray-400">{lang === "en" ? "Level" : "الارتفاع / الدور"}</p>
                </div>
              </div>
            </div>

            {/* Bills & Utilities */}
            <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-3 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {lang === "en" ? "Utility Bills Coverage" : "تغطية فواتير المرافق"}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesWater ? "bg-green-50/50 border-green-200 text-green-800" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Droplet className={`w-5 h-5 mb-1 ${p.includesWater ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">{lang === "en" ? "Water" : "مياه"}</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesWater ? (lang === "en" ? "Included" : "مشمول") : (lang === "en" ? "Excluded" : "غير مشمول")}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesElectricity ? "bg-green-50/50 border-green-200 text-green-800" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Activity className={`w-5 h-5 mb-1 ${p.includesElectricity ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">{lang === "en" ? "Electricity" : "كهرباء"}</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesElectricity ? (lang === "en" ? "Included" : "مشمول") : (lang === "en" ? "Excluded" : "غير مشمول")}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesGas ? "bg-green-50/50 border-green-200 text-green-800" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Flame className={`w-5 h-5 mb-1 ${p.includesGas ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">{lang === "en" ? "Gas Bill" : "فاتورة الغاز"}</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesGas ? (lang === "en" ? "Included" : "مشمول") : (lang === "en" ? "Excluded" : "غير مشمول")}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                    <Flame className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{lang === "en" ? "Gas Supply Source" : "مصدر إمداد الغاز"}</p>
                    <p className="text-sm font-bold text-gray-900">{p.gasType || (lang === "en" ? "Natural Gas" : "غاز طبيعي")}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-white/80 border border-blue-200/50 px-3 py-1 rounded-lg shadow-sm">
                  {lang === "en" ? "Active" : "نشط"}
                </span>
              </div>
            </div>

            {/* About Place */}
            {p.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-sm mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {t("detail.aboutPlace")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="mb-6 space-y-6">
              <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {t("detail.amenities")}
              </h3>
              
              {sharedAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    {lang === "en" ? "Shared Amenities" : "المرافق المشتركة"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sharedAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          {lang === "en" ? item.label : (amenityArabic[item.key] || item.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roomAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    {lang === "en" ? "Room Amenities" : "مرافق الغرفة"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roomAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          {lang === "en" ? item.label : (amenityArabic[item.key] || item.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {servicesAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    {lang === "en" ? "Building Services" : "خدمات المبنى والمميزات"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {servicesAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          {lang === "en" ? item.label : (amenityArabic[item.key] || item.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-extrabold text-blue-600">EGP {p.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">/{p.period}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-amber-800">{ratingText}</span>
                  {hasRating && (
                    <span className="text-xs text-gray-400">({p.reviewsCount})</span>
                  )}
                </div>
              </div>

              {(() => {
                const depositVal = p.deposit !== undefined && p.deposit !== null && p.deposit !== "" ? Number(p.deposit) : p.price;
                const firstPaymentVal = p.price + depositVal;
                return (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Rent</span>
                      <span className="font-semibold text-gray-900">EGP {p.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Security Deposit</span>
                      <span className="font-semibold text-gray-900">EGP {depositVal.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                      <span>First Payment</span>
                      <span>EGP {firstPaymentVal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Contact Unlock System */}
              {!currentUser ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-xs text-amber-800 font-semibold mb-4">
                  {lang === "en" ? "⚠️ Please log in first to reveal the landlord's contact details." : "⚠️ يرجى تسجيل الدخول أولاً لتتمكن من كشف تفاصيل التواصل مع المالك."}
                </div>
              ) : unlockInfo.unlocked || reqUserIsOwnerOrAdmin ? (
                <div className="space-y-3 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 space-y-2">
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                      {lang === "en" ? "Landlord Contacts" : "تفاصيل التواصل مع المالك"}
                    </p>
                    <div className="text-sm font-bold text-gray-900 flex flex-col gap-1">
                      <span>👤 {p.landlord}</span>
                      <span className="text-xs text-gray-600 font-medium">📞 {p.landlordPhone || "N/A"}</span>
                      <span className="text-xs text-gray-600 font-medium">✉️ {p.landlordEmail || "N/A"}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Btn variant="primary" size="lg" className="w-full">
                      {lang === "en" ? "Request Viewing" : "طلب معاينة"}
                    </Btn>
                    <Btn
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => onNavigate("chat")}
                    >
                      <MessageSquare className="w-4 h-4" /> {lang === "en" ? "Message Landlord" : "مراسلة المالك"}
                    </Btn>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {/* Masked Info Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1.5 opacity-80">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {lang === "en" ? "Landlord Contacts (Locked)" : "تفاصيل التواصل مع المالك (مغلق)"}
                    </p>
                    <div className="text-sm font-bold text-gray-400 flex flex-col gap-1">
                      <span>👤 {lang === "en" ? "Owner: *******" : "المالك: *******"}</span>
                      <span className="text-xs font-medium">📞 {lang === "en" ? "Phone: *******" : "الهاتف: *******"}</span>
                    </div>
                  </div>

                  {/* Quota Unlock Actions */}
                  {freeRemaining > 0 || activePaidRemaining > 0 ? (
                    <div className="bg-blue-50/50 border border-blue-150 rounded-xl p-3.5 text-center">
                      <Btn
                        variant="primary"
                        size="md"
                        className="w-full mb-2"
                        onClick={handleUnlock}
                        disabled={unlockLoading}
                      >
                        {unlockLoading ? (lang === "en" ? "Revealing..." : "جاري الكشف...") : `📞 ${lang === "en" ? "Reveal Landlord Contacts" : "كشف تفاصيل المالك"}`}
                      </Btn>
                      <p className="text-[10px] text-blue-600 font-bold">
                        {freeRemaining > 0 
                          ? (lang === "en" ? `You have ${freeRemaining} free unlocks remaining` : `لديك ${freeRemaining} محاولات مجانية متبقية`) 
                          : (lang === "en" ? `You have ${activePaidRemaining} paid unlocks remaining` : `لديك ${activePaidRemaining} محاولات مدفوعة متبقية`)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5">
                      <p className="text-xs text-amber-800 font-bold text-center mb-3">
                        {lang === "en" ? "⚠️ You have consumed all your available contact unlocks." : "⚠️ لقد استهلكت جميع محاولات التواصل المتاحة لك."}
                      </p>

                      {purchaseSuccess ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 text-[11px] font-semibold p-2.5 rounded-lg text-center">
                          {lang === "en" ? "🎉 Recharge request submitted successfully! The admin will verify it soon." : "🎉 تم إرسال طلب الشحن بنجاح! سيتم مراجعته وتفعيله فور تأكيد الأدمن."}
                        </div>
                      ) : (
                        <form onSubmit={handlePurchasePackage} className="space-y-2">
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                            {lang === "en" 
                              ? "Purchase additional contact package (10 unlocks for 20 EGP) via Vodafone Cash or InstaPay:" 
                              : "اشحن باقة تواصل إضافية (10 تواصل بـ 20 ج) عن طريق فودافون كاش أو إنستاباي:"}
                          </p>
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-0.5">
                              {lang === "en" ? "Payment Method" : "طريقة الدفع"}
                            </label>
                            <select
                              value={purchaseForm.method}
                              onChange={(e) => setPurchaseForm(prev => ({ ...prev, method: e.target.value }))}
                              className="w-full text-xs border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="vodafone_cash">Vodafone Cash</option>
                              <option value="instapay">InstaPay</option>
                              <option value="bank_transfer">Bank Transfer</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-0.5">
                              {lang === "en" ? "Transaction ID" : "رقم العملية (Transaction ID)"}
                            </label>
                            <input
                              type="text"
                              value={purchaseForm.transactionId}
                              onChange={(e) => setPurchaseForm(prev => ({ ...prev, transactionId: e.target.value }))}
                              className="w-full text-xs border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Transaction ID"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 block mb-0.5">
                              {lang === "en" ? "Payment Proof (Image)" : "إثبات الدفع (صورة)"}
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setPurchaseForm(prev => ({ ...prev, proofImage: e.target.files[0] }))}
                              className="w-full text-xs"
                            />
                          </div>
                          <Btn
                            variant="primary"
                            size="sm"
                            type="submit"
                            className="w-full mt-2"
                            disabled={purchaseLoading}
                          >
                            {purchaseLoading ? (lang === "en" ? "Sending..." : "جاري الإرسال...") : (lang === "en" ? "Purchase Package (20 EGP)" : "شحن الباقة (20 ج)")}
                          </Btn>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {lang === "en" ? `Available from ${p.availableFrom}` : `متاح من ${p.availableFrom}`}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery at the bottom */}
        {p.gallery && p.gallery.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {lang === "en" ? "Property Gallery" : "معرض الصور"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {p.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="h-28 rounded-xl overflow-hidden border border-gray-100 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                >
                  <img
                    src={imgUrl}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== نظام مراجعات وتقييمات الطلاب (Property Reviews) ==================== */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {lang === "en" ? "Tenant Reviews" : "تقييمات المستأجرين"}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-amber-800">{ratingText}</span>
              {hasRating && (
                <span className="text-xs text-gray-500">
                  {lang === "en" ? `(${p.reviewsCount} reviews)` : `(${p.reviewsCount} تقييم)`}
                </span>
              )}
            </div>
          </div>

          {!p.reviewsList || p.reviewsList.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm font-medium">
                {lang === "en" ? "No reviews from tenants yet." : "لا توجد تقييمات من المستأجرين بعد."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "en" ? "Be the first tenant to leave a review after your stay!" : "كن أول مستأجر يترك تقييماً بعد إقامتك!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {p.reviewsList.map((rev, index) => (
                <div key={rev._id || index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {rev.tenantName || (lang === "en" ? "Verified Tenant" : "مستأجر موثق")}
                          </h4>
                          <p className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-amber-700">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{rev.comment || (lang === "en" ? "Great experience and highly recommended stay!" : "تجربة رائعة وإقامة موصى بها بشدة!")}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer onNavigate={onNavigate} />

      {/* Advertisement Popout Overlay */}
      {adPopupOpen && activeAd && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-white/20">
            <button
              onClick={() => setAdPopupOpen(false)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full cursor-pointer border-0 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <a
              href={activeAd.linkUrl || "#"}
              target={activeAd.linkUrl ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={`http://localhost:3000/uploads/ads/${activeAd.image}`}
                  alt={activeAd.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block">
                    {lang === "en" ? "Sponsored" : "إعلان ممول"}
                  </span>
                  <h4 className="font-bold text-lg leading-snug mb-1">{activeAd.title}</h4>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {activeAd.description}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}