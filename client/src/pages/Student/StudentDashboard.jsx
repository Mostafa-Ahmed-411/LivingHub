import React from "react";
import {
  BarChart2,
  Building2,
  MessageSquare,
  Calendar,
  Bell,
  CreditCard,
  User,
  Settings
} from "lucide-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function StudentDashboard({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab ID from route path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentTab = pathParts[1] || "dashboard";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, badge: 0 },
    { id: "profile", label: "My Profile", icon: User, badge: 0 },
    { id: "my-units", label: "My Units", icon: Building2, badge: 0 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 5 },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "rental-history", label: "Rental History", icon: Calendar, badge: 0 },
    { id: "payments", label: "Payments", icon: CreditCard, badge: 0 },
    { id: "settings", label: "Settings", icon: Settings, badge: 0 }
  ];

  const activeItem = navItems.find((n) => n.id === currentTab) || navItems[0];
  const title = activeItem.label;

  const handleTabChange = (tabId) => {
    navigate(`/student/${tabId}`);
  };

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={activeItem.id}
      onTabChange={handleTabChange}
      onNavigate={onNavigate}
      userRole="Student"
    >
      <Outlet />
    </DashboardLayout>
  );
}
