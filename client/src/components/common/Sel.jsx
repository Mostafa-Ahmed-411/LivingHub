import React from "react";
import { ChevronDown } from "lucide-react";

export default function Sel({
  label,
  options = [],
  value,
  onChange,
  className = ""
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
