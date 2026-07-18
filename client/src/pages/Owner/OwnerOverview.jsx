import React, { useState, useEffect } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Building2, CheckCircle, XCircle, Star, Clock, AlertTriangle, Calendar, Bed, Home, Layers, Wrench, ChevronRight } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";

// استدعاء دالة جلب البيانات من السيرفيس
import { getOwnerOverviewData } from "../../api/ownerService";

export default function OwnerOverview() {
  const [bookings, setBookings] = useState([]);
  
  // داتا وهمية لطلبات الصيانة المرفوعة من الطلاب لتشغيل الشاشة فوراً
  // const [maintenanceRequests, setMaintenanceRequests] = useState([
  //   { id: 1, tenant: "عمرو طارق", property: "شقة رقم 4 - برج الأبطال", issue: "عطل في السباكة بالحمام الرئيسي", date: "2026-07-12", status: "Pending" },
  //   { id: 2, tenant: "أحمد رامي", property: "غرفة مشتركة ب - جناح أ", issue: "تكييف الغرفة لا يبرد ويصدر صوتاً", date: "2026-07-10", status: "In Progress" },
  //   { id: 3, tenant: "محمود حسن", property: "استوديو ريفير فيو", issue: "مفتاح الكهرباء الرئيسي يفصل تلقائياً", date: "2026-07-09", status: "Resolved" }
  // ]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  // تصفير العدادات والاشتراكات بالكامل لتكون جاهزة على الشغل الفعلي
  const [counters, setCounters] = useState({
    totalUnits: 0,
    endedUnits: 0,
    inactiveUnits: 0,
    favoriteUnits: 0,
    pendingFavoriteUnits: 0,
    pendingPublishUnits: 0,
    subscriptionDaysLeft: 0 
  });

  // فرز أنواع الغرف والأسرة والاستوديوهات
  const [unitBreakdown, setUnitBreakdown] = useState({
    beds: 0,
    rooms: 0,
    studios: 0,
    apartments: 0
  });

  useEffect(() => {
    let isMounted = true;

    const calculateLocalCounters = () => {
      try {
        const localProps = localStorage.getItem("owner_properties");
        const propsArray = localProps ? JSON.parse(localProps) : [];
        
        const total = propsArray.length;
        const ended = propsArray.filter(p => p.status === "Ended" || p.status === "منتهي").length;
        const inactive = propsArray.filter(p => p.status === "inActive" || p.status === "غير نشط").length;
        const favorites = propsArray.filter(p => p.isFavorite || p.status === "Favorite").length;
        const pendingFav = propsArray.filter(p => p.pendingFavorite || p.status === "Pending Favorite").length;
        
        const storedDays = localStorage.getItem("owner_sub_days");
        const daysLeft = storedDays ? parseInt(storedDays, 10) : 0;
        
        const pendingPublish = propsArray.filter(p => p.status === "Pending" || p.isPendingPublication || daysLeft <= 0).length;

        let bedsCount = 0;
        let roomsCount = 0;
        let studiosCount = 0;
        let aptsCount = 0;

        propsArray.forEach(p => {
          const type = (p.unitType || p.type || "").toLowerCase();
          if (type.includes("bed") || type.includes("سرير")) bedsCount++;
          else if (type.includes("room") || type.includes("غرفة") || type.includes("غرفه")) roomsCount++;
          else if (type.includes("studio") || type.includes("استوديو") || type.includes("استديو")) studiosCount++;
          else aptsCount++;
        });

        if (isMounted) {
          setCounters({
            totalUnits: total,
            endedUnits: ended,
            inactiveUnits: inactive,
            favoriteUnits: favorites,
            pendingFavoriteUnits: pendingFav,
            pendingPublishUnits: pendingPublish,
            subscriptionDaysLeft: daysLeft
          });

          setUnitBreakdown({
            beds: bedsCount,
            rooms: roomsCount,
            studios: studiosCount,
            apartments: aptsCount
          });
        }
      } catch (e) {
        console.error("Error calculating overview counters:", e);
      }
    };

    calculateLocalCounters();

    getOwnerOverviewData()
      .then((data) => {
        if (!isMounted || !data) return;
        
        if (data.recentBookings && Array.isArray(data.recentBookings)) {
          setBookings(data.recentBookings);
        } else if (Array.isArray(data)) {
          setBookings(data);
        }
        
        if (data.stats) {
          setCounters(prev => ({
            ...prev,
            ...data.stats
          }));
          if (data.stats.unitBreakdown) {
            setUnitBreakdown(data.stats.unitBreakdown);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.info("اللوحة تعمل بوضعية الحساب الجديد (أصفار).");
      });

    window.addEventListener("storage", calculateLocalCounters);
    return () => {
      isMounted = false;
      window.removeEventListener("storage", calculateLocalCounters);
    };
  }, []);

  // دالة لتحديث حالة طلب الصيانة من قبل الاونر
  const handleUpdateStatus = (id, newStatus) => {
    setMaintenanceRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const currentRevenueData = bookings.length > 0 ? bookings.map((b, i) => ({ month: `U${i+1}`, revenue: parseFloat(b.rent) || 0 })) : [
    { month: "Jan", revenue: 0 }, { month: "Feb", revenue: 0 }, { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 }, { month: "May", revenue: 0 }, { month: "Jun", revenue: 0 }, { month: "Jul", revenue: 0 }
  ];

  const currentUnitTypeData = counters.totalUnits > 0 
    ? [
        { name: "Active", value: Math.max(0, counters.totalUnits - counters.inactiveUnits - counters.endedUnits), color: "#2563EB" },
        { name: "Inactive", value: counters.inactiveUnits, color: "#94A3B8" },
        { name: "Ended", value: counters.endedUnits, color: "#EF4444" }
      ].filter(item => item.value > 0)
    : [ { name: "No Units Available", value: 100, color: "#cbd5e1" } ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* الكروت العلوية الثلاثة لحالة الاشتراك ومتابعة النشر */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md p-5 text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
            <Calendar className="w-36 h-36" />
          </div>
          <p className="text-xs font-medium text-blue-100 uppercase tracking-wider mb-1">Subscription</p>
          <h4 className="text-2xl font-black mb-2">
            {counters.subscriptionDaysLeft > 0 ? `متبقٍ ${counters.subscriptionDaysLeft} يوم` : "منتهي الصلاحية / يرجى التجديد"}
          </h4>
          <div className="w-full bg-blue-500/30 rounded-full h-1.5 mb-2">
            <div className="bg-white h-1.5 rounded-full" style={{ width: `${Math.min(100, (counters.subscriptionDaysLeft / 30) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-blue-100 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> يرجى تجديد الاشتراك بانتظام لتجنب إيقاف النشر
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Publish</p>
            <h4 className="text-2xl font-black text-amber-600">{counters.pendingPublishUnits} وحدة</h4>
            <p className="text-[11px] text-gray-400">معلقة في الانتظار لعدم سداد الاشتراك</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Favorites</p>
            <h4 className="text-2xl font-black text-purple-600">{counters.pendingFavoriteUnits} وحدة</h4>
            <p className="text-[11px] text-gray-400">بانتظار تأكيد ميزة المفضلة باللوحة</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* كروت الإحصائيات الأربعة السفلية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total Units" value={counters.totalUnits} change="+0%" color="blue" />
        <StatCard icon={CheckCircle} label="Ended Units" value={counters.endedUnits} change="+0%" color="red" />
        <StatCard icon={XCircle} label="Inactive Units" value={counters.inactiveUnits} change="+0%" color="slate" />
        <StatCard icon={Star} label="Favorites" value={counters.favoriteUnits} change="+0%" color="amber" />
      </div>

      {/* قسم إحصائيات الغرف والأسرة والاساتوديوهات المضافة */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" /> Categories Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg"><Bed className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-400">Beds</p>
              <h5 className="text-lg font-bold text-gray-900">{unitBreakdown.beds} Beds</h5>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-green-100 text-green-600 rounded-lg"><Home className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-400">Rooms</p>
              <h5 className="text-lg font-bold text-gray-900">{unitBreakdown.rooms} Rooms</h5>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg"><Layers className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-400">Studios</p>
              <h5 className="text-lg font-bold text-gray-900">{unitBreakdown.studios} Studios</h5>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg"><Building2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs font-medium text-gray-400">Apartments</p>
              <h5 className="text-lg font-bold text-gray-900">{unitBreakdown.apartments} Units</h5>
            </div>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية والجداول */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-5">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={currentRevenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Unit Analytics</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={currentUnitTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {currentUnitTypeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {currentUnitTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-semibold text-gray-900">
                  {counters.totalUnits > 0 ? `${item.value} units` : `${item.value}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 👇 قسم إدارة طلبات الصيانة المضاف حديثاً (مثل شاشة الطالب) 👇 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <Wrench className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Maintenance & Tickets Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/20">
                {["Tenant", "Property & Unit", "Reported Issue", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {maintenanceRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-all">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{req.tenant}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{req.property}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 max-w-xs truncate">{req.issue}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{req.date}</td>
                  <td className="px-5 py-4">
                    <Badge 
                      variant={
                        req.status === "Resolved" ? "success" : 
                        req.status === "In Progress" ? "warning" : "danger"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {/* أزرار تفاعلية للاونر لتحديث حالة البلاغ فوراً */}
                    <div className="flex items-center gap-1.5">
                      {req.status === "Pending" && (
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "In Progress")}
                          className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                        >
                          Accept Ticket
                        </button>
                      )}
                      {req.status === "In Progress" && (
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "Resolved")}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                        >
                          Mark Solved
                        </button>
                      )}
                      {req.status === "Resolved" && (
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Done
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              No recent bookings found. Your dashboard is ready!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Tenant", "Property", "Start Date", "Monthly Rent", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((row) => (
                  <tr key={row._id || row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{row.tenant}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{row.property}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{row.date}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{row.rent}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}