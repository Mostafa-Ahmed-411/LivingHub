import React, { useState } from "react";
import {
  Check,
  MapPin,
  BookOpen,
  DollarSign,
  Wallet,
  Calendar,
  Camera,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  Sparkles
} from "lucide-react";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import { cities } from "../data/mockData";

export default function UnitFormPage({ onNavigate, embedded = false }) {
  const [step, setStep] = useState(1);
  const total = 5;

  // Step names in English
  const steps = [
    { id: 1, label: "Basic Info", sub: "Listing details and type" },
    { id: 2, label: "Location", sub: "Address and nearby campus" },
    { id: 3, label: "Specs & Bills", sub: "Property features and bills" },
    { id: 4, label: "Amenities", sub: "Detailed checklist of features" },
    { id: 5, label: "Pricing & Photos", sub: "Monthly rate and gallery" }
  ];

  // 1. Basic Info State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Studio");
  const [listingFor, setListingFor] = useState("Rent");
  const [description, setDescription] = useState("");

  // 2. Location State
  const [governorate, setGovernorate] = useState("Cairo");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [university, setUniversity] = useState("");

  // 3. Specs & Bills State
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

  // 4. Grouped Amenities State (Checked by default)
  const [sharedChecked, setSharedChecked] = useState({
    hasFridge: true,
    hasWashingMachine: true,
    hasBathroom: true,
    hasKitchen: true,
    hasHeater: true
  });

  const [roomChecked, setRoomChecked] = useState({
    hasBalcony: true,
    hasWindow: true,
    hasAC: true,
    hasTV: true,
    hasWardrobe: true
  });

  const [servicesChecked, setServicesChecked] = useState({
    hasWiFi: true,
    hasCleaner: true,
    hasSecurity: true,
    hasCameras: true
  });

  // 5. Pricing & Media State
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [leasePeriod, setLeasePeriod] = useState("6 Months");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");

  const sharedAmenitiesList = [
    { key: "hasFridge", label: "Fridge" },
    { key: "hasWashingMachine", label: "Washing Machine" },
    { key: "hasBathroom", label: "Shared Bathroom" },
    { key: "hasKitchen", label: "Shared Kitchen" },
    { key: "hasHeater", label: "Heater" }
  ];

  const roomAmenitiesList = [
    { key: "hasBalcony", label: "Balcony" },
    { key: "hasWindow", label: "Window" },
    { key: "hasAC", label: "AC" },
    { key: "hasTV", label: "TV Screen" },
    { key: "hasWardrobe", label: "Wardrobe" }
  ];

  const servicesAmenitiesList = [
    { key: "hasWiFi", label: "WiFi" },
    { key: "hasCleaner", label: "Cleaner" },
    { key: "hasSecurity", label: "Security" },
    { key: "hasCameras", label: "Security Cameras" }
  ];

  const toggleShared = (key) =>
    setSharedChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleRoom = (key) =>
    setRoomChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleServices = (key) =>
    setServicesChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  // Helper Counter Component for UX
  const CounterInput = ({ label, value, onChange, min = 0 }) => (
    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 shadow-sm">
      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm select-none"
        >
          -
        </button>
        <span className="w-6 text-center font-extrabold text-sm text-gray-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm select-none"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className={embedded ? "" : "max-w-4xl mx-auto px-4"}>
      {!embedded && (
        <div className="mb-8">
          <h2
            className="text-2xl font-extrabold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Add New Listing
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details to list your property on LivingHub
          </p>
        </div>
      )}

      {/* Modern Stepper Indicator */}
      <div className="mb-8 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-xl text-xs">
              Step {step} of {total}
            </span>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                {steps[step - 1].label}
              </h4>
              <p className="text-xs text-gray-400">{steps[step - 1].sub}</p>
            </div>
          </div>
          <div className="w-full sm:w-64 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-5 gap-3 mt-6 pt-4 border-t border-gray-100">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className="text-left group focus:outline-none"
            >
              <div
                className={`h-1.5 rounded-full mb-2 transition-all ${
                  step >= s.id ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
              <p
                className={`text-xs font-bold transition-colors ${
                  step === s.id
                    ? "text-blue-600"
                    : step > s.id
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {s.label}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content Shell */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Basic Information</h3>
                <p className="text-xs text-gray-400">Primary details about your property</p>
              </div>
            </div>

            <Inp
              label="Listing Title"
              placeholder="e.g. Modern Studio near Cairo University"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Property Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                >
                  <option value="Studio">Studio</option>
                  <option value="Room">Private Room</option>
                  <option value="Apartment">Entire Apartment</option>
                  <option value="Bed">Bed Space (Shared Room)</option>
                </select>
              </div>

              {/* Segmented Pill Selector for 'Listing For' */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Listing For
                </label>
                <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1 h-[42px] items-center">
                  {["Rent", "Sale"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setListingFor(option)}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                        listingFor === option
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your property — key features, nearby amenities, transport links..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-semibold"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Location & Campus</h3>
                <p className="text-xs text-gray-400">Where the property is located</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Governorate
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Inp
                label="District / Area"
                placeholder="e.g. Zamalek, El-Mahata"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <Inp
              label="Street Address"
              placeholder="e.g. 15 Hassan Sabry St."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <Inp
              label="Nearby University"
              placeholder="e.g. Cairo University, Assiut University"
              icon={BookOpen}
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />

            <div className="bg-gray-100 rounded-xl h-44 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <MapPin className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">Click to set location on map</p>
            </div>
          </div>
        )}

        {/* Step 3: Specifications & Bills */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Specifications & Bills</h3>
                <p className="text-xs text-gray-400">Setup interior specifications and bill coverage</p>
              </div>
            </div>

            {/* Dynamic specs counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(type === "Bed" || type === "Studio") && (
                <CounterInput
                  label="Total Beds in Room"
                  value={roomBeds}
                  onChange={setRoomBeds}
                  min={1}
                />
              )}

              {type === "Room" && (
                <CounterInput
                  label="Beds in Room"
                  value={beds}
                  onChange={setBeds}
                  min={1}
                />
              )}

              {type === "Apartment" && (
                <>
                  <CounterInput
                    label="Total Bedrooms"
                    value={beds}
                    onChange={setBeds}
                    min={1}
                  />
                  <div className="flex flex-col justify-center">
                    <Inp
                      label="Area (m²)"
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                    />
                  </div>
                </>
              )}

              <CounterInput
                label="Bathrooms"
                value={baths}
                onChange={setBaths}
                min={1}
              />
              
              <CounterInput
                label="Floor Level"
                value={floor}
                onChange={setFloor}
                min={0}
              />

              <CounterInput
                label="Flat Capacity (Pax)"
                value={aptPeople}
                onChange={setAptPeople}
                min={1}
              />
            </div>

            {/* Gas Supply & Utilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              {/* Segmented control for Gas Supply Type */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Gas Supply Type
                </label>
                <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1 h-[42px] items-center">
                  {["Natural Gas", "Cylinder"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGasType(option)}
                      className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                        gasType === option
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
                  Rent Includes
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesWater}
                      onChange={(e) => setIncludesWater(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-bold text-gray-700">Water</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesGas}
                      onChange={(e) => setIncludesGas(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-bold text-gray-700">Gas</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesElectricity}
                      onChange={(e) => setIncludesElectricity(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-bold text-gray-700">Electricity</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Amenities Checklist */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Amenities Checklist</h3>
                <p className="text-xs text-gray-400">Select all features available in your listing (pre-checked by default)</p>
              </div>
            </div>

            {/* Group 1: Shared */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Shared Amenities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sharedAmenitiesList.map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
                      sharedChecked[item.key]
                        ? "bg-blue-50/50 border-blue-200 text-blue-900"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={sharedChecked[item.key]}
                      onChange={() => toggleShared(item.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Group 2: Room */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Room Amenities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {roomAmenitiesList.map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
                      roomChecked[item.key]
                        ? "bg-blue-50/50 border-blue-200 text-blue-900"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={roomChecked[item.key]}
                      onChange={() => toggleRoom(item.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Group 3: Services */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                Building Services & Security
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {servicesAmenitiesList.map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 cursor-pointer transition-all ${
                      servicesChecked[item.key]
                        ? "bg-blue-50/50 border-blue-200 text-blue-900"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={servicesChecked[item.key]}
                      onChange={() => toggleServices(item.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pricing & Photos */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Pricing & Photos</h3>
                <p className="text-xs text-gray-400">Set lease pricing and upload photos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp
                label="Monthly Rent (EGP)"
                placeholder="2800"
                type="number"
                icon={DollarSign}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <Inp
                label="Security Deposit (EGP)"
                placeholder="5600"
                type="number"
                icon={Wallet}
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Inp
                label="Available From"
                type="date"
                icon={Calendar}
                value={availFrom}
                onChange={(e) => setAvailFrom(e.target.value)}
                required
              />
              <Inp
                label="Available To"
                type="date"
                icon={Calendar}
                value={availTo}
                onChange={(e) => setAvailTo(e.target.value)}
              />
            </div>

            {/* Photos Upload grids */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Main Cover Images (2 Required)
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {["Cover Photo 1", "Cover Photo 2"].map((titleStr, idx) => (
                  <div
                    key={idx}
                    className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-[10px] text-gray-500 font-bold">{titleStr}</span>
                  </div>
                ))}
              </div>

              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Gallery Photos (6 Required)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-[9px] text-gray-400 font-bold">Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                Your listing will be reviewed by our team within 24 hours before going live.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
          <Btn
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Btn>

          {step < total ? (
            <Btn variant="primary" onClick={() => setStep(Math.min(total, step + 1))}>
              Next <ArrowRight className="w-4 h-4" />
            </Btn>
          ) : (
            <Btn variant="primary" onClick={() => onNavigate("owner")}>
              <CheckCircle className="w-4 h-4" /> Submit Listing
            </Btn>
          )}
        </div>

      </div>
    </div>
  );
}
