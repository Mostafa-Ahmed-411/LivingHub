import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UnitFormPage from "./pages/UnitFormPage";
import UnitDetailPage from "./pages/UnitDetailPage";
import ChatPage from "./pages/ChatPage";
import CommunityPage from "./pages/CommunityPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SearchPage from "./pages/SearchPage";

function DemoNav({ current }) {
  const navigate = useNavigate();
  const pages = [
    { id: "/", label: "Home" },
    { id: "/search", label: "Search" },
    { id: "/auth", label: "Auth" },
    { id: "/student", label: "Student" },
    { id: "/owner", label: "Owner" },
    { id: "/admin", label: "Admin" },
    { id: "/unit-form", label: "Add Unit" },
    { id: "/unit-detail", label: "Property" },
    { id: "/chat", label: "Chat" },
    { id: "/community", label: "Community" },
    { id: "/notifications", label: "Notifs" },
    { id: "/payments", label: "Payments" }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-950/95 backdrop-blur-sm rounded-2xl px-3 py-2 flex items-center gap-1 shadow-2xl border border-white/10 flex-wrap justify-center max-w-[95vw]">
      <span className="text-white/40 text-xs font-medium mr-1 hidden sm:block">Demo:</span>
      {pages.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            navigate(p.id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            current === p.id
              ? "bg-blue-600 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, state = null) => {
    const routeMap = {
      home: "/",
      auth: "/auth",
      student: "/student",
      owner: "/owner",
      admin: "/admin",
      "unit-form": "/unit-form",
      "unit-detail": "/unit-detail",
      chat: "/chat",
      community: "/community",
      notifications: "/notifications",
      payments: "/payments",
      search: "/search"
    };

    const targetRoute = routeMap[path] || path;
    navigate(targetRoute, { state });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/search" element={<SearchPage onNavigate={handleNavigate} />} />
        <Route path="/auth" element={<AuthPage onNavigate={handleNavigate} />} />
        <Route path="/student" element={<StudentDashboard onNavigate={handleNavigate} />} />
        <Route path="/owner" element={<OwnerDashboard onNavigate={handleNavigate} />} />
        <Route path="/admin" element={<AdminDashboard onNavigate={handleNavigate} />} />
        <Route
          path="/unit-form"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onNavigate={handleNavigate} currentPage="unit-form" />
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
                <UnitFormPage onNavigate={handleNavigate} />
              </div>
            </div>
          }
        />
        <Route path="/unit-detail" element={<UnitDetailPage onNavigate={handleNavigate} />} />
        <Route
          path="/chat"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onNavigate={handleNavigate} currentPage="chat" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
                <h1
                  className="text-2xl font-bold text-gray-900 mb-6"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Messages
                </h1>
                <ChatPage />
              </div>
            </div>
          }
        />
        <Route path="/community" element={<CommunityPage onNavigate={handleNavigate} />} />
        <Route
          path="/notifications"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onNavigate={handleNavigate} currentPage="notifications" />
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
                <NotificationsPage />
              </div>
            </div>
          }
        />
        <Route
          path="/payments"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar onNavigate={handleNavigate} currentPage="payments" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
                <PaymentsPage />
              </div>
            </div>
          }
        />
      </Routes>
      <DemoNav current={location.pathname} />
    </div>
  );
}
