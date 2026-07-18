import React, { useState, useEffect, useContext } from "react";
import { Building2, Bell, Menu, X, MessageSquare, LogOut, Sun, Moon, Globe } from "lucide-react";
import Btn from "../common/Btn";
import useAuth from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { NotificationContext } from "../../context/NotificationContext";

export default function Navbar({ onNavigate, currentPage }) {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMsgDropdown, setShowMsgDropdown] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(authUser);
  const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);

  useEffect(() => {
    const updateNavbarData = () => {
      try {
        const savedData = localStorage.getItem("clientData");
        if (savedData) {
          setUser(JSON.parse(savedData));
        } else if (authUser) {
          setUser(authUser);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    updateNavbarData();
    
    // Sync theme if changed elsewhere
    const handleGlobalThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("storage", updateNavbarData);
    window.addEventListener("storage", handleGlobalThemeChange);
    return () => {
      window.removeEventListener("storage", updateNavbarData);
      window.removeEventListener("storage", handleGlobalThemeChange);
    };
  }, [authUser, currentPage]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("clientData");
      localStorage.removeItem("frozenProfileData");
      onNavigate("auth");
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    // Dispatch event to notify other components instantly
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
    }, 0);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // فك تشفير واستخراج الصورة المخفية من حقل الـ occupation
  const finalImage = user?.profileImage && !user.profileImage.includes("|||")
    ? user.profileImage
    : (user?.occupation && user.occupation.includes("|||") ? user.occupation.split("|||")[1] : "");

  const cleanOccupation = user?.occupation && user.occupation.includes("|||")
    ? user.occupation.split("|||")[0]
    : (user?.occupation || "");

  const displayName = user
    ? `${user.firstName || ""} ${user.secondName || ""}`.trim() || user.fullName
    : "";

  const navItems = [
    { label: t("nav.search"), page: "search" },
    { label: t("nav.about"), page: "about" }
  ];

  if (user) {
    navItems.push({ label: t("nav.community"), page: "community" });
    const dashboardBase = user.role === "owner" ? "/owner" : user.role === "admin" ? "/admin" : "/student";
    navItems.push({ label: t("nav.dashboard"), page: dashboardBase });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 cursor-pointer bg-transparent border-0">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Mae<span className="text-blue-600">esha</span>
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className={`text-sm font-medium transition-colors cursor-pointer bg-transparent border-0 ${
                currentPage === item.page
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Right Area */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button 
              onClick={() => setLang(lang === "en" ? "ar" : "en")} 
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent flex items-center gap-1"
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">{lang}</span>
            </button>

            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              <div className="relative">
                <button onClick={() => setShowMsgDropdown(!showMsgDropdown)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent">
                  <MessageSquare className="w-5 h-5" />
                </button>
                {showMsgDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMsgDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">{t("nav.messages")}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { onNavigate("chat"); setShowMsgDropdown(false); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0">{t("nav.openInPage")}</button>
                          <button onClick={() => setShowMsgDropdown(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0 p-0"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t("nav.noMessages")}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="relative">
                <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent">
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
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">{t("nav.notifications")}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { onNavigate("notifications"); setShowNotifDropdown(false); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-0 p-0">{t("nav.openInPage")}</button>
                          <button onClick={() => setShowNotifDropdown(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0 p-0"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            {t("nav.noNotifications")}
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                setShowNotifDropdown(false);
                              }}
                              className={`p-3 border-b border-gray-50 dark:border-gray-700 flex items-start gap-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                                n.isRead ? "opacity-60" : "bg-blue-50/20"
                              }`}
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-900 dark:text-white font-medium line-clamp-2">
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
            </div>
          )}

          {/* User Widget */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer border-0 bg-transparent text-left"
              >
                {finalImage ? (
                  <img
                    src={finalImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                  />
                ) : (
                  <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/55 text-blue-700 dark:text-blue-300 font-bold rounded-xl flex items-center justify-center text-xs">
                    {getInitials(user.fullName || displayName)}
                  </div>
                )}
                
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{cleanOccupation || user.role}</p>
                </div>
              </button>

              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 md:hidden">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          const base = user?.role === "owner" ? "/owner" : user?.role === "admin" ? "/admin" : "/student";
                          onNavigate(`${base}/profile`);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                      >
                        {t("nav.profile")}
                      </button>
                      <button
                        onClick={() => {
                          const base = user?.role === "owner" ? "/owner" : user?.role === "admin" ? "/admin" : "/student";
                          onNavigate(base);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                      >
                        {t("nav.dashboard")}
                      </button>
                      <button
                        onClick={() => {
                          const base = user?.role === "owner" ? "/owner" : user?.role === "admin" ? "/admin" : "/student";
                          onNavigate(`${base}/settings`);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                      >
                        {t("nav.settings")}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer font-semibold bg-transparent border-0 text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> {t("nav.signOut")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Btn variant="primary" size="sm" onClick={() => onNavigate("login")}>
                {lang === "en" ? "Login" : "تسجيل الدخول"}
              </Btn>
            </div>
          )}

          <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 cursor-pointer" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}