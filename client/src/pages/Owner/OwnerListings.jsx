import React, { useState, useEffect } from "react";
import { Plus, Edit2, MapPin, Eye, Building, EyeOff, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { getOwnerListings, toggleUnitActive, deleteOwnerUnit, requestFeature } from "../../api/ownerService";
import { BACKEND_URL } from "../../api/client";

export default function OwnerListings({ onNavigate }) {
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filter, setFilter] = useState("all");

  const handleRequestFeature = (id) => {
    if (window.confirm("يرجى العلم بأنه يجب الدفع لتأكيد تفعيل العقار المُميز (Featured) لمدة 30 يوماً. هل تود تقديم طلب التميز للأدمن الآن؟")) {
      requestFeature(id)
        .then(() => {
          alert("تم تقديم طلب العقار المميز بنجاح! يرجى الدفع للتاكيد وتفعيل التميز من لوحة الإدارة.");
          fetchListings(page, filter);
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.message || err.message;
          alert("فشل تقديم الطلب: " + errorMsg);
        });
    }
  };

  const fetchListings = (pageNumber = 1, activeFilter = "all") => {
    setLoading(true);
    const filterParam = activeFilter === "all" ? "" : activeFilter;
    getOwnerListings(pageNumber, filterParam)
      .then((data) => {
        setUserProperties(data?.units || []);
        setPagination(data?.pagination || { total: 0, page: 1, pages: 1 });
      })
      .catch((err) => {
        console.error("Error fetching listings from backend, falling back to localStorage:", err);
        try {
          const savedProperties = localStorage.getItem("owner_properties");
          setUserProperties(savedProperties ? JSON.parse(savedProperties) : []);
        } catch (e) {
          setUserProperties([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListings(page, filter);
  }, [page, filter]);

  const handleToggleActiveProperty = (id, currentActiveState) => {
    const nextState = currentActiveState === false ? true : false;
    const confirmMsg = nextState 
      ? "Are you sure you want to activate this property listing? It will appear in search results."
      : "Are you sure you want to deactivate this property listing? It will not appear in search results.";

    if (window.confirm(confirmMsg)) {
      toggleUnitActive(id, nextState)
        .then(() => {
          fetchListings(page, filter);
        })
        .catch((err) => {
          console.error("Error toggling active status on server:", err);
          // Fallback to local storage
          try {
            const savedProperties = localStorage.getItem("owner_properties");
            if (savedProperties) {
              const parsed = JSON.parse(savedProperties);
              const updated = parsed.map(p => {
                if (p.id === id || p._id === id) {
                  return { ...p, isActive: nextState, available: nextState };
                }
                return p;
              });
              localStorage.setItem("owner_properties", JSON.stringify(updated));
              setUserProperties(updated);
            }
          } catch (e) {
            console.error("Failed to toggle locally:", e);
          }
        });
    }
  };

  // معالجة عملية حذف الشقة بالكامل
  const handleDeleteProperty = (id, e) => {
    e.stopPropagation(); // منع انتقال الحدث إلى الكارت نفسه

    if (window.confirm("⚠️ Warning! Are you sure you want to permanently delete this property listing? This action cannot be undone.")) {
      deleteOwnerUnit(id)
        .then(() => {
          alert("Property deleted successfully!");
          fetchListings(page, filter); // تحديث القائمة من السيرفر بعد الحذف
        })
        .catch((err) => {
          console.error("Error deleting property from server, trying local storage:", err);
          
          // Fallback to local storage
          try {
            const savedProperties = localStorage.getItem("owner_properties");
            if (savedProperties) {
              const parsed = JSON.parse(savedProperties);
              const updated = parsed.filter(p => (p.id !== id && p._id !== id));
              localStorage.setItem("owner_properties", JSON.stringify(updated));
              setUserProperties(updated);
              alert("Property deleted locally successfully!");
            }
          } catch (e) {
            console.error("Failed to delete locally:", e);
          }
        });
    }
  };

  if (loading && userProperties.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Units
          </h2>
          <p className="text-sm text-gray-500">
            {pagination.total || userProperties.length} units total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter:</span>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm"
            >
              <option value="all">All Units</option>
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive (Suspended)</option>
              <option value="accepted">Accepted (Published)</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending Approval</option>
              <option value="featured_on">Featured (Promoted)</option>
              <option value="featured_off">Not Featured</option>
            </select>
          </div>

          <Btn variant="primary" onClick={() => onNavigate("unit-form")}>
            <Plus className="w-4 h-4" /> Add New Unit
          </Btn>
        </div>
      </div>

      {userProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Building className="w-8 h-8" />
          </div>
          {filter !== "all" ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No matching units found</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                Try changing your filter settings or resetting it to view all your property listings.
              </p>
              <Btn variant="default" size="sm" onClick={() => { setFilter("all"); setPage(1); }}>
                Clear Filter
              </Btn>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No units yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                You haven't added any units to Maeesha yet. Click the button below to add your first unit.
              </p>
              <Btn variant="primary" size="sm" onClick={() => onNavigate("unit-form")}>
                <Plus className="w-4 h-4" /> Add First Unit
              </Btn>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProperties.map((p) => {
            const id = p._id || p.id;
            const imgUrl = p.images?.[0] 
              ? (p.images[0].startsWith('http') ? p.images[0] : `${BACKEND_URL}/uploads/units/${p.images[0]}`)
              : (p.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80");
            let badgeText = "Published";
            let badgeVariant = "success";

            if (p.status === "pending" || p.status === "pending_approval") {
              badgeText = "Pending Approval";
              badgeVariant = "warning";
            } else if (p.status === "rejected") {
              badgeText = "Rejected";
              badgeVariant = "danger";
            } else if (p.status === "rented") {
              badgeText = "Rented";
              badgeVariant = "default";
            } else if (p.status === "sold") {
              badgeText = "Sold";
              badgeVariant = "default";
            }

            const locationText = p.address ? `${p.address.city}, ${p.address.governorate}` : (p.location || "Cairo, Egypt");
            const displayTitle = p.description || p.title || `${p.unitType} in ${p.address?.city || 'N/A'}`;

            return (
              <div
                key={id}
                onClick={() => onNavigate("unit-detail", p)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative flex flex-col cursor-pointer"
              >
                {p.isActive === false && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
                    <span className="bg-gray-950 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider">
                      Inactive / Suspended
                    </span>
                  </div>
                )}
                <div className="relative h-44 bg-gray-100 flex-shrink-0">
                  <img src={imgUrl} alt={displayTitle} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
                    <Badge variant={badgeVariant}>
                      {badgeText}
                    </Badge>
                    {p.isFeatured && p.featuredUntil && new Date(p.featuredUntil) > new Date() ? (
                      <Badge variant="warning">
                        ⭐ Featured ({Math.ceil((new Date(p.featuredUntil) - new Date()) / (1000 * 60 * 60 * 24))}d left)
                      </Badge>
                    ) : p.featureRequestStatus === "pending" ? (
                      <Badge variant="primary">
                        ⏳ Pending Featured
                      </Badge>
                    ) : null}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onNavigate("unit-form", p); }}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border-0 cursor-pointer"
                      title="Edit listing"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleActiveProperty(id, p.isActive); }}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition-colors border-0 cursor-pointer flex items-center justify-center"
                      title={p.isActive !== false ? "Deactivate listing" : "Activate listing"}
                    >
                      {p.isActive !== false ? (
                        <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                    {/* زر الحذف الجديد 🗑️ */}
                    <button 
                      onClick={(e) => handleDeleteProperty(id, e)}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors border-0 cursor-pointer flex items-center justify-center"
                      title="Delete Listing permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">{displayTitle}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 animate-pulse" /> {locationText}
                    </p>
                    {p.status === "available" && p.isActive !== false && !p.isFeatured && p.featureRequestStatus !== "pending" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRequestFeature(id); }}
                        className="mb-3 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-2.5 py-1 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Request Featured
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 font-bold text-sm">
                      EGP {Number(p.price || 0).toLocaleString()}/mo
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {p.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pb-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  page === pNum
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {pNum}
              </button>
            ))}
          </div>

          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            className="px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}