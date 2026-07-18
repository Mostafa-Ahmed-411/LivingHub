import React, { useState, useEffect, useContext } from "react";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Bell,
  MessageSquare,
  ChevronDown,
  X,
  Home,
  Search,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import Btn from "../components/common/Btn";
import useAuth from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { NotificationContext } from "../context/NotificationContext";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMsgDropdown, setShowMsgDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const { user: authUser } = useAuth();
  const { lang, setLang, t } = useLanguage();
  
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
    }, 0);
  };
  
  // قراءة مباشرة من المتصفح لمنع أي كاش للبيانات القديمة الراجعة من السيرفر
  const [localUser, setLocalUser] = useState(() => {
    try {
      const savedData = localStorage.getItem("clientData");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      return null;
    }
  });

  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);

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
          <button onClick={() => onNavigate("home")} className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 text-left">
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
          </button>
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
          {navItems.map(item => {
            if (item.id === "notifications") {
              return { ...item, badge: unreadCount };
            }
            return item;
          }).map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group cursor-pointer border-0 bg-transparent relative ${
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
              {item.badge > 0 && !collapsed && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge > 0 && collapsed && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
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
            {!collapsed && <span className="text-sm font-medium">{t("nav.signOut")}</span>}
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
            {/* Home Link */}
            <button
              onClick={() => onNavigate("home")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5"
              title="Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Home</span>
            </button>

            {/* Search Link */}
            <button
              onClick={() => onNavigate("search")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1.5 mr-2"
              title="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Search Listings</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center mr-2"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center mr-2 gap-1"
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase">{lang}</span>
            </button>

            {/* Messages Dropdown */}
            <div className="relative">
              <button onClick={() => setShowMsgDropdown(!showMsgDropdown)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent">
                <MessageSquare className="w-5 h-5" />
              </button>
              {showMsgDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMsgDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Messages</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => { onNavigate("chat"); setShowMsgDropdown(false); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0">Open in page</button>
                        <button onClick={() => setShowMsgDropdown(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0 p-0"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="p-6 text-center text-sm text-gray-500">
                      No new messages
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-0 bg-transparent">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Notifications</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => { onNavigate("notifications"); setShowNotifDropdown(false); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0">Open in page</button>
                        <button onClick={() => setShowNotifDropdown(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0 p-0"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              setShowNotifDropdown(false);
                            }}
                            className={`p-3 border-b border-gray-50 flex items-start gap-2.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                              n.isRead ? "opacity-60" : "bg-blue-50/20"
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-900 font-medium line-clamp-2">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-gray-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 p-1 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent text-left"
                >
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
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                        <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            const base = localUser?.role === "owner" ? "/owner" : localUser?.role === "admin" ? "/admin" : "/student";
                            onNavigate(`${base}/profile`);
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent border-0"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            const base = localUser?.role === "owner" ? "/owner" : localUser?.role === "admin" ? "/admin" : "/student";
                            onNavigate(`${base}/settings`);
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer bg-transparent border-0"
                        >
                          Settings
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            handleAbsoluteLogout();
                            setShowDropdown(false);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer font-semibold bg-transparent border-0 text-left"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}