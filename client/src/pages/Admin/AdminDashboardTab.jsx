import React, { useState, useEffect } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, Building2, AlertCircle, Shield, ChevronRight, Star, Zap, CreditCard, FileText, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/common/StatCard";
import { getAdminStats } from "../../api/adminService";

export default function AdminDashboardTab() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalUnits: 0,
    activeUnits: 0,
    inactiveUnits: 0,
    rentedUnits: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    unitsByType: {},
    adsOccupied: 0,
    averageRating: 0,
    openReports: 0,
    openAuditLogs: 0
  });
  const [sparklineUsers, setSparklineUsers] = useState([]);
  const [sparklineUnits, setSparklineUnits] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        if (data && data.stats) {
          setStats(data.stats);
          setSparklineUsers(data.sparklineUsers || []);
          setSparklineUnits(data.sparklineUnits || []);
          setGrowthData(data.growthData || []);
          setRecentActivity(data.recentActivity || []);
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

  const totalUnits = stats.totalUnits || 0;
  const activeUnits = stats.activeUnits || 0;
  const inactiveUnits = stats.inactiveUnits || 0;
  const totalStudents = stats.totalUsers - stats.totalOwners;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">Last 30 days</span>
            </div>
          </div>
          <h4 className="text-gray-500 text-sm font-medium mb-1">Total Users</h4>
          <div className="flex items-end justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineUsers}>
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-3 mt-auto">
            <span><strong className="text-gray-700">{totalStudents}</strong> Students</span>
            <span><strong className="text-gray-700">{stats.totalOwners}</strong> Owners</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-3 h-3" /> +8%
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">Last 30 days</span>
            </div>
          </div>
          <h4 className="text-gray-500 text-sm font-medium mb-1">Total Units</h4>
          <div className="flex items-end justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()}</h3>
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineUnits}>
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong className="text-gray-700">{activeUnits}</strong> Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span> <strong className="text-gray-700">{inactiveUnits}</strong> Inactive</span>
            </div>
            <div className="flex flex-wrap items-center text-[10px] text-gray-500 gap-x-2 gap-y-1 border-t border-gray-100 pt-1.5">
              <span>Apt: <strong>{stats.unitsByType?.apartment?.active || 0}</strong>A/<strong>{stats.unitsByType?.apartment?.inactive || 0}</strong>I</span>
              <span>• Rm: <strong>{stats.unitsByType?.room?.active || 0}</strong>A/<strong>{stats.unitsByType?.room?.inactive || 0}</strong>I</span>
              <span>• Stu: <strong>{stats.unitsByType?.studio?.active || 0}</strong>A/<strong>{stats.unitsByType?.studio?.inactive || 0}</strong>I</span>
              <span>• Bed: <strong>{stats.unitsByType?.bed?.active || 0}</strong>A/<strong>{stats.unitsByType?.bed?.inactive || 0}</strong>I</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <h4 className="text-gray-500 text-sm font-medium mb-1">Ad Slots Occupied</h4>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.adsOccupied} <span className="text-lg text-gray-400">/ 20</span></h3>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(stats.adsOccupied / 20) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h4 className="text-gray-500 text-sm font-medium mb-1">Platform Rating</h4>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.averageRating}</h3>
          <div className="flex items-center gap-1 mt-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(stats.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Needs Immediate Action */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Needs Immediate Action</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate("/admin/pending")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.pendingApprovals}</p>
              <p className="text-sm font-medium text-gray-500 line-clamp-1">Pending Approvals</p>
            </div>
          </button>

          <button onClick={() => navigate("/admin/payments")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.pendingPayments || 0}</p>
              <p className="text-sm font-medium text-gray-500 line-clamp-1">Pending Payments</p>
            </div>
          </button>

          <button onClick={() => navigate("/admin/reports")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.openReports}</p>
              <p className="text-sm font-medium text-gray-500 line-clamp-1">Open Reports</p>
            </div>
          </button>

          <button onClick={() => navigate("/admin/audit")} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.openAuditLogs}</p>
              <p className="text-sm font-medium text-gray-500 line-clamp-1">Audit Disputes</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Platform Growth (Last 30 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={3} fill="url(#usersG)" name="New Users" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="props" stroke="#10B981" strokeWidth={3} fill="url(#propsG)" name="New Units" dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 bg-transparent border-0 cursor-pointer">View All</button>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto pr-2">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-5 last:pb-0">
                {index !== recentActivity.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-gray-100"></div>
                )}
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${activity.color}`}>
                  {activity.type === 'user' && <Users className="w-3 h-3" />}
                  {activity.type === 'unit' && <Building2 className="w-3 h-3" />}
                  {activity.type === 'payment' && <CheckCircle className="w-3 h-3" />}
                  {activity.type === 'report' && <FileText className="w-3 h-3" />}
                  {activity.type === 'audit' && <Shield className="w-3 h-3" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
                  <span className="text-[10px] font-medium text-gray-400 mt-1.5 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
