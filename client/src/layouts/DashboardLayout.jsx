import React, { useState } from "react";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Bell,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import Btn from "../components/common/Btn";
import useAuth from "../hooks/useAuth";

export default function DashboardLayout({
  title,
  navItems = [],
  activeTab,
  onTabChange,
  children,
  onNavigate,
  userRole = "Student"
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.secondName || ""}`.trim() || user.fullName
    : "Ahmed Hassan";
  const displayRole = user ? user.role : userRole;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-100 transition-all duration-300 flex flex-col fixed h-full z-30`}
        style={{ boxShadow: "1px 0 0 rgba(0,0,0,0.04)" }}
      >
        {/* Sidebar Header with Collapse Button */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span
                className="text-lg font-bold text-gray-900 truncate"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Living<span className="text-blue-600">Hub</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer border-0 bg-transparent"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group cursor-pointer border-0 bg-transparent ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  activeTab === item.id
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && (
                <span
                  className={`text-sm flex-1 font-medium ${
                    activeTab === item.id ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5 flex-shrink-0">
          <button
            onClick={() => onNavigate("home")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 ${
          collapsed ? "ml-16" : "ml-64"
        } transition-all duration-300 min-w-0`}
      >
        <header
          className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}
        >
          <h1
            className="text-lg font-semibold text-gray-900 truncate"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {title}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("notifications")}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => onNavigate("chat")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-lg flex items-center justify-center text-[10px]">
                {getInitials(user?.fullName || displayName)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                <p className="text-xs text-gray-400 capitalize">{displayRole}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
