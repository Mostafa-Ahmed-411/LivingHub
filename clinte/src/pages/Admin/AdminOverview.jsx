import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Building2, DollarSign, AlertCircle, Shield, Flag, ChevronRight } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { growthData } from "../../data/mockData";

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="52,847" change={12} color="blue" />
        <StatCard icon={Building2} label="Properties" value="15,230" change={8} color="green" />
        <StatCard icon={DollarSign} label="Platform Revenue" value="EGP 892K" change={23} color="amber" />
        <StatCard icon={AlertCircle} label="Pending Approvals" value="12" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-5">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="usersG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="propsG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} fill="url(#usersG)" name="Users" dot={false} />
              <Area type="monotone" dataKey="props" stroke="#10B981" strokeWidth={2} fill="url(#propsG)" name="Properties" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-1.5">
            {[
              { label: "Review 12 pending listings", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Process 5 payment disputes", icon: DollarSign, color: "text-red-600", bg: "bg-red-50" },
              { label: "Verify 8 new landlords", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Respond to 3 reports", icon: Flag, color: "text-purple-600", bg: "bg-purple-50" }
            ].map((a, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`p-1.5 rounded-lg ${a.bg}`}>
                  <a.icon className={`w-4 h-4 ${a.color}`} />
                </div>
                <span className="text-sm text-gray-700 flex-1">{a.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { action: "New property listed", user: "Khaled Ibrahim", time: "5 min ago", type: "listing" },
            { action: "Payment confirmed", user: "Youssef Mahmoud", time: "12 min ago", type: "payment" },
            { action: "Account verified", user: "Sara Mohamed", time: "34 min ago", type: "verify" },
            { action: "Report submitted", user: "Nada El-Sayed", time: "1 hour ago", type: "report" },
            { action: "New registration", user: "Omar Ashraf", time: "2 hours ago", type: "register" }
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  a.type === "listing"
                    ? "bg-blue-100 text-blue-600"
                    : a.type === "payment"
                    ? "bg-green-100 text-green-600"
                    : a.type === "verify"
                    ? "bg-purple-100 text-purple-600"
                    : a.type === "report"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {a.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{a.user}</span> &mdash; {a.action}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
