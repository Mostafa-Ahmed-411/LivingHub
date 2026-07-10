import React, { useState } from "react";
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
import DashboardLayout from "../../layouts/DashboardLayout";
import StudentOverview from "./StudentOverview";
import StudentUnits from "./StudentUnits";
import ChatPage from "../ChatPage";
import RentalHistory from "../RentalHistory";
import NotificationsPage from "../NotificationsPage";
import PaymentsPage from "../PaymentsPage";
import ProfilePage from "../ProfilePage";
import SettingsPage from "../SettingsPage";

export default function StudentDashboard({ onNavigate }) {
  const [tab, setTab] = useState("overview");

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart2, badge: 0 },
    { id: "my-units", label: "My Units", icon: Building2, badge: 0 },
    { id: "chats", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "history", label: "Rental History", icon: Calendar, badge: 0 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: 5 },
    { id: "payments", label: "Payments", icon: CreditCard, badge: 0 },
    { id: "profile", label: "My Profile", icon: User, badge: 0 },
    { id: "settings", label: "Settings", icon: Settings, badge: 0 }
  ];

  const title = navItems.find((n) => n.id === tab)?.label || "Dashboard";

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={tab}
      onTabChange={setTab}
      onNavigate={onNavigate}
      userRole="Student"
    >
      {tab === "overview" && <StudentOverview onNavigate={onNavigate} onTab={setTab} />}
      {tab === "my-units" && <StudentUnits onNavigate={onNavigate} />}
      {tab === "chats" && <ChatPage compact={true} />}
      {tab === "history" && <RentalHistory />}
      {tab === "notifications" && <NotificationsPage />}
      {tab === "payments" && <PaymentsPage />}
      {tab === "profile" && <ProfilePage />}
      {tab === "settings" && <SettingsPage />}
    </DashboardLayout>
  );
}
