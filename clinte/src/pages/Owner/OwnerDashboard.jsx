import React, { useState } from "react";
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
import DashboardLayout from "../../layouts/DashboardLayout";
import OwnerOverview from "./OwnerOverview";
import OwnerListings from "./OwnerListings";
import OwnerAnalytics from "./OwnerAnalytics";
import OwnerIncome from "./OwnerIncome";
import UnitFormPage from "../UnitFormPage";
import ChatPage from "../ChatPage";
import ProfilePage from "../ProfilePage";
import RentalHistory from "../RentalHistory";

export default function OwnerDashboard({ onNavigate }) {
  const [tab, setTab] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, badge: 0 },
    { id: "add-unit", label: "Add Listing", icon: Plus, badge: 0 },
    { id: "listings", label: "My Listings", icon: Building2, badge: 0 },
    { id: "analytics", label: "Analytics", icon: TrendingUp, badge: 0 },
    { id: "income", label: "Income", icon: DollarSign, badge: 0 },
    { id: "chats", label: "Messages", icon: MessageSquare, badge: 2 },
    { id: "profile", label: "Profile", icon: User, badge: 0 },
    { id: "history", label: "History", icon: Calendar, badge: 0 }
  ];

  const title = navItems.find((n) => n.id === tab)?.label || "Dashboard";

  return (
    <DashboardLayout
      title={title}
      navItems={navItems}
      activeTab={tab}
      onTabChange={setTab}
      onNavigate={onNavigate}
      userRole="Property Owner"
    >
      {tab === "dashboard" && <OwnerOverview />}
      {tab === "add-unit" && <UnitFormPage onNavigate={onNavigate} embedded={true} />}
      {tab === "listings" && <OwnerListings onNavigate={onNavigate} />}
      {tab === "analytics" && <OwnerAnalytics />}
      {tab === "income" && <OwnerIncome />}
      {tab === "chats" && <ChatPage compact={true} />}
      {tab === "profile" && <ProfilePage isOwner={true} />}
      {tab === "history" && <RentalHistory isOwner={true} />}
    </DashboardLayout>
  );
}
