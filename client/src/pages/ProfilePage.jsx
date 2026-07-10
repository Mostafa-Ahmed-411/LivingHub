import React from "react";
import { Camera, Star, Shield, Mail, Phone, Building2, Wallet, Check } from "lucide-react";
import Badge from "../components/common/Badge";
import Inp from "../components/common/Inp";
import Sel from "../components/common/Sel";
import Btn from "../components/common/Btn";
import { cities } from "../data/mockData";

export default function ProfilePage({ isOwner = false }) {
  return (
    <div>
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          My Profile
        </h2>
        <p className="text-sm text-gray-500">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format"
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100"
            />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <h3
            className="font-bold text-gray-900 text-lg mb-0.5"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ahmed Hassan
          </h3>
          <p className="text-gray-400 text-sm mb-2">ahmed.hassan@email.com</p>

          <div className="flex justify-center mb-3">
            <Badge variant={isOwner ? "primary" : "default"}>
              {isOwner ? "Property Owner" : "Student"}
            </Badge>
          </div>

          <div className="flex justify-center gap-0.5 mb-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-sm text-gray-500 ml-1">4.9</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: isOwner ? "Listings" : "Rentals", value: isOwner ? "4" : "2" },
              { label: "Reviews", value: "18" }
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-xl py-2.5 text-sm font-semibold">
            <Shield className="w-4 h-4" /> ID Verified
          </div>
        </div>

        {/* Edit Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-5">Edit Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Inp label="First Name" placeholder="Ahmed" />
            <Inp label="Last Name" placeholder="Hassan" />
            <Inp label="Email Address" placeholder="ahmed@email.com" type="email" icon={Mail} />
            <Inp label="Mobile Number" placeholder="+20 10 1234 5678" icon={Phone} />
            <Sel label="City" options={cities} />
            {isOwner && <Inp label="Business Name" placeholder="Hassan Properties" icon={Building2} />}
          </div>

          <Inp label="Bio" placeholder="Tell us a bit about yourself..." className="mb-4" />
          {isOwner && (
            <Inp
              label="Bank Account / Instapay"
              placeholder="Enter your payment details"
              icon={Wallet}
              className="mb-4"
            />
          )}

          <div className="flex gap-3">
            <Btn variant="primary">
              <Check className="w-4 h-4" /> Save Changes
            </Btn>
            <Btn variant="outline">Cancel</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
