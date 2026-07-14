import React, { useState, useEffect } from "react";
import { Lock, Trash2, Shield, Sliders } from "lucide-react";
import Sel from "../components/common/Sel";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import { getSettings, updateSettings } from "../api/adminService";

export default function SettingsPage({ isAdmin = false }) {
  const [notifOn, setNotifOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(false);

  // Admin Config state
  const [maxFreeUnits, setMaxFreeUnits] = useState(2);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      getSettings()
        .then((data) => {
          if (data && data.settings) {
            setMaxFreeUnits(data.settings.maxFreeUnitsPerOwner);
          }
        })
        .catch((err) => {
          console.error("Error loading system settings:", err);
        });
    }
  }, [isAdmin]);

  const handleSaveAdminConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await updateSettings(maxFreeUnits);
      alert("System configurations updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save system configurations.");
    } finally {
      setSavingConfig(false);
    }
  };

  function Toggle({ on, toggle }) {
    return (
      <button
        onClick={toggle}
        className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${
          on ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            on ? "translate-x-5" : ""
          }`}
        />
      </button>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="mb-2">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Settings
        </h2>
        <p className="text-sm text-gray-500">
          {isAdmin ? "Manage platform configuration & settings" : "Manage your account preferences"}
        </p>
      </div>

      {/* Admin System Configurations */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Unit Publishing Limit Config</h3>
          </div>
          <form onSubmit={handleSaveAdminConfig} className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Define how many free listings a property owner/landlord can publish before their listings require manual approval.
              </p>
              <Inp
                label="Maximum Free Listings per Landlord"
                type="number"
                min="1"
                placeholder="e.g. 2"
                value={maxFreeUnits}
                onChange={(e) => setMaxFreeUnits(Number(e.target.value))}
                icon={Shield}
                required
              />
            </div>
            <Btn variant="primary" type="submit" disabled={savingConfig}>
              {savingConfig ? "Saving Config..." : "Save System Config"}
            </Btn>
          </form>
        </div>
      )}

      {/* Notifications Toggle Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            {
              l: "Push Notifications",
              d: "Receive in-app notifications",
              on: notifOn,
              toggle: () => setNotifOn(!notifOn)
            },
            {
              l: "Email Alerts",
              d: "Get updates via email",
              on: emailOn,
              toggle: () => setEmailOn(!emailOn)
            },
            {
              l: "SMS Alerts",
              d: "Receive text message notifications",
              on: smsOn,
              toggle: () => setSmsOn(!smsOn)
            }
          ].map((item) => (
            <div
              key={item.l}
              className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.l}</p>
                <p className="text-xs text-gray-400">{item.d}</p>
              </div>
              <Toggle on={item.on} toggle={item.toggle} />
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Language & Region</h3>
        <Sel label="Language" options={["English", "العربية"]} />
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-3">
          <Inp label="Current Password" placeholder="Enter current password" type="password" icon={Lock} />
          <Inp label="New Password" placeholder="Enter new password" type="password" icon={Lock} />
          <Inp label="Confirm Password" placeholder="Confirm new password" type="password" icon={Lock} />
          <Btn variant="primary">
            <Lock className="w-4 h-4" /> Update Password
          </Btn>
        </div>
      </div>

      {/* Danger Zone */}
      {!isAdmin && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">Delete Account</p>
              <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
            </div>
            <Btn variant="danger" size="sm">
              <Trash2 className="w-4 h-4" /> Delete Account
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
