import React, { useState } from "react";
import { Check, Heart, MapPin, BedDouble, Star, Home } from "lucide-react";

export default function PropertyCard({ property: p, onNavigate }) {
  const [liked, setLiked] = useState(false);
  const typeColor = {
    Apartment: "bg-blue-100 text-blue-700",
    Room: "bg-green-100 text-green-700",
    Studio: "bg-purple-100 text-purple-700",
    Bed: "bg-amber-100 text-amber-700"
  };

  // حساب وعرض التقييم بشكل ذكي
  const hasRating = p.rating !== undefined && p.rating !== null && p.rating > 0;
  const ratingValue = hasRating ? Number(p.rating).toFixed(1) : "New";
  const reviewsCount = p.numReviews || 0; // نقرأ عدد الريفيوهات من قاعدة البيانات لو وجد

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
      onClick={() => onNavigate("unit-detail", p)}
    >
      <div className="relative h-52 bg-gray-100 flex-shrink-0">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
        
        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
              typeColor[p.type] || "bg-gray-100 text-gray-700"
            }`}
          >
            {p.type}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
              p.listingFor === "Rent" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
            }`}
          >
            {p.listingFor === "Rent" ? "Rent" : "Own"}
          </span>
        </div>

        {p.verified && (
          <div className="absolute top-3 right-10 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Verified
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-md transition-colors ${
            liked ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 truncate">{p.location}</span>
            </div>
            
            {/* عرض النجوم والريتنج بشكل منسق ومطوّر */}
            <div className="flex items-center gap-1 bg-amber-50/80 px-2 py-0.5 rounded-md flex-shrink-0">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-700">
                {ratingValue}
              </span>
              {hasRating && reviewsCount > 0 && (
                <span className="text-[10px] text-gray-400 font-medium">
                  ({reviewsCount})
                </span>
              )}
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
            {p.title}
          </h3>

          {/* Specs layout depending on unit type */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mb-4 font-medium">
            {(p.type === "Bed" || p.type === "Studio") && (
              <>
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-blue-500" /> Bed: {p.roomBedNumber}/{p.roomBeds}
                </span>
                <span>·</span>
                <span>Apt: {p.aptPeople} Pax</span>
              </>
            )}

            {p.type === "Room" && (
              <>
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-blue-500" /> Beds: {p.beds}
                </span>
                <span>·</span>
                <span>Apt: {p.aptPeople} Pax</span>
              </>
            )}

            {p.type === "Apartment" && (
              <>
                <span className="flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-blue-500" /> Rooms: {p.beds}
                </span>
                <span>·</span>
                <span>Apt: {p.aptPeople} Pax</span>
                <span>·</span>
                <span>{p.area} m²</span>
              </>
            )}

            <span>·</span>
            <span>Floor: {p.floor}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-lg font-extrabold text-blue-600">
              EGP {p.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">/{p.period}</span>
          </div>
          <span className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
}