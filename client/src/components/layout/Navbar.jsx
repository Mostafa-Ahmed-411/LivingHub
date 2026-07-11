import React, { useState } from "react";
import { Building2, Bell, Menu, X, MessageSquare, LogOut, Sun, Moon } from "lucide-react";
import Btn from "../common/Btn";
import useAuth from "../../hooks/useAuth";

export default function Navbar({ onNavigate, currentPage }) {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate("auth");
      setOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.secondName || ""}`.trim() || user.fullName
    : "";

  // Build items list based on auth state & role
  const navItems = [
    { label: "Search", page: "search" },
    { label: "About Maeesha", page: "about" }
  ];

  if (user) {
    navItems.push({ label: "Community", page: "community" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 cursor-pointer bg-transparent border-0">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Living<span className="text-blue-600">Hub</span>
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
          {/* Theme & Language Switchers (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-0"
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              {lang === "en" ? "العربية" : "English"}
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          {/* Notifications and Chats (Desktop only) */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate("chat")}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                title="Chats"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate("notifications")}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          )}

          {/* User Widget (Visible on both Mobile and Desktop) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer border-0 bg-transparent text-left"
              >
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/55 text-blue-700 dark:text-blue-300 font-bold rounded-xl flex items-center justify-center text-xs">
                  {getInitials(user.fullName)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              </button>

              {/* User Dropdown Overlay */}
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 md:hidden">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{displayName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>

                    <div className="py-1">
                      {user.role === "student" && (
                        <button
                          onClick={() => {
                            onNavigate("student");
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                        >
                          Dashboard
                        </button>
                      )}
                      {user.role === "owner" && (
                        <>
                          <button
                            onClick={() => {
                              onNavigate("owner");
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              onNavigate("unit-form");
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                          >
                            Add Property
                          </button>
                        </>
                      )}
                      {user.role === "admin" && (
                        <button
                          onClick={() => {
                            onNavigate("admin");
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0"
                        >
                          Admin Panel
                        </button>
                      )}
                      {/* Add Mobile-Only Shortcuts inside the dropdown */}
                      <button
                        onClick={() => {
                          onNavigate("chat");
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0 md:hidden"
                      >
                        Chats
                      </button>
                      <button
                        onClick={() => {
                          onNavigate("notifications");
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer bg-transparent border-0 md:hidden"
                      >
                        Notifications
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
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Btn variant="primary" size="sm" onClick={() => onNavigate("login")}>
                Login
              </Btn>
            </div>
          )}

          {/* Mobile drawer toggle (Only shown for menu navigation: Search, About, Community) */}
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 cursor-pointer" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Search, About, Community) */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.page);
                  setOpen(false);
                }}
                className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  currentPage === item.page
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Language and Theme Switcher Row in Mobile Drawer */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-b border-gray-100 dark:border-gray-800 my-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer bg-transparent border-0"
            >
              Language: {lang === "en" ? "العربية" : "English"}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer bg-transparent border-0"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" /> Light Mode
                </>
              )}
            </button>
          </div>

          {!user && (
            <div className="pt-1">
              <Btn
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  onNavigate("login");
                  setOpen(false);
                }}
              >
                Login
              </Btn>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
