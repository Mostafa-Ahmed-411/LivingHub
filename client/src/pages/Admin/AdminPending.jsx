import React from "react";
import { Filter, CheckCircle, XCircle, Eye, MapPin } from "lucide-react";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { properties } from "../../data/mockData";

export default function AdminPending() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Pending Approvals
          </h2>
          <p className="text-sm text-gray-500">12 listings awaiting review</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">
            <Filter className="w-4 h-4" /> Filter
          </Btn>
          <Btn variant="primary" size="sm">
            Bulk Approve
          </Btn>
        </div>
      </div>

      <div className="space-y-3">
        {properties.map((p, i) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
            <img src={p.image} alt={p.title} className="w-28 h-20 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h4>
                <Badge variant={i === 2 ? "warning" : "primary"}>
                  {i === 2 ? "Needs Review" : "New Listing"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {p.location}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span>Owner: {p.landlord}</span>
                <span>&middot;</span>
                <span>Type: {p.type}</span>
                <span>&middot;</span>
                <span className="font-semibold text-blue-600">EGP {p.price.toLocaleString()}/mo</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Btn variant="primary" size="sm">
                <CheckCircle className="w-4 h-4" /> Approve
              </Btn>
              <Btn variant="danger" size="sm">
                <XCircle className="w-4 h-4" /> Reject
              </Btn>
              <Btn variant="ghost" size="sm">
                <Eye className="w-4 h-4" /> Preview
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
