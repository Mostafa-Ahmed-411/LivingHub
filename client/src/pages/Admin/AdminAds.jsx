import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, Zap, Link as LinkIcon, FileText, X, Loader2, Globe } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { getAds, createAd, updateAd, deleteAd, toggleAdStatus } from "../../api/adminService";

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [targetLocation, setTargetLocation] = useState("home");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAllAds = async () => {
    setLoading(true);
    try {
      const data = await getAds();
      if (data && data.ads) {
        setAds(data.ads);
      }
    } catch (err) {
      console.error("Failed to load advertisements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAds();
  }, []);

  const openCreateModal = () => {
    setEditingAd(null);
    setTitle("");
    setDescription("");
    setLinkUrl("");
    setTargetLocation("home");
    setStartDate("");
    setEndDate("");
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (ad) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setDescription(ad.description || "");
    setLinkUrl(ad.linkUrl || "");
    setTargetLocation(ad.targetLocation || "home");
    setStartDate(ad.startDate ? new Date(ad.startDate).toISOString().split("T")[0] : "");
    setEndDate(ad.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "");
    setImageFile(null);
    setModalOpen(true);
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleAdStatus(id);
      alert(res.message || "Status toggled successfully");
      fetchAllAds();
    } catch (err) {
      alert("Failed to toggle status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;
    try {
      const res = await deleteAd(id);
      alert(res.message || "Ad deleted successfully");
      fetchAllAds();
    } catch (err) {
      alert("Failed to delete ad: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) {
      alert("Please fill in title, start date, and end date.");
      return;
    }
    if (!editingAd && !imageFile) {
      alert("Please upload a banner image.");
      return;
    }

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("linkUrl", linkUrl);
    formData.append("targetLocation", targetLocation);
    formData.append("startDate", new Date(startDate).toISOString());
    formData.append("endDate", new Date(endDate).toISOString());
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingAd) {
        await updateAd(editingAd._id, formData);
        alert("Advertisement updated successfully!");
      } else {
        await createAd(formData);
        alert("Advertisement created successfully!");
      }
      setModalOpen(false);
      fetchAllAds();
    } catch (err) {
      alert("Operation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const IMAGE_BASE_URL = "http://localhost:3000/uploads/ads";

  return (
    <div className="p-1 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-2xl font-bold text-gray-900 mb-1.5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Advertisement Management
          </h2>
          <p className="text-gray-500 text-sm">Create and schedule clickable promo banners across key student views</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer border-0"
        >
          <Plus className="w-4 h-4" /> Create Ad
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-xs">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 text-lg">No Advertisements Scheduled</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Click 'Create Ad' to publish your first banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 bg-gray-100 border-b border-gray-100 overflow-hidden">
                  <img
                    src={`${IMAGE_BASE_URL}/${ad.image}`}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={ad.isActive ? "success" : "danger"}>
                      {ad.isActive ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {ad.targetLocation}
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-base mb-1 truncate">{ad.title}</h4>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8 leading-relaxed">
                    {ad.description || "No description provided."}
                  </p>

                  {ad.linkUrl && (
                    <a
                      href={ad.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold mb-4 underline break-all"
                    >
                      <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" /> Redirect URL
                    </a>
                  )}

                  <div className="space-y-1.5 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" /> Start Date
                      </span>
                      <span className="font-semibold text-gray-700">{new Date(ad.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" /> End Date
                      </span>
                      <span className="font-semibold text-gray-700">{new Date(ad.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleToggle(ad._id)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                    ad.isActive
                      ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  }`}
                >
                  {ad.isActive ? "Pause" : "Publish"}
                </button>
                <button
                  onClick={() => openEditModal(ad)}
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="bg-red-50 hover:bg-red-105 text-red-600 border border-red-200 py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 transform transition-all">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full cursor-pointer border-0"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-xl text-gray-900 mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              {editingAd ? "Edit Advertisement" : "New Advertisement"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Promo Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Back to School Discounts"
                  className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Simple Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Save 15% on monthly rents for new apartments near AUC..."
                  rows={3}
                  className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Clickable Link (Redirect URL)</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. https://maeesha.com/promo-details"
                  className="w-full bg-gray-50 text-gray-900 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Target Location</label>
                  <select
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="home">Home Page</option>
                    <option value="search">Search Page</option>
                    <option value="dashboard">Dashboard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full text-xs text-gray-500 cursor-pointer pt-2"
                  />
                  {editingAd && <span className="text-[10px] text-amber-600 block mt-1">Leave empty to keep current image</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer border-0 flex items-center justify-center gap-2"
                >
                  {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingAd ? "Update Ad" : "Publish Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
