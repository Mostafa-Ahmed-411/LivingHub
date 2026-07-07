import React from "react";
import { Plus, Edit2, Trash2, Calendar, Zap } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";

export default function AdminAds() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Advertisement Management
          </h2>
          <p className="text-sm text-gray-500">Manage platform promotions and sponsored listings</p>
        </div>
        <Btn variant="primary">
          <Plus className="w-4 h-4" /> Create Ad
        </Btn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Hero Banner — Cairo",
            status: "Active",
            impressions: "142K",
            clicks: "2,840",
            ctr: "2.0%",
            expires: "Aug 1, 2025"
          },
          {
            title: "Sidebar — Student Housing",
            status: "Active",
            impressions: "89K",
            clicks: "1,240",
            ctr: "1.4%",
            expires: "Jul 31, 2025"
          },
          {
            title: "Featured Listing Boost",
            status: "Paused",
            impressions: "54K",
            clicks: "920",
            ctr: "1.7%",
            expires: "Jul 20, 2025"
          }
        ].map((ad, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{ad.title}</h4>
              <Badge variant={ad.status === "Active" ? "success" : "warning"}>{ad.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { l: "Impressions", v: ad.impressions },
                { l: "Clicks", v: ad.clicks },
                { l: "CTR", v: ad.ctr }
              ].map((m) => (
                <div key={m.l} className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-sm font-bold text-gray-900">{m.v}</p>
                  <p className="text-xs text-gray-400">{m.l}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Expires: {ad.expires}
            </p>

            <div className="flex gap-2">
              <Btn variant="outline" size="sm" className="flex-1">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Btn>
              <Btn variant="danger" size="sm" className="flex-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
