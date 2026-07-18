import React, { useState, useEffect } from "react";
import { Wrench, Clock, CheckCircle2, AlertCircle, Plus, X } from "lucide-react";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";
import api from "../../api/client";

export default function MaintenancePage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالة التحكم في فتح وإغلاق نافذة البلاغ الجديد
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حقول البلاغ الجديد
  const [category, setCategory] = useState("Plumbing");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // جلب البلاغات الحقيقية
    api.get("/user/dashboard/maintenance")
      .then((res) => {
        setTickets(res.data.tickets || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching maintenance tickets:", err);
        setLoading(false);
      });
  }, []);

  // دالة إرسال البلاغ الجديد للباك إيند
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTicket = {
      title,
      category,
      description,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    // إرسال للباك إيند (POST)
    api.post("/user/dashboard/maintenance", newTicket)
      .then((res) => {
        // تحديث القائمة فوراً في الفرونت إيند بدون ريفريش
        setTickets([res.data.ticket, ...tickets]); 
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error("Error submitting maintenance ticket:", err);
        alert(err.response?.data?.message || err.message || "Failed to submit request.");
      });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return <Badge variant="success">Resolved</Badge>;
      case "In Progress":
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="danger">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse font-medium">Loading maintenance history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة مع زر إضافة تذكرة جديدة */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Maintenance Requests
          </h2>
          <p className="text-sm text-gray-500">Track and manage your apartment maintenance tickets</p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Ticket
        </Btn>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Your Tickets</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No maintenance requests submitted yet.</p>
            </div>
          ) : (
            tickets.map((ticket, index) => (
              <div key={ticket._id || index} className="p-5 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-gray-100 p-2 rounded-xl flex-shrink-0">
                    {getStatusIcon(ticket.status)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                        {ticket.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted on: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== نافذة منبثقة لإضافة تذكرة جديدة (Modal) ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-blue-600">
                <Wrench className="w-5 h-5" />
                <h3 className="font-bold text-gray-900 text-lg">Report Maintenance Issue</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">ISSUE CATEGORY</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-blue-400 transition-colors"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Plumbing">Plumbing (سباكة)</option>
                  <option value="Electricity">Electricity (كهرباء)</option>
                  <option value="Appliances">Appliances (أجهزة كهربائية)</option>
                  <option value="Internet">Internet (إنترنت)</option>
                  <option value="Furniture">Furniture (أثاث)</option>
                  <option value="Others">Others (أخرى)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">TITLE</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Water leak in bathroom" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-blue-400 transition-colors"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">DETAILED DESCRIPTION</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Explain exactly what is broken and when it happened..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-blue-400 transition-colors resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Btn variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Btn>
                <Btn variant="primary" size="sm" type="submit">
                  Submit Ticket
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}