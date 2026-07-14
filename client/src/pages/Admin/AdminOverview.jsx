import React, { useState, useEffect } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Building2, DollarSign, AlertCircle, Shield, Flag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/common/StatCard";
import { growthData } from "../../data/mockData";
import { getAdminStats } from "../../api/adminService";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    availableUnits: 0,
    rentedUnits: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    unitsByType: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        if (data && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Error fetching admin statistics:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalUnits = (stats.availableUnits || 0) + (stats.rentedUnits || 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          change={12} 
          color="blue" 
        />
        <StatCard 
          icon={Building2} 
          label="Active & Rented Units" 
          value={totalUnits.toLocaleString()} 
          change={8} 
          color="green" 
        />
        <StatCard 
          icon={Users} 
          label="Landlords" 
          value={stats.totalOwners.toLocaleString()} 
          change={23} 
          color="amber" 
        />
        <StatCard 
          icon={AlertCircle} 
          label="Pending Approvals" 
          value={stats.pendingApprovals.toString()} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-5">Platform Growth Overview</h3>
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
            <button
              onClick={() => navigate("/admin/pending")}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-amber-50">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm text-gray-700 flex-1">Review {stats.pendingApprovals} pending units</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-blue-50">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 flex-1">Manage platform users</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/admin/settings")}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
            >
              <div className="p-1.5 rounded-lg bg-purple-50">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700 flex-1">Adjust limit settings & parameters</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Unit Categories Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Units Categories Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Apartments", key: "apartment", color: "bg-blue-50 text-blue-700 border-blue-100" },
            { label: "Individual Rooms", key: "room", color: "bg-green-50 text-green-700 border-green-100" },
            { label: "Studios", key: "studio", color: "bg-amber-50 text-amber-700 border-amber-100" },
            { label: "Beds / Shared", key: "bed", color: "bg-purple-50 text-purple-700 border-purple-100" }
          ].map((item) => {
            const count = stats.unitsByType[item.key] || 0;
            return (
              <div key={item.key} className={`p-4 rounded-xl border flex flex-col items-center text-center ${item.color}`}>
                <span className="text-2xl font-black mb-1">{count}</span>
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
