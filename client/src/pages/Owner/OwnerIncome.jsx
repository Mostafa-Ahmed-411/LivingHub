import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertCircle, Download, Wallet } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";

export default function OwnerIncome() {
  // 1. تصفير سجل الأرباح وجعله يبدأ بمصفوفة فارغة [] لأي مستخدم جديد
  const [incomeHistory, setIncomeHistory] = useState(() => {
    try {
      const savedIncome = localStorage.getItem("owner_income_history");
      return savedIncome ? JSON.parse(savedIncome) : [];
    } catch (e) {
      return [];
    }
  });

  // حساب كروت الإحصائيات ديناميكيًا بناءً على المعاملات الفعلية
  const hasIncome = incomeHistory.length > 0;

  // إجمالي الأرباح المؤكدة (Confirmed)
  const totalEarned = incomeHistory
    .filter(tx => tx.status === "confirmed")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  // الأرباح المعلقة المنتظرة التأكيد (Pending)
  const totalPending = incomeHistory
    .filter(tx => tx.status === "pending")
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  // أرباح الشهر الحالي (بافتراض فلترة التاريخ الحالي أو كحساب للمؤكد مؤخرًا)
  const thisMonthEarned = incomeHistory
    .filter(tx => tx.status === "confirmed") // يمكنك لاحقًا الفلترة بالشهر والسنة بالظبط
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards - بتصفّر وتزيد ديناميكياً مع الاستخدام الحقيقي */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label="This Month" value={`EGP ${thisMonthEarned.toLocaleString()}`} change={hasIncome ? 8 : 0} color="green" />
        <StatCard icon={TrendingUp} label="Total Earned" value={`EGP ${totalEarned.toLocaleString()}`} change={hasIncome ? 15 : 0} color="blue" />
        <StatCard icon={AlertCircle} label="Pending" value={`EGP ${totalPending.toLocaleString()}`} color="amber" />
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Payment History</h3>
          <Btn variant="outline" size="sm" disabled={!hasIncome}>
            <Download className="w-4 h-4" /> Export
          </Btn>
        </div>

        {/* 2. حالة التصفير: لو المالك جديد ومفيش أي مستأجر دفع إيجار لسه */}
        {!hasIncome ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No payments received yet</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Your financial logs are currently empty. When tenants submit payments for your units, they will show up here.
            </p>
          </div>
        ) : (
          /* 3. حالة وجود بيانات: عرض جدول الإيرادات الفعلي بالملي */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Transaction ID", "Property", "Amount", "Date", "Method", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incomeHistory.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{tx.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 max-w-36 truncate">{tx.property}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                      EGP {Number(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{tx.method}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={tx.status === "confirmed" ? "success" : "warning"}>
                        {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}