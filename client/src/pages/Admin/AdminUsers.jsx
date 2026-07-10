import React from "react";
import { Search, Filter, Eye, Edit2, Trash2 } from "lucide-react";
import Inp from "../../components/common/Inp";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";

export default function AdminUsers() {
  const users = [
    { name: "Youssef Mahmoud", email: "youssef@email.com", role: "Student", joined: "Jan 2025", props: 0, status: "Active" },
    { name: "Khaled Ibrahim", email: "khaled@email.com", role: "Owner", joined: "Feb 2025", props: 4, status: "Active" },
    { name: "Sara Mohamed", email: "sara@email.com", role: "Student", joined: "Mar 2025", props: 0, status: "Active" },
    { name: "Ahmed Hassan", email: "ahmed@email.com", role: "Owner", joined: "Nov 2024", props: 7, status: "Active" },
    { name: "Nada El-Sayed", email: "nada@email.com", role: "Student", joined: "Apr 2025", props: 0, status: "Suspended" },
    { name: "Omar Ashraf", email: "omar@email.com", role: "Owner", joined: "Dec 2024", props: 2, status: "Pending" }
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            User Management
          </h2>
          <p className="text-sm text-gray-500">52,847 registered users</p>
        </div>
        <div className="flex gap-2">
          <Inp placeholder="Search users..." icon={Search} />
          <Btn variant="outline" size="sm">
            <Filter className="w-4 h-4" /> Filter
          </Btn>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["User", "Role", "Joined", "Properties", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.role === "Owner" ? "primary" : "default"}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{u.props}</td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={
                        u.status === "Active" ? "success" : u.status === "Suspended" ? "danger" : "warning"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
