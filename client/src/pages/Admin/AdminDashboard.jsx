import React, { useState } from "react";
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
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminOverview from "./AdminOverview";
import AdminPending from "./AdminPending";
import AdminUsers from "./AdminUsers";
import OwnerListings from "../Owner/OwnerListings";
import PaymentsPage from "../PaymentsPage";
import AdminAds from "./AdminAds";
import OwnerAnalytics from "../Owner/OwnerAnalytics";
import AdminAuditLogs from "./AdminAuditLogs";
import SettingsPage from "../SettingsPage";

export default function AdminDashboard({ onNavigate }) {
  const [tab, setTab] = useState("overview");

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart2, badge: 0 },
    { id: "pending", label: "Pending Approvals", icon: AlertCircle, badge: 12 },
    { id: "users", label: "Users", icon: Users, badge: 0 },
    { id: "properties", label: "Properties", icon: Building2, badge: 0 },
    { id: "payments", label: "Payments", icon: CreditCard, badge: 0 },
    { id: "ads", label: "Advertisements", icon: Zap, badge: 0 },
    { id: "reports", label: "Reports", icon: FileText, badge: 0 },
    { id: "audit", label: "Audit Logs", icon: Shield, badge: 0 },
    { id: "settings", label: "Settings", icon: Settings, badge: 0 }
  ];

  const title = navItems.find((n) => n.id === tab)?.label || "Admin";

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={tab}
      onTabChange={setTab}
      onNavigate={onNavigate}
      userRole="Admin"
    >
      {tab === "overview" && <AdminOverview />}
      {tab === "pending" && <AdminPending />}
      {tab === "users" && <AdminUsers />}
      {tab === "properties" && <OwnerListings onNavigate={onNavigate} />}
      {tab === "payments" && <PaymentsPage />}
      {tab === "ads" && <AdminAds />}
      {tab === "reports" && <OwnerAnalytics />}
      {tab === "audit" && <AdminAuditLogs />}
      {tab === "settings" && <SettingsPage isAdmin={true} />}
    </DashboardLayout>
  );
}
