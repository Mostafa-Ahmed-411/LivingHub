import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, MapPin, Star, CreditCard, ExternalLink } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { 
  getPendingUnits, 
  approveUnit, 
  rejectUnit,
  getFeatureRequests,
  approveFeature,
  rejectFeature,
  getPendingPayments,
  approvePaymentAPI,
  rejectPaymentAPI
} from "../../api/adminService";
import { BACKEND_URL } from "../../api/client";

export default function AdminPending() {
  const navigate = useNavigate();
  const [pendingUnits, setPendingUnits] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);

  const handleViewDetails = (unit) => {
    navigate("/unit-detail", { state: unit });
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("listings");

  const fetchData = () => {
    setLoading(true);
    Promise.all([getPendingPayments(), getFeatureRequests()])
      .then(([pendingsRes, featureRes]) => {
        if (pendingsRes) {
          if (pendingsRes.pendingUnits) setPendingUnits(pendingsRes.pendingUnits);
          if (pendingsRes.pendingPayments) setPendingPayments(pendingsRes.pendingPayments);
        }
        if (featureRes && featureRes.units) {
          setFeatureRequests(featureRes.units);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this unit listing?")) return;
    try {
      await approveUnit(id);
      alert("Unit approved and published successfully!");
      fetchData();
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to approve unit.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Please specify a reason for rejecting this unit:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      await rejectUnit(id, reason);
      alert("Unit rejected successfully.");
      fetchData();
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
      alert("Failed to reject unit.");
    }
  };

  const handleApproveFeature = async (id) => {
    if (!window.confirm("Are you sure you want to approve this feature request?")) return;
    try {
      await approveFeature(id);
      alert("Feature request approved successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to approve feature request.");
    }
  };

  const handleRejectFeature = async (id) => {
    if (!window.confirm("Are you sure you want to reject this feature request?")) return;
    try {
      await rejectFeature(id);
      alert("Feature request rejected successfully.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject feature request.");
    }
  };

  const handleApprovePayment = async (id) => {
    if (!window.confirm("Are you sure you want to approve this payment request?")) return;
    try {
      await approvePaymentAPI(id);
      alert("Payment approved successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to approve payment.");
    }
  };

  const handleRejectPayment = async (id) => {
    const reason = window.prompt("Please specify a reason for rejecting this payment:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }
    try {
      await rejectPaymentAPI(id, reason);
      alert("Payment rejected successfully.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject payment.");
    }
  };

  if (loading && pendingUnits.length === 0 && featureRequests.length === 0 && pendingPayments.length === 0) {
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
            Pending Review
          </h2>
          <p className="text-sm text-gray-500">
            {pendingUnits.length} listings, {featureRequests.length} feature requests, and {pendingPayments.length} payments awaiting review
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border-0 cursor-pointer ${
            activeTab === "listings" ? "bg-blue-600 text-white" : "bg-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Listing Approvals ({pendingUnits.length})
        </button>
        <button
          onClick={() => setActiveTab("featured")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border-0 cursor-pointer ${
            activeTab === "featured" ? "bg-blue-600 text-white" : "bg-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Feature Requests ({featureRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border-0 cursor-pointer ${
            activeTab === "payments" ? "bg-blue-600 text-white" : "bg-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Payment Approvals ({pendingPayments.length})
        </button>
      </div>

      {activeTab === "listings" ? (
        pendingUnits.length === 0 ? (
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
              const imgUrl = p.images?.[0] 
                ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000/uploads/units/${p.images[0]}`)
                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
              const locationText = p.address ? `${p.address.city}, ${p.address.governorate}` : "N/A";
              const displayTitle = p.description || p.title || `${p.unitType} in ${p.address?.city || 'N/A'}`;

              return (
                <div 
                  key={id} 
                  onClick={() => handleViewDetails(p)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 cursor-pointer hover:border-gray-200 transition-all duration-200 hover:shadow-md"
                >
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
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetails(p); }}
                      className="text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg border-0 cursor-pointer font-semibold flex items-center gap-1 mt-2.5 w-fit transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View Unit Details
                    </button>
                  </div>
                  <div className="flex sm:flex-col gap-1.5 flex-shrink-0 mt-2 sm:mt-0">
                    <Btn 
                      variant="primary" 
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleApprove(id); }}
                      className="flex-1 sm:flex-initial"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Btn>
                    <Btn 
                      variant="danger" 
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleReject(id); }}
                      className="flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : activeTab === "featured" ? (
        featureRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No feature requests</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              There are no featured unit promotion requests currently awaiting review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {featureRequests.map((p) => {
              const id = p._id || p.id;
              const imgUrl = p.images?.[0] 
                ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000/uploads/units/${p.images[0]}`)
                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
              const locationText = p.address ? `${p.address.city}, ${p.address.governorate}` : "N/A";
              const displayTitle = p.description || p.title || `${p.unitType} in ${p.address?.city || 'N/A'}`;

              return (
                <div 
                  key={id} 
                  onClick={() => handleViewDetails(p)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4 cursor-pointer hover:border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <img src={imgUrl} alt={displayTitle} className="w-full sm:w-28 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{displayTitle}</h4>
                      <Badge variant="warning">
                        ⭐ Promotion Request
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
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewDetails(p); }}
                      className="text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg border-0 cursor-pointer font-semibold flex items-center gap-1 mt-2.5 w-fit transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View Unit Details
                    </button>
                  </div>
                  <div className="flex sm:flex-col gap-1.5 flex-shrink-0 mt-2 sm:mt-0">
                    <Btn 
                      variant="primary" 
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleApproveFeature(id); }}
                      className="flex-1 sm:flex-initial"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Feature
                    </Btn>
                    <Btn 
                      variant="danger" 
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleRejectFeature(id); }}
                      className="flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-4 h-4" /> Reject Feature
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        pendingPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No pending payments</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              There are no payment confirmation requests currently awaiting review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map((p) => {
              const id = p._id || p.id;
              const proofUrl = p.proofImage ? `${BACKEND_URL}/uploads/payments/${p.proofImage}` : null;
              const isPackage = p.paymentType === "contact_package";

              return (
                <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                  {proofUrl ? (
                    <a href={proofUrl} target="_blank" rel="noreferrer" className="relative group block flex-shrink-0">
                      <img src={proofUrl} alt="Receipt proof" className="w-full sm:w-28 h-20 rounded-xl object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold rounded-xl gap-1">
                        <ExternalLink className="w-3 h-3" /> View Proof
                      </div>
                    </a>
                  ) : (
                    <div className="w-full sm:w-28 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                      No receipt
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {isPackage ? "📦 Contact Unlock Package (10 Contacts)" : `🏠 Unit Listing Payment (${p.unitId?.unitType || "Unit"})`}
                      </h4>
                      <Badge variant="warning">
                        Pending Payment
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Owner: <span className="font-semibold text-gray-700">{p.ownerId?.fullName || "Unknown Owner"}</span> ({p.ownerId?.email || ""})</p>
                      <p>Method: <span className="font-semibold text-gray-700">{p.method}</span> &middot; ID: <span className="font-semibold text-gray-700">{p.transactionId || "N/A"}</span></p>
                      <p className="font-semibold text-blue-600">Amount: EGP {p.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-1.5 flex-shrink-0 mt-2 sm:mt-0">
                    <Btn 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleApprovePayment(id)}
                      className="flex-1 sm:flex-initial"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Payment
                    </Btn>
                    <Btn 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRejectPayment(id)}
                      className="flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
