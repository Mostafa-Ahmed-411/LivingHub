import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, MapPin } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { getPendingUnits, approveUnit, rejectUnit } from "../../api/adminService";

export default function AdminPending() {
  const [pendingUnits, setPendingUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    setLoading(true);
    getPendingUnits()
      .then((data) => {
        if (data && data.units) {
          setPendingUnits(data.units);
        }
      })
      .catch((err) => {
        console.error("Error fetching pending units:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this unit listing?")) return;
    try {
      await approveUnit(id);
      alert("Unit approved and published successfully!");
      fetchPending();
      // Notify parent/header that counts updated
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to approve unit.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Please specify a reason for rejecting this unit:");
    if (reason === null) return; // Cancelled
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      await rejectUnit(id, reason);
      alert("Unit rejected successfully.");
      fetchPending();
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to reject unit.");
    }
  };

  if (loading && pendingUnits.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Pending Approvals
          </h2>
          <p className="text-sm text-gray-500">{pendingUnits.length} listings awaiting review</p>
        </div>
      </div>

      {pendingUnits.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            There are no property listings currently pending admin approval.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingUnits.map((p) => {
            const id = p._id || p.id;
            const imgUrl = p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
            const locationText = p.address ? `${p.address.city}, ${p.address.governorate}` : "N/A";
            const displayTitle = p.description || p.title || `${p.unitType} in ${p.address?.city || 'N/A'}`;

            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                <img src={imgUrl} alt={displayTitle} className="w-full sm:w-28 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{displayTitle}</h4>
                    <Badge variant="warning">
                      Needs Review
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {locationText}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>Owner: {p.ownerId?.fullName || "Unknown Owner"}</span>
                    <span>&middot;</span>
                    <span>Type: {p.unitType}</span>
                    <span>&middot;</span>
                    <span className="font-semibold text-blue-600">EGP {p.price.toLocaleString()}/mo</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-1.5 flex-shrink-0 mt-2 sm:mt-0">
                  <Btn 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleApprove(id)}
                    className="flex-1 sm:flex-initial"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </Btn>
                  <Btn 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleReject(id)}
                    className="flex-1 sm:flex-initial"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
