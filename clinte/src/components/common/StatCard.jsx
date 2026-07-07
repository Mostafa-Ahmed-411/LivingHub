import React from "react";

export default function StatCard({ icon: Icon, label, value, change, color = "blue" }) {
  const c = {
    blue: { icon: "text-blue-600", bg: "bg-blue-50" },
    green: { icon: "text-green-600", bg: "bg-green-50" },
    amber: { icon: "text-amber-600", bg: "bg-amber-50" },
    purple: { icon: "text-purple-600", bg: "bg-purple-50" }
  };
  const s = c[color] || c.blue;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${s.bg}`}>
          <Icon className={`w-5 h-5 ${s.icon}`} />
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
      <p
        className="text-2xl font-bold text-gray-900 mb-1"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
