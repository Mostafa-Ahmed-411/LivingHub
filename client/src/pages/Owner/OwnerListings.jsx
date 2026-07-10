import React from "react";
import { Plus, Edit2, Trash2, MapPin, Eye } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { properties } from "../../data/mockData";

export default function OwnerListings({ onNavigate }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Listings
          </h2>
          <p className="text-sm text-gray-500">4 active property listings</p>
        </div>
        <Btn variant="primary" onClick={() => onNavigate("unit-form")}>
          <Plus className="w-4 h-4" /> Add New Listing
        </Btn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.slice(0, 4).map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 bg-gray-100">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant={p.available ? "success" : "danger"}>
                  {p.available ? "Available" : "Rented"}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">{p.title}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3" /> {p.location}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold text-sm">
                  EGP {p.price.toLocaleString()}/mo
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {20 + p.id * 17} views
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
