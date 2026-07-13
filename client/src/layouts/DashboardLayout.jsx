import React, { useState, useEffect } from "react";
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
  const { user: authUser } = useAuth();
  
  // قراءة مباشرة من المتصفح لمنع أي كاش للبيانات القديمة الراجعة من السيرفر
  const [localUser, setLocalUser] = useState(() => {
    try {
      const savedData = localStorage.getItem("clientData");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      return null;
    }
  });

  // مراقبة مستمرة وصارمة لكل حركة أو تغيير تبويب (Tab) جوه الداشبورد لإجبار المكون على الاستماع والتحديث
  useEffect(() => {
    const checkUpdates = () => {
      try {
        const savedData = localStorage.getItem("clientData");
        if (savedData) {
          setLocalUser(JSON.parse(savedData));
        } else if (authUser) {
          setLocalUser(authUser);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    checkUpdates();

    window.addEventListener("storage", checkUpdates);
    return () => window.removeEventListener("storage", checkUpdates);
  }, [authUser, activeTab, title]); // إضافة activeTab و title تجبر الهيدر يفضل صاحي ويحدث نفسه أوتوماتيك مع كل نقلة صفحة

  const handleAbsoluteLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("clientData");
    localStorage.removeItem("frozenProfileData");
    onNavigate("auth");
    window.location.reload(); // تنظيف كامل وفوري للخروج من الأكونت علطول
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // 💡 الحيلة الذكية: فك التشفير واستخراج الصورة فوراً من حقل الـ occupation لو الـ profileImage العادي فاضي
  const finalImage = localUser?.profileImage && !localUser.profileImage.includes("|||")
    ? localUser.profileImage
    : (localUser?.occupation && localUser.occupation.includes("|||") ? localUser.occupation.split("|||")[1] : "");

  const cleanOccupation = localUser?.occupation && localUser.occupation.includes("|||")
    ? localUser.occupation.split("|||")[0]
    : (localUser?.occupation || "");

  const displayName = localUser
    ? `${localUser.firstName || ""} ${localUser.secondName || ""}`.trim() || localUser.fullName || localUser.name
    : "Ahmed Hassan";
  const displayRole = localUser ? localUser.role : userRole;

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
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5 flex-shrink-0">
          {/* تصليح زرار الـ Sign Out للـ لأسفل ليقوم بالخروج الفوري الحقيقي وتنظيف الكاش كاملاً */}
          <button
            onClick={handleAbsoluteLogout}
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
              
              {/* عرض الصورة المشفرة من قاعدة البيانات بنجاح وثبات كامل في الهيدر والداشبورد */}
              {finalImage ? (
                <img
                  src={finalImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-lg flex items-center justify-center text-[10px]">
                  {getInitials(displayName)}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                <p className="text-xs text-gray-400 capitalize">{cleanOccupation || displayRole}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}