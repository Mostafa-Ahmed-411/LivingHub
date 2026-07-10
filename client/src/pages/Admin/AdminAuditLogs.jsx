import React from "react";
import { Filter, Download } from "lucide-react";
import Btn from "../../components/common/Btn";
import Sel from "../../components/common/Sel";

export default function AdminAuditLogs() {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Audit Logs
        </h2>
        <p className="text-sm text-gray-500">System-level activity tracking</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex gap-2">
            <Btn variant="outline" size="sm">
              <Filter className="w-4 h-4" /> Filter
            </Btn>
            <Sel options={["All Actions", "Login", "Property", "Payment", "User"]} className="w-40" />
          </div>
          <Btn variant="outline" size="sm">
            <Download className="w-4 h-4" /> Export
          </Btn>
        </div>

        {/* Logs */}
        <div className="divide-y divide-gray-50">
          {[
            { action: "User Login", actor: "ahmed@email.com", ip: "196.218.x.x", time: "2025-07-06 14:32:01", level: "info" },
            { action: "Property Approved", actor: "admin@livinghub.com", ip: "196.218.x.x", time: "2025-07-06 14:28:15", level: "success" },
            { action: "Payment Confirmed", actor: "system", ip: "—", time: "2025-07-06 14:15:44", level: "success" },
            { action: "Failed Login Attempt", actor: "unknown@email.com", ip: "41.72.x.x", time: "2025-07-06 14:01:23", level: "warning" },
            { action: "User Suspended", actor: "admin@livinghub.com", ip: "196.218.x.x", time: "2025-07-06 13:55:09", level: "danger" },
            { action: "Bulk Data Export", actor: "admin@livinghub.com", ip: "196.218.x.x", time: "2025-07-06 13:40:31", level: "info" }
          ].map((log, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center gap-4">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  log.level === "success"
                    ? "bg-green-500"
                    : log.level === "warning"
                    ? "bg-amber-500"
                    : log.level === "danger"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-400">
                  by {log.actor} &middot; IP: {log.ip}
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
