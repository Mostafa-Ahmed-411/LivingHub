import React, { useState } from "react";
import { Grid, List, MapPin, Star } from "lucide-react";
import PropertyCard from "../../components/common/PropertyCard";
import Badge from "../../components/common/Badge";
import { properties } from "../../data/mockData";

export default function StudentUnits({ onNavigate }) {
  const [view, setView] = useState("grid");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Units
          </h2>
          <p className="text-sm text-gray-500">Saved and rented properties</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-colors ${
              view === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-colors ${
              view === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate("unit-detail")}
            >
              <img src={p.image} alt={p.title} className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h4>
                  <Badge variant="primary">{p.type}</Badge>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {p.location}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-blue-600 font-bold text-sm">
                    EGP {p.price.toLocaleString()}/mo
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
