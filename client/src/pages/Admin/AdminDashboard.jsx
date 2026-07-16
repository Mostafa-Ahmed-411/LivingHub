import React, { useState, useEffect } from "react";
import {
  BarChart2,
  AlertCircle,
  Users,
  Building2,
  CreditCard,
  Zap,
  FileText,
  Shield,
  Settings
} from "lucide-react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPendingUnits } from "../../api/adminService";

export default function AdminDashboard({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPendingUnits()
      .then((data) => {
        if (data && data.units) {
          setPendingCount(data.units.length);
        }
      })
      .catch((err) => console.error("Error fetching pending count for sidebar badge:", err));
  }, [location.pathname]); // Update badge count whenever path changes

  // Get active tab ID from route path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentTab = pathParts[1] || "dashboard";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, badge: 0 },
    { id: "pending", label: "Pending Approvals", icon: AlertCircle, badge: pendingCount },
    { id: "users", label: "Users", icon: Users, badge: 0 },
    { id: "units", label: "Units", icon: Building2, badge: 0 },
    { id: "payments", label: "Payments", icon: CreditCard, badge: 0 },
    { id: "ads", label: "Advertisements", icon: Zap, badge: 0 },
    { id: "reports", label: "Reports", icon: FileText, badge: 0 },
    { id: "audit", label: "Audit Logs", icon: Shield, badge: 0 },
    { id: "settings", label: "Settings", icon: Settings, badge: 0 }
  ];

  const activeItem = navItems.find((n) => n.id === currentTab) || navItems[0];
  const title = activeItem.label;

  const handleTabChange = (tabId) => {
    navigate(`/admin/${tabId}`);
  };

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={activeItem.id}
      onTabChange={handleTabChange}
      onNavigate={onNavigate}
      userRole="System Administrator"
    >
      <Outlet />
    </DashboardLayout>
  );
}
