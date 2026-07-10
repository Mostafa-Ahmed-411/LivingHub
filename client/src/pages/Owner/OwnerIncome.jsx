import React from "react";
import { DollarSign, TrendingUp, AlertCircle, Download } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { paymentHistory } from "../../data/mockData";

export default function OwnerIncome() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={DollarSign} label="This Month" value="EGP 18,400" change={8} color="green" />
        <StatCard icon={TrendingUp} label="Total Earned" value="EGP 142K" change={15} color="blue" />
        <StatCard icon={AlertCircle} label="Pending" value="EGP 4,500" color="amber" />
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Payment History</h3>
          <Btn variant="outline" size="sm">
            <Download className="w-4 h-4" /> Export
          </Btn>
        </div>
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
              {paymentHistory.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{tx.id}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 max-w-36 truncate">{tx.property}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                    EGP {tx.amount.toLocaleString()}
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
      </div>
    </div>
  );
}
