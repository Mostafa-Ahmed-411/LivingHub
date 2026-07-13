import React, { useState, useRef } from "react";
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

export default function UnitFormPage({ onNavigate, embedded = false }) {
  const [step, setStep] = useState(1);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  // الخطوة 1: البيانات الأساسية
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Studio");
  const [listingFor, setListingFor] = useState("Rent");
  const [description, setDescription] = useState("");

  // الخطوة 2: الموقع الجغرافي
  const [governorate, setGovernorate] = useState("Cairo");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [university, setUniversity] = useState("");

  // الخطوة 3: تفاصيل الغرف والأسرة
  const [beds, setBeds] = useState(1);
  const [roomBeds, setRoomBeds] = useState(2);
  const [aptPeople, setAptPeople] = useState(4);
  const [baths, setBaths] = useState(1);
  const [area, setArea] = useState(45);
  const [floor, setFloor] = useState(3);
  const [gasType, setGasType] = useState("Natural Gas");
  const [includesWater, setIncludesWater] = useState(true);
  const [includesGas, setIncludesGas] = useState(false);
  const [includesElectricity, setIncludesElectricity] = useState(false);

  // الخطوة 4: السعر وفترة الإيجار
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");

  // الخطوة 5: ألبوم الصور والمعاينة
  const [coverImage1, setCoverImage1] = useState("");
  const [coverImage2, setCoverImage2] = useState("");

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index === 1) setCoverImage1(reader.result);
        if (index === 2) setCoverImage2(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!title || !price || !district) {
      alert("يرجى ملء الحقول الإلزامية الأساسية قبل إتمام حفظ العقار.");
      return;
    }

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

    try {
      const existingProperties = JSON.parse(localStorage.getItem("owner_properties") || "[]");
      localStorage.setItem("owner_properties", JSON.stringify([newProperty, ...existingProperties]));
      window.dispatchEvent(new Event("storage"));
      if (typeof onNavigate === "function") onNavigate("owner");
    } catch (err) {
      console.error("Error saving unit data:", err);
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
              Add New Listing
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
                <CheckCircle className="w-4 h-4" /> نشر وحفظ الوحدة الآن
              </Btn>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}