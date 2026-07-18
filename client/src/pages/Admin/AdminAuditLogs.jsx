import React, { useState, useEffect } from "react";
import { Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Btn from "../../components/common/Btn";
import Sel from "../../components/common/Sel";
import { getAuditLogs } from "../../api/adminService";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("All");
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchLogs = (page = 1, action = actionFilter) => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (action && action !== "All") params.action = action;

    getAuditLogs(params)
      .then((data) => {
        setLogs(data.logs || []);
        setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
      })
      .catch((err) => {
        console.error("Error fetching audit logs:", err);
        setLogs([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleFilterChange = (value) => {
    setActionFilter(value);
    fetchLogs(1, value);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

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
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={actionFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Actions</option>
              <option value="approve">Approvals</option>
              <option value="reject">Rejections</option>
              <option value="ban">Ban/Unban</option>
              <option value="flag">Flagging</option>
              <option value="status">Status Changes</option>
              <option value="feature">Feature Requests</option>
              <option value="report">Reports</option>
            </select>
            <span className="text-xs text-gray-400 ml-2">
              {pagination.total} total records
            </span>
          </div>
        </div>

        {/* Logs */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No audit logs found.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log._id} className="px-5 py-3.5 flex items-center gap-4">
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
                    by {log.actorName}
                    {log.actor !== log.actorName && ` (${log.actor})`}
                    {log.reason && ` · ${log.reason}`}
                    {log.targetType && ` · Target: ${log.targetType}`}
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                  {formatTime(log.time)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
