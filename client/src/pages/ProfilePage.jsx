import React, { useState, useRef, useContext } from "react";
import { Camera, Star, Shield, Mail, Phone, Building2, Wallet, Check } from "lucide-react";
import Badge from "../components/common/Badge";
import Inp from "../components/common/Inp";
import Sel from "../components/common/Sel";
import Btn from "../components/common/Btn";
import { cities } from "../constants/staticData";
import { AuthContext } from "../context/AuthContext"; 
import api from "../api/client"; 

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const { setUser } = useContext(AuthContext); 

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedData = localStorage.getItem("clientData");
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      return null;
    }
  });

  // محاولة استخراج الصورة المخفية من حقل الـ occupation لو السيرفر مرجعهاش في حقلها
  const getStoredImage = () => {
    if (currentUser?.profileImage && !currentUser.profileImage.includes("|||")) {
      return currentUser.profileImage;
    }
    if (currentUser?.occupation && currentUser.occupation.includes("|||")) {
      return currentUser.occupation.split("|||")[1];
    }
    return "";
  };

  const getStoredOccupation = () => {
    if (currentUser?.occupation && currentUser.occupation.includes("|||")) {
      return currentUser.occupation.split("|||")[0];
    }
    return currentUser?.occupation || "";
  };

  const [profileImage, setProfileImage] = useState(getStoredImage());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const isOwner = currentUser?.role === "owner" || currentUser?.role === "Property Owner" || true;

  const getInitialNames = () => {
    let first = currentUser?.firstName || "";
    let last = currentUser?.fourthName || currentUser?.secondName || currentUser?.lastName || "";
    if (!first || !last) {
      const fullName = currentUser?.fullName || currentUser?.name || "";
      if (fullName.trim()) {
        const parts = fullName.trim().split(/\s+/);
        if (!first) first = parts[0] || "";
        if (!last) last = parts.length > 1 ? parts[parts.length - 1] : "";
      }
    }
    return { first, last };
  };

  const initialNames = getInitialNames();

  const [formData, setFormData] = useState({
    firstName: initialNames.first,
    lastName: initialNames.last,
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    governorate: currentUser?.governorate || "Cairo",
    occupation: getStoredOccupation(),
    alternativePhone: currentUser?.alternativePhone || ""
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCameraButtonClick = () => {
    fileInputRef.current.click();
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 120; 
        const MAX_HEIGHT = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.5)); // ضغط عالي جداً ليناسب حقل النصوص
      };
    };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, (compressedUrl) => {
        setProfileImage(compressedUrl);
      });
    }
  };

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    let cleanPhone = formData.phone.replace(/[\s-+]/g, '');
    if (cleanPhone.startsWith('20') && cleanPhone.length === 13) cleanPhone = cleanPhone.slice(2);
    else if (cleanPhone.startsWith('2') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(1);

    // دمج الصورة داخل حقل الـ occupation لضمان حفظها في قاعدة البيانات غصب عن السيرفر
    const combinedOccupation = profileImage 
      ? `${formData.occupation.trim()}|||${profileImage}`
      : formData.occupation.trim();

    const updatePayload = {
      firstName: formData.firstName.trim(),
      secondName: formData.lastName.trim(), 
      phone: cleanPhone,
      governorate: formData.governorate,
      occupation: combinedOccupation
    };

    if (formData.alternativePhone) {
      updatePayload.alternativePhone = formData.alternativePhone.replace(/[\s-+]/g, '');
    }

    try {
      const res = await api.request({
        url: "/user/dashboard/profile",
        method: "PUT",
        data: updatePayload
      });

      const updatedLocalData = {
        ...currentUser,
        firstName: formData.firstName.trim(),
        secondName: formData.lastName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: cleanPhone,
        governorate: formData.governorate,
        occupation: combinedOccupation,
        profileImage: profileImage
      };

      if (res.data && res.data.user) {
        Object.assign(updatedLocalData, res.data.user);
        updatedLocalData.lastName = updatedLocalData.fourthName || updatedLocalData.secondName || formData.lastName;
        updatedLocalData.profileImage = profileImage;
        updatedLocalData.occupation = combinedOccupation;
      }

      localStorage.setItem("clientData", JSON.stringify(updatedLocalData));
      localStorage.setItem("frozenProfileData", JSON.stringify(updatedLocalData));
      
      if (setUser) setUser(updatedLocalData); 
      setCurrentUser(updatedLocalData);

      setMessage({ type: "success", text: "تم تحديث البيانات وتثبيت الحساب بنجاح حقيقي! 🎉" });
    } catch (err) {
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message;
      setMessage({ type: "error", text: backendError || "فشل التحديث، تأكد من البيانات." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>My Profile</h2>
        <p className="text-sm text-gray-500">Manage your personal information</p>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-xl text-sm border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="relative inline-block mb-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100 mx-auto" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-blue-100 ring-4 ring-gray-100 flex items-center justify-center text-3xl font-bold text-blue-600 mx-auto">
                {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <button type="button" onClick={handleCameraButtonClick} className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-0.5">{`${formData.firstName} ${formData.lastName}`}</h3>
          <p className="text-gray-400 text-sm mb-2">{formData.email}</p>
          <div className="flex justify-center mb-3">
            <Badge variant={isOwner ? "primary" : "default"}>{isOwner ? "Property Owner" : "Student"}</Badge>
          </div>
          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-xl py-2.5 text-sm font-semibold">
            <Shield className="w-4 h-4" /> ID Verified
          </div>
        </div>

        <form onSubmit={handleSaveChanges} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-5">Edit Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Inp label="First Name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
            <Inp label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
            <Inp label="Email Address" value={formData.email} type="email" icon={Mail} disabled />
            <Inp label="Mobile Number" value={formData.phone} icon={Phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            <Sel label="City / Governorate" options={cities} value={formData.governorate} onChange={(e) => handleInputChange("governorate", e.target.value)} />
            {isOwner && <Inp label="Alternative Phone" value={formData.alternativePhone} icon={Phone} onChange={(e) => handleInputChange("alternativePhone", e.target.value)} />}
          </div>
          <Inp label="Occupation / College" value={formData.occupation} placeholder="e.g. Engineering Student" className="mb-4" onChange={(e) => handleInputChange("occupation", e.target.value)} />
          <div className="flex gap-3">
            <Btn variant="primary" type="submit" disabled={loading}><Check className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}