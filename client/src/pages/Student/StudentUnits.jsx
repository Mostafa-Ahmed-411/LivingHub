import React, { useState, useEffect } from "react";
import { Grid, List, MapPin, Star } from "lucide-react";
import PropertyCard from "../../components/common/PropertyCard";
import Badge from "../../components/common/Badge";

export default function StudentUnits({ onNavigate }) {
  const [view, setView] = useState("grid");
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب الوحدات المؤجرة الحقيقية من الباك إيند
    fetch("/api/user/dashboard/units")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        // السيرفر يرجع { units: [...] }
        setUnits(data.units || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student units:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse font-medium">Loading units...</p>
      </div>
    );
  }

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

      {units.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-400 text-sm mb-3">You don't have any rented units yet.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((p) => {
            // توحيد الحقول لتتوافق مع مكون PropertyCard
            const propertyAdapter = {
              id: p._id,
              title: p.title || p.name,
              price: p.price,
              location: p.location || p.address,
              image: p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format",
              type: p.type || "Unit",
              rating: p.rating || 5.0
            };
            return (
              <PropertyCard key={propertyAdapter.id} property={propertyAdapter} onNavigate={onNavigate} />
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((p) => {
            const title = p.title || p.name;
            const image = p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format";
            const location = p.location || p.address;
            const price = p.price || 0;
            const type = p.type || "Unit";
            const rating = p.rating || 5.0;

            return (
              <div
                key={p._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate("unit-detail")}
              >
                <img src={image} alt={title} className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{title}</h4>
                    <Badge variant="primary">{type}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-blue-600 font-bold text-sm">
                      EGP {price.toLocaleString()}/mo
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {rating}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}