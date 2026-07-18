import React, { useState, useEffect } from "react";
import { FileText, CheckCircle, XCircle, ChevronLeft, ChevronRight, AlertTriangle, Clock } from "lucide-react";
import { getReports, resolveReport, dismissReport } from "../../api/adminService";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = (page = 1, status = statusFilter, reportType = typeFilter) => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (status && status !== "All") params.status = status;
    if (reportType && reportType !== "All") params.reportType = reportType;

    getReports(params)
      .then((data) => {
        setReports(data.reports || []);
        setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setReports([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports(1);
  }, []);

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    fetchReports(1, value, typeFilter);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    fetchReports(1, statusFilter, value);
  };

  const handleResolve = async (id) => {
    const resolution = prompt("Enter resolution note (optional):");
    if (resolution === null) return;
    setActionLoading(id);
    try {
      await resolveReport(id, resolution || "Resolved by admin");
      fetchReports(pagination.page);
    } catch (err) {
      alert("Failed to resolve report: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (id) => {
    if (!confirm("Are you sure you want to dismiss this report?")) return;
    setActionLoading(id);
    try {
      await dismissReport(id);
      fetchReports(pagination.page);
    } catch (err) {
      alert("Failed to dismiss report: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const statusBadge = (status) => {
    const styles = {
      open: "bg-amber-50 text-amber-700 border-amber-200",
      resolved: "bg-green-50 text-green-700 border-green-200",
      dismissed: "bg-gray-50 text-gray-500 border-gray-200"
    };
    const icons = {
      open: <Clock className="w-3 h-3" />,
      resolved: <CheckCircle className="w-3 h-3" />,
      dismissed: <XCircle className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || styles.open}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const typeBadge = (type) => {
    const styles = {
      unit: "bg-blue-50 text-blue-700",
      user: "bg-purple-50 text-purple-700",
      payment: "bg-emerald-50 text-emerald-700",
      other: "bg-gray-50 text-gray-600"
    };
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[type] || styles.other}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Reports
        </h2>
        <p className="text-sm text-gray-500">User-submitted reports and complaints</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All</option>
              <option value="unit">Unit</option>
              <option value="user">User</option>
              <option value="payment">Payment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            {pagination.total} total reports
          </span>
        </div>

        {/* Reports Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Reason</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Reported By</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">{typeBadge(report.reportType)}</td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-900 font-medium line-clamp-2">{report.reason}</p>
                      {report.resolution && (
                        <p className="text-xs text-gray-400 mt-0.5">Resolution: {report.resolution}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-gray-700">{report.reportedBy?.fullName || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{report.reportedBy?.email || ""}</p>
                    </td>
                    <td className="px-5 py-3">{statusBadge(report.status)}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(report.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {report.status === "open" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResolve(report._id)}
                            disabled={actionLoading === report._id}
                            className="text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-0 disabled:opacity-50"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleDismiss(report._id)}
                            disabled={actionLoading === report._id}
                            className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border-0 disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {report.resolvedBy?.fullName && `by ${report.resolvedBy.fullName}`}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                onClick={() => fetchReports(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchReports(pagination.page + 1)}
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
