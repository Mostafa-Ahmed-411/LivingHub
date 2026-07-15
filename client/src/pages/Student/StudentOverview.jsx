import React, { useState, useEffect } from "react";
import {
  Building2,
  Heart,
  MessageSquare,
  DollarSign,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  FileText,
  ChevronRight,
  Wrench,
  Star,
  X,
  FileCheck
} from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Btn from "../../components/common/Btn";
import PropertyCard from "../../components/common/PropertyCard";

export default function StudentOverview({ onNavigate, onTab }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // حالات التحكم في النوافذ المنبثقة (Modals)
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // حقول بلاغ الصيانة
  const [maintenanceCategory, setMaintenanceCategory] = useState("Plumbing");
  const [maintenanceTitle, setMaintenanceTitle] = useState("");
  const [maintenanceDesc, setMaintenanceDesc] = useState("");

  // حقول التقييم
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    // جلب البيانات من المسار المعتمد في السيرفر
    fetch("/api/user/dashboard/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student dashboard data:", err);
        setLoading(false);
      });
  }, []);

  // دالة تقديم بلاغ الصيانة
  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Maintenance Request:", {
      category: maintenanceCategory,
      title: maintenanceTitle,
      description: maintenanceDesc
    });
    // هنا سيتم الربط لاحقاً بـ POST /api/maintenance
    setIsMaintenanceOpen(false);
    setMaintenanceTitle("");
    setMaintenanceDesc("");
  };

  // دالة تقديم التقييم
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Review:", { rating, comment: reviewComment });
    // هنا سيتم الربط لاحقاً بـ POST /api/reviews
    setIsReviewOpen(false);
    setReviewComment("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 animate-pulse font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  const profile = studentData?.profile || { name: "Student" };
  const stats = studentData?.stats || { activeRentals: 0, savedUnits: 0, unreadMessages: 0, monthlyRent: 0 };
  const currentRental = studentData?.currentRental || null;
  const upcomingEvents = studentData?.upcomingEvents || [];
  const savedProperties = studentData?.savedProperties || [];

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Good morning, {profile.name}! 👋
            </h2>
            <p className="text-blue-200 text-sm">
              {stats.unreadMessages > 0 
                ? `You have ${stats.unreadMessages} new messages.` 
                : "No new unread messages."}
            </p>
          </div>
          <div className="hidden sm:block bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-2xl font-extrabold">
              {new Date().toLocaleString("en-US", { month: "short" })}
            </p>
            <p className="text-blue-200 text-xs font-semibold">Dashboard Active</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Active Rentals" value={stats.activeRentals.toString()} color="blue" />
        <StatCard icon={Heart} label="Saved Units" value={stats.savedUnits.toString()} color="purple" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={stats.unreadMessages.toString()} color="amber" />
        <StatCard icon={DollarSign} label="Monthly Rent" value={`EGP ${stats.monthlyRent.toLocaleString()}`} color="green" />
      </div>

      {/* Rental & Schedule Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Current Rental</h3>
            <Badge variant={currentRental ? "success" : "secondary"}>
              {currentRental ? "Active" : "No Active Lease"}
            </Badge>
          </div>
          <div className="p-5">
            {currentRental ? (
              <>
                <div className="flex gap-4">
                  <img
                    src={currentRental.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=140&fit=crop&auto=format"}
                    alt="Current unit"
                    className="w-32 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{currentRental.title}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {currentRental.address}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { l: "Monthly Rent", v: `EGP ${currentRental.rent}` },
                        { l: "Lease Ends", v: currentRental.leaseEnds },
                        { l: "Landlord", v: currentRental.landlordName }
                      ].map((item) => (
                        <div key={item.l} className="bg-gray-50 rounded-xl p-2 text-center">
                          <p className="text-xs text-gray-500">{item.l}</p>
                          <p className="text-sm font-semibold text-gray-900">{item.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* صف أزرار التحكم الفعّال للطالب */}
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-50">
                  <Btn variant="primary" size="sm" onClick={() => onTab("messages")}>
                    <MessageSquare className="w-4 h-4" /> Message
                  </Btn>
                  <Btn variant="outline" size="sm" onClick={() => onTab("payments")}>
                    <CreditCard className="w-4 h-4" /> Pay Rent
                  </Btn>
                  <Btn variant="outline" size="sm" onClick={() => setIsContractOpen(true)} className="border-blue-200 hover:bg-blue-50 text-blue-600">
                    <FileText className="w-4 h-4" /> View Lease
                  </Btn>
                  <Btn variant="outline" size="sm" onClick={() => setIsMaintenanceOpen(true)} className="border-amber-200 hover:bg-amber-50 text-amber-600">
                    <Wrench className="w-4 h-4" /> Report Issue
                  </Btn>
                  <Btn variant="outline" size="sm" onClick={() => setIsReviewOpen(true)} className="border-purple-200 hover:bg-purple-50 text-purple-600">
                    <Star className="w-4 h-4" /> Review Stay
                  </Btn>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-3">You don't have any active rental units at the moment.</p>
                <Btn variant="outline" size="sm" onClick={() => onNavigate("search")}>
                  Browse Properties
                </Btn>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-4 space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((ev, i) => {
                const IconComponent = ev.type === "payment" ? CreditCard : ev.type === "viewing" ? Eye : FileText;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 p-3 rounded-xl ${
                      ev.urgent ? "bg-red-50 border border-red-100" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        ev.urgent ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${ev.urgent ? "text-red-600" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${ev.urgent ? "text-red-700" : "text-gray-900"}`}>
                        {ev.title}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {ev.date}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-xs text-center py-4">No upcoming events scheduled.</p>
            )}
          </div>
        </div>
      </div>

      {/* Saved Units Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Saved Units</h3>
          <Btn variant="ghost" size="sm" onClick={() => onTab("my-units")}>
            View All <ChevronRight className="w-4 h-4" />
          </Btn>
        </div>
        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm bg-gray-50 rounded-xl p-6 text-center">
            Your saved units list is empty.
          </p>
        )}
      </div>

      {/* ==================== 1. Lease Agreement Modal ==================== */}
      {isContractOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-blue-600">
                <FileCheck className="w-5 h-5" />
                <h3 className="font-bold text-gray-900 text-lg">Lease Agreement Documents</h3>
              </div>
              <button onClick={() => setIsContractOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 leading-relaxed">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-xs flex gap-2">
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span>This digital agreement is officially signed by both parties and verified under Egyptian Housing Law regulations.</span>
              </div>
              <h4 className="font-bold text-gray-900">TERMS OF AGREEMENT (SUMMARY):</h4>
              <p><strong>1. Parties:</strong> Landlord ({currentRental?.landlordName || "N/A"}) & Tenant ({profile.name}).</p>
              <p><strong>2. Rental Unit:</strong> Apartment unit located at {currentRental?.address || "N/A"}.</p>
              <p><strong>3. Payment Conditions:</strong> Monthly rental rate is fixed at <strong>EGP {currentRental?.rent}</strong>, payable in advance on the 1st day of each calendar month.</p>
              <p><strong>4. Security Deposit:</strong> A deposit equivalent to one month's rent is held by the landlord and returned upon lease expiration without damage.</p>
              <p><strong>5. Maintenance:</strong> Minor cosmetic updates are tenant responsibility. Major plumbing, structural, and electrical faults are covered fully by the landlord.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50 rounded-b-2xl">
              <Btn variant="outline" size="sm" onClick={() => setIsContractOpen(false)}>Close</Btn>
              <Btn variant="primary" size="sm" onClick={() => window.print()}>
                <FileText className="w-4 h-4" /> Print Contract
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. Maintenance Report Modal ==================== */}
      {isMaintenanceOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-amber-600">
                <Wrench className="w-5 h-5" />
                <h3 className="font-bold text-gray-900 text-lg">Report Maintenance Issue</h3>
              </div>
              <button onClick={() => setIsMaintenanceOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMaintenanceSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">ISSUE CATEGORY</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-amber-400 transition-colors"
                  value={maintenanceCategory}
                  onChange={(e) => setMaintenanceCategory(e.target.value)}
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
                  placeholder="Briefly describe what is broken" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-amber-400 transition-colors"
                  value={maintenanceTitle}
                  onChange={(e) => setMaintenanceTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">DETAILED DESCRIPTION</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Explain details, timeline, or instructions for the maintenance team" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-amber-400 transition-colors resize-none"
                  value={maintenanceDesc}
                  onChange={(e) => setMaintenanceDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Btn variant="outline" size="sm" type="button" onClick={() => setIsMaintenanceOpen(false)}>Cancel</Btn>
                <Btn variant="primary" size="sm" type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Submit Ticket
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 3. Rating & Review Modal ==================== */}
      {isReviewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-purple-600">
                <Star className="w-5 h-5 fill-purple-600" />
                <h3 className="font-bold text-gray-900 text-lg">Review Your Stay</h3>
              </div>
              <button onClick={() => setIsReviewOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-6 text-center space-y-4">
              <p className="text-sm text-gray-500">How was your stay in this property and your experience with the landlord?</p>
              
              {/* Interactive Star Rating */}
              <div className="flex justify-center items-center gap-1.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-left">
                <label className="text-xs font-semibold text-gray-500 block mb-1">YOUR REVIEW (OPTIONAL)</label>
                <textarea 
                  rows={3}
                  placeholder="Share details of your experience (e.g. location, landlord behavior, wifi speed...)" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-purple-400 transition-colors resize-none"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Btn variant="outline" size="sm" type="button" onClick={() => setIsReviewOpen(false)}>Cancel</Btn>
                <Btn variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Submit Review
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}