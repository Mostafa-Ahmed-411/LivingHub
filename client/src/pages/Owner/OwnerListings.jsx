import React, { useState, useEffect } from "react";
import { Plus, Edit2, MapPin, Eye, Building, EyeOff, Trash2 } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { getOwnerListings, toggleUnitActive, deleteOwnerUnit } from "../../api/ownerService";

export default function OwnerListings({ onNavigate }) {
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    setLoading(true);
    getOwnerListings()
      .then((data) => {
        setUserProperties(data || []);
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
    fetchListings();
  }, []);

  const handleToggleActiveProperty = (id, currentActiveState) => {
    const nextState = currentActiveState === false ? true : false;
    const confirmMsg = nextState 
      ? "Are you sure you want to activate this property listing? It will appear in search results."
      : "Are you sure you want to deactivate this property listing? It will not appear in search results.";

    if (window.confirm(confirmMsg)) {
      toggleUnitActive(id, nextState)
        .then(() => {
          fetchListings();
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
          fetchListings(); // تحديث القائمة من السيرفر بعد الحذف
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Units
          </h2>
          <p className="text-sm text-gray-500">
            {userProperties.length} {userProperties.length === 1 ? "active unit" : "active units"}
          </p>
        </div>
        <Btn variant="primary" onClick={() => onNavigate("unit-form")}>
          <Plus className="w-4 h-4" /> Add New Unit
        </Btn>
      </div>

      {userProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No units yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            You haven't added any units to LivingHub yet. Click the button below to add your first unit.
          </p>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("unit-form")}>
            <Plus className="w-4 h-4" /> Add First Unit
          </Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProperties.map((p) => {
            const id = p._id || p.id;
            const imgUrl = p.images?.[0] || p.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow relative flex flex-col"
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
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5 z-20">
                    <button 
                      onClick={() => onNavigate("unit-form", p)}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border-0 cursor-pointer"
                      title="Edit listing"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleToggleActiveProperty(id, p.isActive)}
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
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 animate-pulse" /> {locationText}
                    </p>
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
    </div>
  );
}