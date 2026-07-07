import React from "react";
import { Star } from "lucide-react";
import Badge from "../components/common/Badge";

export default function RentalHistory({ isOwner = false }) {
  const items = [
    {
      property: "Modern Studio in Zamalek",
      type: "Studio",
      start: "Jan 2025",
      end: "Present",
      price: 2800,
      status: "Active",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format"
    },
    {
      property: "Cozy Room in Heliopolis",
      type: "Room",
      start: "Aug 2024",
      end: "Dec 2024",
      price: 1800,
      status: "Ended",
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=140&fit=crop&auto=format"
    },
    {
      property: "Bed Space in Nasr City",
      type: "Bed",
      start: "Feb 2024",
      end: "Jul 2024",
      price: 900,
      status: "Ended",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=140&fit=crop&auto=format"
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {isOwner ? "Booking History" : "Rental History"}
        </h2>
        <p className="text-sm text-gray-500">All past and current {isOwner ? "bookings" : "rentals"}</p>
      </div>

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
                <span className="text-blue-600 font-bold text-sm">EGP {r.price.toLocaleString()}/mo</span>
                {r.status === "Ended" && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Leave Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
