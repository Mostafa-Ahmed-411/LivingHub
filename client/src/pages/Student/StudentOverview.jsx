import React from "react";
import {
  Building2,
  Heart,
  MessageSquare,
  DollarSign,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  FileText,
  ChevronRight
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";
import PropertyCard from "../../components/common/PropertyCard";
import { properties } from "../../data/mockData";

export default function StudentOverview({ onNavigate, onTab }) {
  return (
    <div className="space-y-6">
      {/* Good morning banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Good morning, Ahmed! 👋
            </h2>
            <p className="text-blue-200 text-sm">
              You have 3 new messages and your rent is due in 7 days.
            </p>
          </div>
          <div className="hidden sm:block bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-2xl font-extrabold">Jul</p>
            <p className="text-blue-200 text-xs">7 days left</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Active Rentals" value="1" color="blue" />
        <StatCard icon={Heart} label="Saved Units" value="7" color="purple" />
        <StatCard icon={MessageSquare} label="Unread Messages" value="3" color="amber" />
        <StatCard icon={DollarSign} label="Monthly Rent" value="EGP 2,800" color="green" />
      </div>

      {/* Rental & Schedule Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Current Rental</h3>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="p-5">
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format"
                alt="Current unit"
                className="w-32 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">Modern Studio in Zamalek</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> 15 Hassan Sabry St, Zamalek, Cairo
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Monthly Rent", v: "EGP 2,800" },
                    { l: "Lease Ends", v: "Dec 2025" },
                    { l: "Landlord", v: "Ahmed H." }
                  ].map((item) => (
                    <div key={item.l} className="bg-gray-50 rounded-xl p-2 text-center">
                      <p className="text-xs text-gray-500">{item.l}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Btn variant="primary" size="sm" onClick={() => onTab("messages")}>
                <MessageSquare className="w-4 h-4" /> Message Landlord
              </Btn>
              <Btn variant="outline" size="sm" onClick={() => onTab("payments")}>
                <CreditCard className="w-4 h-4" /> Pay Rent
              </Btn>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Upcoming</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { title: "Rent Payment Due", date: "Jul 7, 2025", urgent: true, icon: CreditCard },
              { title: "Viewing - Room in Heliopolis", date: "Jul 10, 2025", urgent: false, icon: Eye },
              { title: "Lease Renewal Notice", date: "Aug 1, 2025", urgent: false, icon: FileText }
            ].map((ev, i) => (
              <div
                key={i}
                className={`flex gap-3 p-3 rounded-xl ${
                  ev.urgent ? "bg-red-50 border border-red-100" : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    ev.urgent ? "bg-red-100" : "bg-blue-100"
                  }`}
                >
                  <ev.icon className={`w-4 h-4 ${ev.urgent ? "text-red-600" : "text-blue-600"}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${ev.urgent ? "text-red-700" : "text-gray-900"}`}>
                    {ev.title}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> {ev.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Units Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Saved Units</h3>
          <Btn variant="ghost" size="sm" onClick={() => onTab("my-units")}>
            View All <ChevronRight className="w-4 h-4" />
          </Btn>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
