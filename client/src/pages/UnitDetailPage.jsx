import React, { useState } from "react";
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
  Camera
} from "lucide-react";
import Badge from "../components/common/Badge";
import Btn from "../components/common/Btn";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { properties } from "../data/mockData";

export default function UnitDetailPage({ onNavigate }) {
  const location = useLocation();
  const [liked, setLiked] = useState(false);

  const rawProperty = location.state || properties[0];

  const mapBackendUnitToProperty = (u) => {
    if (!u) return {};
    if (u.id && !u._id) return u;

    let images = u.images || [];
    let image = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&fit=crop";
    let image2 = "";
    if (images.length > 0) {
      image = images[0] && !images[0].startsWith('http') ? `http://localhost:5000/uploads/units/${images[0]}` : images[0];
    }
    if (images.length > 1) {
      image2 = images[1] && !images[1].startsWith('http') ? `http://localhost:5000/uploads/units/${images[1]}` : images[1];
    }
    const resolvedGallery = images.map(img => img && !img.startsWith('http') ? `http://localhost:5000/uploads/units/${img}` : img);

    const city = u.address?.city || "Cairo";
    const gov = u.address?.governorate || "Egypt";
    const street = u.address?.street ? `, ${u.address.street}` : "";
    const locationStr = `${city}, ${gov}${street}`;

    const specs = u.specifications || {};
    const ams = specs.amenities || {};

    return {
      _id: u._id,
      title: u.title || `${u.unitType?.charAt(0).toUpperCase() + u.unitType?.slice(1)} in ${city}`,
      type: u.unitType ? (u.unitType.charAt(0).toUpperCase() + u.unitType.slice(1)) : "Studio",
      listingFor: u.listingType === "rent" ? "Rent" : "Sale",
      location: locationStr,
      price: u.price || 0,
      period: u.listingType === "rent" ? "month" : "total",
      floor: u.floorNumber || 0,
      image,
      image2,
      gallery: resolvedGallery,
      roomBedNumber: u.bedsPerRoom || 1,
      roomBeds: u.bedsPerRoom || 1,
      aptPeople: specs.aptPeople || (u.bedsPerRoom || 1) * (u.roomsPerApartment || 1) || 1,
      beds: u.roomsPerApartment || u.bedsPerRoom || 1,
      baths: specs.baths || 1,
      area: specs.area || 100,
      rating: u.rating || 4.5,
      reviews: u.reviewsCount || 0,
      verified: u.status === "available",
      includesWater: specs.includesWater,
      includesElectricity: specs.includesElectricity,
      includesGas: specs.includesGas,
      gasType: specs.gasType || "Natural Gas",
      availableFrom: u.availableFrom ? new Date(u.availableFrom).toLocaleDateString() : "N/A",

      // Shared Amenities
      hasFridge: ams.shared?.fridge !== false,
      hasWashingMachine: ams.shared?.washingMachine !== false,
      hasBathroom: ams.shared?.sharedBathroom !== false,
      hasKitchen: ams.shared?.sharedKitchen !== false,
      hasHeater: ams.shared?.heater !== false,

      // Room Amenities
      hasBalcony: ams.room?.balcony !== false,
      hasWindow: ams.room?.window !== false,
      hasAC: ams.room?.ac !== false,
      hasTV: ams.room?.tvScreen !== false,
      hasWardrobe: ams.room?.wardrobe !== false,

      // Building Services
      hasWiFi: ams.building?.wifi !== false,
      hasCleaner: ams.building?.cleaner !== false,
      hasSecurity: ams.building?.security !== false,
      hasCameras: ams.building?.securityCameras !== false
    };
  };

  const p = mapBackendUnitToProperty(rawProperty);

  const sharedAmenities = [
    { key: "hasFridge", label: "Fridge", icon: Wind },
    { key: "hasWashingMachine", label: "Washing Machine", icon: Activity },
    { key: "hasBathroom", label: "Shared Bathroom", icon: Droplet },
    { key: "hasKitchen", label: "Shared Kitchen", icon: Utensils },
    { key: "hasHeater", label: "Heater", icon: Flame }
  ];

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

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16">
      <Navbar onNavigate={onNavigate} currentPage="search" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1">
        <button
          onClick={() => onNavigate("search")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
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
                  <Badge variant="primary">{p.type}</Badge>
                  <Badge variant="success">{p.listingFor === "Rent" ? "Rent" : "Own"}</Badge>
                  {p.verified && <Badge variant="warning">Verified</Badge>}
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
                    {p.type === "Bed" || p.type === "Studio" ? `Bed ${p.roomBedNumber}/${p.roomBeds}` : `${p.beds} Beds`}
                  </p>
                  <p className="text-xs text-gray-400">{p.type === "Apartment" ? "Rooms" : "Bed Configuration"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layers className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.baths || 1} Bathrooms</p>
                  <p className="text-xs text-gray-400">Washrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.aptPeople || 4} Pax</p>
                  <p className="text-xs text-gray-400">Total in Flat</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.floor} Floor</p>
                  <p className="text-xs text-gray-400">Level</p>
                </div>
              </div>
            </div>

            {/* Bills & Utilities Checklist Card Grid */}
            <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-3 font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Utility Bills Coverage
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesWater ? "bg-green-50/50 border-green-200 text-green-800 animate-pulse-once" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Droplet className={`w-5 h-5 mb-1 ${p.includesWater ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">Water</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesWater ? "Included" : "Excluded"}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesElectricity ? "bg-green-50/50 border-green-200 text-green-800" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Activity className={`w-5 h-5 mb-1 ${p.includesElectricity ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">Electricity</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesElectricity ? "Included" : "Excluded"}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${p.includesGas ? "bg-green-50/50 border-green-200 text-green-800" : "bg-gray-100/50 border-gray-200 text-gray-400"}`}>
                    <Flame className={`w-5 h-5 mb-1 ${p.includesGas ? "text-green-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold">Gas Bill</span>
                    <span className="text-[10px] mt-0.5 font-medium">{p.includesGas ? "Included" : "Excluded"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                    <Flame className="w-4 h-4 text-blue-600 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Gas Supply Source</p>
                    <p className="text-sm font-bold text-gray-900">{p.gasType || "Natural Gas"}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-white/80 border border-blue-200/50 px-3 py-1 rounded-lg shadow-sm">
                  Active
                </span>
              </div>
            </div>

            {/* Optional Details */}
            {p.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-sm mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  About this place
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Grouped Amenities Checklist (Only show true/checked amenities with icons) */}
            <div className="mb-6 space-y-6">
              <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Amenities & Services
              </h3>
              
              {/* Group 1: Shared */}
              {sharedAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Shared Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sharedAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: Room */}
              {roomAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Room Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roomAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 3: Services */}
              {servicesAmenities.some(item => p[item.key]) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Building Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {servicesAmenities.filter(item => p[item.key]).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2.5 border border-emerald-100 rounded-xl px-3.5 py-2 bg-emerald-50/40 text-emerald-950 shadow-sm"
                      >
                        <item.icon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-semibold">{item.label}</span>
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
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{p.rating}</span>
                  <span className="text-sm text-gray-400">({p.reviews})</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly Rent</span>
                  <span className="font-semibold text-gray-900">EGP {p.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-semibold text-gray-900">EGP {(p.price * 2).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                  <span>First Payment</span>
                  <span>EGP {(p.price * 3).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Btn variant="primary" size="lg" className="w-full">
                  Request Viewing
                </Btn>
                <Btn
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => onNavigate("chat")}
                >
                  <MessageSquare className="w-4 h-4" /> Message Landlord
                </Btn>
              </div>

              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Available from {p.availableFrom}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Extra Images Gallery at the bottom */}
        {p.gallery && p.gallery.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Property Gallery
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
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
