import React from "react";
import {
  BarChart2,
  Plus,
  Building2,
  TrendingUp,
  DollarSign,
  MessageSquare,
  User,
  Calendar
} from "lucide-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function OwnerDashboard({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab ID from route path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentTab = pathParts[1] || "dashboard";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, badge: 0 },
    { id: "add-unit", label: "Add Unit", icon: Plus, badge: 0 },
    { id: "my-units", label: "My Units", icon: Building2, badge: 0 },
    { id: "analytics", label: "Analytics", icon: TrendingUp, badge: 0 },
    { id: "income", label: "Income", icon: DollarSign, badge: 0 },
    { id: "chats", label: "Messages", icon: MessageSquare, badge: 2 },
    { id: "profile", label: "Profile", icon: User, badge: 0 },
    { id: "history", label: "History", icon: Calendar, badge: 0 }
  ];

  const activeItem = navItems.find((n) => n.id === currentTab) || navItems[0];
  const title = activeItem.label;

  const handleTabChange = (tabId) => {
    navigate(`/owner/${tabId}`);
  };

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={activeItem.id}
      onTabChange={handleTabChange}
      onNavigate={onNavigate}
      userRole="Property Owner"
    >
      <Outlet />
    </DashboardLayout>
  );
}
