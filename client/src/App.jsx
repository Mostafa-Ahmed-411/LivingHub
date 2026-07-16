import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import VerifyOTPPage from "./pages/Auth/VerifyOTPPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentOverview from "./pages/Student/StudentOverview";
import StudentUnits from "./pages/Student/StudentUnits";
import MaintenancePage from "./pages/Student/MaintenancePage"; // 1. استيراد صفحة الصيانة الجديدة
import RentalHistory from "./pages/RentalHistory";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerOverview from "./pages/Owner/OwnerOverview";
import OwnerListings from "./pages/Owner/OwnerListings";
import OwnerAnalytics from "./pages/Owner/OwnerAnalytics";
import OwnerIncome from "./pages/Owner/OwnerIncome";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDashboardTab from "./pages/Admin/AdminDashboardTab";
import AdminPending from "./pages/Admin/AdminPending";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAds from "./pages/Admin/AdminAds";
import AdminAuditLogs from "./pages/Admin/AdminAuditLogs";
import UnitFormPage from "./pages/UnitFormPage";
import UnitDetailPage from "./pages/UnitDetailPage";
import ChatPage from "./pages/ChatPage";
import CommunityPage from "./pages/CommunityPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

function DemoNav({ current }) {
  const navigate = useNavigate();
  const pages = [
    { id: "/", label: "Home" },
    { id: "/search", label: "Search" },
    { id: "/login", label: "Login" },
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
      auth: "/login",
      login: "/login",
      register: "/register",
      "verify-account": "/verify-account",
      "forgot-password": "/forgot-password",
      student: "/student",
      owner: "/owner",
      admin: "/admin",
      "unit-form": "/unit-form",
      "unit-detail": "/unit-detail",
      chat: "/chat",
      community: "/community",
      notifications: "/notifications",
      payments: "/payments",
      search: "/search",
      about: "/about"
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
        <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
        <Route element={<AuthLayout onNavigate={handleNavigate} />}>
          <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-account" element={<VerifyOTPPage onNavigate={handleNavigate} />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['user', 'student']} />}>
          <Route path="/student" element={<StudentDashboard onNavigate={handleNavigate} />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentOverview onNavigate={handleNavigate} onTab={(targetTab) => handleNavigate(`/student/${targetTab}`)} />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-units" element={<StudentUnits onNavigate={handleNavigate} />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="messages" element={<ChatPage compact={true} />} />
            <Route path="rental-history" element={<RentalHistory />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} /> {/* 2. ربط المسار رسمياً لمنع الشاشة البيضاء */}
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner" element={<OwnerDashboard onNavigate={handleNavigate} />}>
            <Route index element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="dashboard" element={<OwnerOverview />} />
            <Route path="add-unit" element={<UnitFormPage onNavigate={handleNavigate} embedded={true} />} />
            <Route path="my-units" element={<OwnerListings onNavigate={handleNavigate} />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
            <Route path="income" element={<OwnerIncome />} />
            <Route path="chats" element={<ChatPage compact={true} />} />
            <Route path="profile" element={<ProfilePage isOwner={true} />} />
            <Route path="history" element={<RentalHistory isOwner={true} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard onNavigate={handleNavigate} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardTab />} />
            <Route path="pending" element={<AdminPending />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="units" element={<OwnerListings onNavigate={handleNavigate} />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="ads" element={<AdminAds />} />
            <Route path="reports" element={<OwnerAnalytics />} />
            <Route path="audit" element={<AdminAuditLogs />} />
            <Route path="settings" element={<SettingsPage isAdmin={true} />} />
          </Route>
        </Route>

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