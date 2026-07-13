import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Eye, Building } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";

export default function OwnerListings({ onNavigate }) {
  // 1. تصفير الداتا في البداية وجعلها تقرأ من التخزين الفعلي للعقارات المضافة
  const [userProperties, setUserProperties] = useState(() => {
    try {
      const savedProperties = localStorage.getItem("owner_properties");
      return savedProperties ? JSON.parse(savedProperties) : []; // تبدأ بـ [] فاضية تماماً للكاستمر الجديد
    } catch (e) {
      return [];
    }
  });

  // تحديث الداتا أوتوماتيك لو دخل الصفحة أو أضاف عقار جديد
  useEffect(() => {
    try {
      const savedProperties = localStorage.getItem("owner_properties");
      if (savedProperties) {
        setUserProperties(JSON.parse(savedProperties));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // دالة لحذف العقار بشكل متدرج وديناميكي مع الاستخدام
  const handleDeleteProperty = (id) => {
    const updated = userProperties.filter(p => p.id !== id);
    setUserProperties(updated);
    localStorage.setItem("owner_properties", JSON.stringify(updated));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Listings
          </h2>
          {/* العداد الذكي بيزيد ويقل ديناميكياً مع الاستخدام الحقيقي */}
          <p className="text-sm text-gray-500">
            {userProperties.length} {userProperties.length === 1 ? "active property listing" : "active property listings"}
          </p>
        </div>
        <Btn variant="primary" onClick={() => onNavigate("unit-form")}>
          <Plus className="w-4 h-4" /> Add New Listing
        </Btn>
      </div>

      {/* 2. حالة التصفير: لو العميل جديد ومفيش داتا بيعرض واجهة احترافية تشجعه يضيف أول عقار */}
      {userProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No property listings yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            You haven't added any properties to LivingHub yet. Click the button below to add your first unit.
          </p>
          <Btn variant="primary" size="sm" onClick={() => onNavigate("unit-form")}>
            <Plus className="w-4 h-4" /> Add First Listing
          </Btn>
        </div>
      ) : (
        /* 3. حالة وجود داتا: بتعرض العقارات الحقيقية المضافة فقط وتزيد تدريجياً */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProperties.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 bg-gray-100">
                <img src={p.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge variant={p.available !== false ? "success" : "danger"}>
                    {p.available !== false ? "Available" : "Rented"}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border-0 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProperty(p.id)}
                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors border-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">{p.title}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {p.location || "Cairo, Egypt"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-sm">
                    EGP {Number(p.price || 0).toLocaleString()}/mo
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {p.views || 0} views
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}