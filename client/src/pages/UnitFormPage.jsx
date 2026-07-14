import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin,
  BookOpen,
  DollarSign,
  Wallet,
  Calendar,
  Camera,
  AlertCircle,
  CheckCircle,
  Building2,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import { cities } from "../data/mockData";
import { createUnit, updateUnit } from "../api/ownerService";

export default function UnitFormPage({ onNavigate, embedded = false }) {
  const location = useLocation();
  const editingUnit = location.state || null;

  const [step, setStep] = useState(1);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  // الخطوة 1: البيانات الأساسية
  const [title, setTitle] = useState(editingUnit?.title || "");
  const [type, setType] = useState(
    editingUnit?.unitType
      ? (editingUnit.unitType.charAt(0).toUpperCase() + editingUnit.unitType.slice(1))
      : "Studio"
  );
  const [listingFor, setListingFor] = useState(
    editingUnit?.listingType === 'sale' ? 'Sale' : 'Rent'
  );
  const [description, setDescription] = useState(editingUnit?.description || "");

  // الخطوة 2: الموقع الجغرافي
  const [governorate, setGovernorate] = useState(editingUnit?.address?.governorate || "Cairo");
  const [district, setDistrict] = useState(editingUnit?.address?.city || "");
  const [address, setAddress] = useState(editingUnit?.address?.street || "");
  const [university, setUniversity] = useState(editingUnit?.address?.nearestUniversity || "");

  // الخطوة 3: تفاصيل الغرف والأسرة
  const [beds, setBeds] = useState(editingUnit?.roomsPerApartment || editingUnit?.bedsPerRoom || 1);
  const [roomBeds, setRoomBeds] = useState(editingUnit?.bedsPerRoom || 2);
  const [aptPeople, setAptPeople] = useState(editingUnit?.specifications?.aptPeople || 4);
  const [baths, setBaths] = useState(editingUnit?.specifications?.baths || 1);
  const [area, setArea] = useState(editingUnit?.specifications?.area || 45);
  const [floor, setFloor] = useState(editingUnit?.floorNumber || 3);
  const [gasType, setGasType] = useState(editingUnit?.specifications?.gasType || "Natural Gas");
  const [includesWater, setIncludesWater] = useState(
    editingUnit?.specifications?.includesWater !== false
  );
  const [includesGas, setIncludesGas] = useState(
    !!editingUnit?.specifications?.includesGas
  );
  const [includesElectricity, setIncludesElectricity] = useState(
    !!editingUnit?.specifications?.includesElectricity
  );

  // Amenities states (default checked)
  const [fridge, setFridge] = useState(
    editingUnit?.specifications?.amenities?.shared?.fridge !== false
  );
  const [washingMachine, setWashingMachine] = useState(
    editingUnit?.specifications?.amenities?.shared?.washingMachine !== false
  );
  const [sharedBathroom, setSharedBathroom] = useState(
    editingUnit?.specifications?.amenities?.shared?.sharedBathroom !== false
  );
  const [sharedKitchen, setSharedKitchen] = useState(
    editingUnit?.specifications?.amenities?.shared?.sharedKitchen !== false
  );
  const [heater, setHeater] = useState(
    editingUnit?.specifications?.amenities?.shared?.heater !== false
  );

  const [windowOpt, setWindowOpt] = useState(
    editingUnit?.specifications?.amenities?.room?.window !== false
  );
  const [ac, setAc] = useState(
    editingUnit?.specifications?.amenities?.room?.ac !== false
  );
  const [tvScreen, setTvScreen] = useState(
    editingUnit?.specifications?.amenities?.room?.tvScreen !== false
  );
  const [wardrobe, setWardrobe] = useState(
    editingUnit?.specifications?.amenities?.room?.wardrobe !== false
  );

  const [wifi, setWifi] = useState(
    editingUnit?.specifications?.amenities?.building?.wifi !== false
  );
  const [cleaner, setCleaner] = useState(
    editingUnit?.specifications?.amenities?.building?.cleaner !== false
  );
  const [security, setSecurity] = useState(
    editingUnit?.specifications?.amenities?.building?.security !== false
  );
  const [securityCameras, setSecurityCameras] = useState(
    editingUnit?.specifications?.amenities?.building?.securityCameras !== false
  );

  // الخطوة 4: السعر وفترة الإيجار
  const [price, setPrice] = useState(editingUnit?.price || "");
  const [deposit, setDeposit] = useState(editingUnit?.specifications?.deposit || "");
  const [availFrom, setAvailFrom] = useState(
    editingUnit?.availableFrom ? new Date(editingUnit.availableFrom).toISOString().split('T')[0] : ""
  );
  const [availTo, setAvailTo] = useState(
    editingUnit?.availableTo ? new Date(editingUnit.availableTo).toISOString().split('T')[0] : ""
  );

  // الخطوة 5: ألبوم الصور والمعاينة
  const [coverImage1, setCoverImage1] = useState(editingUnit?.images?.[0] || "");
  const [coverImage2, setCoverImage2] = useState(editingUnit?.images?.[1] || "");
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (index === 1) setImageFile1(file);
      if (index === 2) setImageFile2(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index === 1) setCoverImage1(reader.result);
        if (index === 2) setCoverImage2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!title.trim()) {
          alert("Please enter a title for the listing.");
          return false;
        }
        if (!description.trim()) {
          alert("Please enter a detailed description.");
          return false;
        }
        return true;
      case 2:
        if (!district.trim()) {
          alert("Please enter the city or district.");
          return false;
        }
        if (!address.trim()) {
          alert("Please enter the full address details.");
          return false;
        }
        return true;
      case 3:
        if (type === "Apartment" && (!area || Number(area) <= 0)) {
          alert("Please enter a valid total area (m²).");
          return false;
        }
        return true;
      case 4:
        if (!price || Number(price) <= 0) {
          alert("Please enter a valid monthly rent price.");
          return false;
        }
        if (!availFrom) {
          alert("Please select the date from which the property is available.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 5));
    }
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title || !price || !district) {
      alert("يرجى ملء الحقول الإلزامية الأساسية قبل إتمام حفظ العقار.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("unitType", type.toLowerCase());
    formData.append("listingType", listingFor.toLowerCase());
    formData.append("description", description);
    formData.append("price", price);
    formData.append("floorNumber", floor);

    const addressObj = {
      governorate,
      city: district,
      street: address,
      nearestUniversity: university
    };
    formData.append("address", JSON.stringify(addressObj));

    const specificationsObj = {
      deposit,
      baths,
      area,
      aptPeople,
      gasType,
      includesWater,
      includesGas,
      includesElectricity,
      amenities: {
        shared: {
          fridge,
          washingMachine,
          sharedBathroom,
          sharedKitchen,
          heater
        },
        room: {
          window: windowOpt,
          ac,
          tvScreen,
          wardrobe
        },
        building: {
          wifi,
          cleaner,
          security,
          securityCameras
        }
      }
    };
    formData.append("specifications", JSON.stringify(specificationsObj));

    if (type === "Apartment") {
      formData.append("roomsPerApartment", beds);
    } else if (type === "Room") {
      formData.append("bedsPerRoom", beds);
    } else if (type === "Bed" || type === "Studio") {
      formData.append("bedsPerRoom", roomBeds);
    }

    if (availFrom) formData.append("availableFrom", availFrom);
    if (availTo) formData.append("availableTo", availTo);

    if (imageFile1) {
      formData.append("images", imageFile1);
    }
    if (imageFile2) {
      formData.append("images", imageFile2);
    }

    try {
      if (editingUnit) {
        await updateUnit(editingUnit._id || editingUnit.id, formData);
        alert("Unit updated successfully!");
      } else {
        await createUnit(formData);
        alert("Unit added successfully!");
      }
      window.dispatchEvent(new Event("storage"));
      if (typeof onNavigate === "function") onNavigate("/owner/my-units");
    } catch (err) {
      console.error("Error saving unit data to server:", err);
      alert("Failed to submit unit to server. Saving locally instead.");

      try {
        const newProperty = {
          id: Date.now(),
          title,
          unitType: type,
          type,
          listingFor,
          description,
          governorate,
          district,
          location: `${district}, ${governorate}`,
          address,
          university,
          bedsCount: type === "Apartment" ? beds : type === "Bed" || type === "Studio" ? roomBeds : beds,
          roomsCount: type === "Apartment" ? beds : 1,
          bathroomsCount: baths,
          status: "Active",
          price: Number(price),
          rentPrice: price,
          depositPrice: deposit,
          deposit: Number(deposit),
          available: true,
          views: 0,
          image: coverImage1 || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
          image2: coverImage2 || ""
        };
        const existingProperties = JSON.parse(localStorage.getItem("owner_properties") || "[]");
        localStorage.setItem("owner_properties", JSON.stringify([newProperty, ...existingProperties]));
        window.dispatchEvent(new Event("storage"));
        if (typeof onNavigate === "function") onNavigate("/owner/my-units");
      } catch (localErr) {
        console.error("Local fallback save failed:", localErr);
      }
    }
  };

  const CounterInput = ({ label, value, onChange, min = 0 }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200/70">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 shadow-sm select-none">-</button>
        <span className="w-5 text-center font-extrabold text-xs text-gray-900">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 shadow-sm select-none">+</button>
      </div>
    </div>
  );

  return (
    <div className={embedded ? "" : "max-w-3xl mx-auto px-4"}>
      {!embedded && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {editingUnit ? "Edit Listing" : "Add New Listing"}
            </h2>
            <p className="text-sm text-gray-500">مرحلة {step} من 5 لتجهيز ونشر العقار</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl">{((step / 5) * 100).toFixed(0)}% مكتمل</span>
        </div>
      )}

      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fadeIn">
            <div className="pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-gray-950 text-sm">1. تفاصيل العقار الأساسية</h3>
            </div>
            <Inp label="عنوان الإعلان / الوحدة" placeholder="مثال: غرفة مكيفة هادئة بجوار جامعة أسيوط" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">تصنيف ونوع السكن</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold h-[38px]">
                  <option value="Studio">Studio</option>
                  <option value="Room">Private Room</option>
                  <option value="Apartment">Entire Apartment</option>
                  <option value="Bed">Bed Space (Shared Room)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">حالة السكن</label>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5 h-[38px] items-center">
                  {["Rent", "Sale"].map((o) => (
                    <button key={o} type="button" onClick={() => setListingFor(o)} className={`flex-1 h-full rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${listingFor === o ? "bg-white shadow-sm text-blue-600" : "text-gray-500 bg-transparent"}`}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">وصف تفصيلي للعقار</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="اكتب تفاصيل إضافية عن العقار، الخدمات القريبة، شروط الإيجار والطلاب المحبذين..." className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-semibold" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fadeIn">
            <div className="pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
              <MapPin className="w-4 h-4" />
              <h3 className="font-bold text-gray-950 text-sm">2. تحديد الموقع والمدينة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">المحافظة</label>
                <select value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold h-[38px]">
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Inp label="المدينة / المنطقة" placeholder="مثال: حي الجامعة" value={district} onChange={(e) => setDistrict(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp label="تفاصيل العنوان بالكامل" placeholder="رقم العمارة، الطابق، اسم الشارع" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <Inp label="بالقرب من جامعة" placeholder="مثال: جامعة أسيوط" icon={BookOpen} value={university} onChange={(e) => setUniversity(e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fadeIn">
            <div className="pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
              <Building2 className="w-4 h-4" />
              <h3 className="font-bold text-gray-950 text-sm">3. تفاصيل السعة والخدمات الداخلية</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(type === "Bed" || type === "Studio") && <CounterInput label="عدد الأسرة بالكامل" value={roomBeds} onChange={setRoomBeds} min={1} />}
              {type === "Room" && <CounterInput label="عدد الأسرة المتاحة بالغرفة" value={beds} onChange={setBeds} min={1} />}
              {type === "Apartment" && (
                <>
                  <CounterInput label="إجمالي غرف النوم" value={beds} onChange={setBeds} min={1} />
                  <Inp label="المساحة الإجمالية (m²)" type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
                </>
              )}
              <CounterInput label="عدد الحمامات" value={baths} onChange={setBaths} min={1} />
              <CounterInput label="رقم الطابق / الدور" value={floor} onChange={setFloor} min={0} />
              <CounterInput label="سعة تسيير الشقة (أفراد)" value={aptPeople} onChange={setAptPeople} min={1} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">نوع الغاز</label>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5 h-[38px] items-center">
                  {["Natural Gas", "Cylinder"].map((o) => (
                    <button key={o} type="button" onClick={() => setGasType(o)} className={`flex-1 h-full rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${gasType === o ? "bg-white shadow-sm text-blue-600" : "text-gray-500 bg-transparent"}`}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">الإيجار يشمل فواتير</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={includesWater} onChange={(e) => setIncludesWater(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" /><span className="text-xs font-bold text-gray-700">المياه</span></label>
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={includesGas} onChange={(e) => setIncludesGas(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" /><span className="text-xs font-bold text-gray-700">الغاز</span></label>
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={includesElectricity} onChange={(e) => setIncludesElectricity(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" /><span className="text-xs font-bold text-gray-700">الكهرباء</span></label>
                </div>
              </div>
            </div>

            {/* Amenities & Services */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Amenities & Services</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-200/50">
                {/* Shared Amenities */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-100">Shared Amenities</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={fridge} onChange={(e) => setFridge(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Fridge</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={washingMachine} onChange={(e) => setWashingMachine(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Washing Machine</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={sharedBathroom} onChange={(e) => setSharedBathroom(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Shared Bathroom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={sharedKitchen} onChange={(e) => setSharedKitchen(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Shared Kitchen</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={heater} onChange={(e) => setHeater(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Heater</span>
                  </label>
                </div>

                {/* Room Amenities */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-100">Room Amenities</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={windowOpt} onChange={(e) => setWindowOpt(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Window</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">AC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={tvScreen} onChange={(e) => setTvScreen(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">TV Screen</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={wardrobe} onChange={(e) => setWardrobe(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Wardrobe</span>
                  </label>
                </div>

                {/* Building Services */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-100">Building Services</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={wifi} onChange={(e) => setWifi(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">WiFi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={cleaner} onChange={(e) => setCleaner(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Cleaner</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={security} onChange={(e) => setSecurity(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Security</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={securityCameras} onChange={(e) => setSecurityCameras(e.target.checked)} className="w-3.5 h-3.5 rounded text-blue-600 accent-blue-600" />
                    <span className="text-xs font-bold text-gray-600">Security Cameras</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fadeIn">
            <div className="pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
              <DollarSign className="w-4 h-4" />
              <h3 className="font-bold text-gray-950 text-sm">4. التفاصيل المالية ومواعيد الإتاحة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp label="الإيجار الشهري المطلوب (EGP)" placeholder="2800" type="number" icon={DollarSign} value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Inp label="مبلغ التأمين الشهري (EGP)" placeholder="5600" type="number" icon={Wallet} value={deposit} onChange={(e) => setDeposit(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp label="متاح للسكن من تاريخ" type="date" icon={Calendar} value={availFrom} onChange={(e) => setAvailFrom(e.target.value)} required />
              <Inp label="متاح للسكن حتى تاريخ" type="date" icon={Calendar} value={availTo} onChange={(e) => setAvailTo(e.target.value)} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fadeIn">
            <div className="pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
              <Camera className="w-4 h-4" />
              <h3 className="font-bold text-gray-950 text-sm">5. ألبوم صور العقار والمعاينة النهائية</h3>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">رفع الصور الأساسية ومعالم السكن</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="file" ref={fileInputRef1} accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 1)} />
                <div onClick={() => fileInputRef1.current.click()} className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer overflow-hidden relative">
                  {coverImage1 ? <img src={coverImage1} alt="Cover 1" className="w-full h-full object-cover" /> : <><Camera className="w-4 h-4 text-gray-400" /><span className="text-[10px] text-gray-500 font-bold">الصورة الأولى</span></>}
                </div>

                <input type="file" ref={fileInputRef2} accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 2)} />
                <div onClick={() => fileInputRef2.current.click()} className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer overflow-hidden relative">
                  {coverImage2 ? <img src={coverImage2} alt="Cover 2" className="w-full h-full object-cover" /> : <><Camera className="w-4 h-4 text-gray-400" /><span className="text-[10px] text-gray-500 font-bold">الصورة الثانية</span></>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-3">
            <Btn variant="default" onClick={prevStep} disabled={step === 1} className="flex-1 justify-center"><ChevronLeft className="w-4 h-4" /> السابق</Btn>
            {step < 5 ? (
              <Btn variant="primary" onClick={nextStep} className="flex-1 justify-center">التالي <ChevronRight className="w-4 h-4" /></Btn>
            ) : (
              <Btn variant="primary" size="lg" className="flex-1 justify-center" type="button" onClick={handleSubmit}>
                <CheckCircle className="w-4 h-4" /> {editingUnit ? "حفظ التعديلات ونشر العقار" : "نشر وحفظ الوحدة الآن"}
              </Btn>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
