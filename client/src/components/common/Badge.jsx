import React from "react";

export default function Badge({ children, variant = "default", size = "sm" }) {
  const v = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    outline: "border border-gray-200 text-gray-600"
  };
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${v[variant] || v.default}`}
    >
      {children}
    </span>
  );
}
