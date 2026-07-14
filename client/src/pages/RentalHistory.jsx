import React, { useState, useEffect } from "react";
import { Star, History, Calendar } from "lucide-react";
import Badge from "../components/common/Badge";
import { getOwnerHistory } from "../api/ownerService";

export default function RentalHistory({ isOwner = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOwner) {
      getOwnerHistory()
        .then((data) => {
          const mapped = (data || []).map(u => ({
            property: `${u.unitType.charAt(0).toUpperCase() + u.unitType.slice(1)} in ${u.address?.city || 'N/A'}`,
            image: u.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
            status: "Active",
            type: u.unitType,
            start: u.availableFrom ? new Date(u.availableFrom).toLocaleDateString() : 'N/A',
            end: u.availableTo ? new Date(u.availableTo).toLocaleDateString() : 'Present',
            price: u.price
          }));
          setItems(mapped);
        })
        .catch((err) => {
          console.error("Error loading owner history:", err);
          try {
            const savedHistory = localStorage.getItem("user_history");
            setItems(savedHistory ? JSON.parse(savedHistory) : []);
          } catch (e) {
            setItems([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      try {
        const savedHistory = localStorage.getItem("user_history");
        setItems(savedHistory ? JSON.parse(savedHistory) : []);
      } catch (e) {
        setItems([]);
      }
      setLoading(false);
    }
  }, [isOwner]);

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isOwner ? "Booking History" : "Rental History"}
        </h2>
        <p className="text-sm text-gray-500">
          All past and current {isOwner ? "bookings" : "rentals"}
        </p>
      </div>

      {/* 2. حالة التصفير: لو المستخدم جديد ومفيش تاريخ لسه */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No {isOwner ? "bookings" : "rental history"} yet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {isOwner 
              ? "Your booking history is empty. Once you have active bookings, they will appear here."
              : "Your rental history is empty. Once you rent your first property, your records will appear here."
            }
          </p>
        </div>
      ) : (
        /* 3. حالة وجود بيانات: عرض التاريخ ديناميكياً */
        <div className="space-y-4">
          {items.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              <img src={r.image} alt={r.property} className="w-28 h-20 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{r.property}</h4>
                  <Badge variant={r.status === "Active" ? "success" : "default"}>{r.status}</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {r.type} &middot; {r.start} &mdash; {r.end}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-blue-600 font-bold text-sm">EGP {Number(r.price).toLocaleString()}/mo</span>
                  {r.status === "Ended" && (
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 border-0 bg-transparent cursor-pointer">
                      <Star className="w-3 h-3" /> Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}