import React, { useState, useEffect } from "react";
import { Search, Filter, ShieldAlert, Ban } from "lucide-react";
import Inp from "../../components/common/Inp";
import Btn from "../../components/common/Btn";
import Badge from "../../components/common/Badge";
import { getUsers, toggleUserBan, flagUser } from "../../api/adminService";

export default function AdminUsers() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery;
    if (roleFilter) params.role = roleFilter;

    getUsers(params)
      .then((data) => {
        if (data && data.users) {
          setUsersList(data.users);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, roleFilter]);

  const handleToggleBan = async (id, fullName, isBanned) => {
    const action = isBanned ? "unban" : "ban";
    if (!window.confirm(`Are you sure you want to ${action} user ${fullName}?`)) return;
    try {
      await toggleUserBan(id);
      alert(`User ${fullName} was ${action}ned successfully!`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user.`);
    }
  };

  const handleFlag = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to flag user ${fullName} as suspicious?`)) return;
    try {
      await flagUser(id);
      alert(`User ${fullName} flagged successfully.`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to flag user.");
    }
  };

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
          <p className="text-sm text-gray-500">{usersList.length} registered users matching criteria</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-gray-200/80 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <Inp 
            placeholder="Search users..." 
            icon={Search} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && usersList.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : usersList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-sm text-gray-500">No users found matching your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["User", "Role", "Joined Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => {
                  const id = u._id || u.id;
                  const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A";
                  const isSuspendedOrBanned = u.accountStatus === "banned";
                  
                  return (
                    <tr key={id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                            {(u.fullName || "U").charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.role === "owner" ? "primary" : u.role === "admin" ? "danger" : "default"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{joined}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            u.accountStatus === "active" ? "success" : isSuspendedOrBanned ? "danger" : "warning"
                          }
                        >
                          {u.accountStatus || "active"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleToggleBan(id, u.fullName, isSuspendedOrBanned)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title={isSuspendedOrBanned ? "Unban User" : "Ban User"}
                          >
                            <Ban className={`w-4 h-4 ${isSuspendedOrBanned ? 'text-green-600' : 'text-red-500'}`} />
                          </button>
                          <button 
                            onClick={() => handleFlag(id, u.fullName)}
                            className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Flag Account"
                          >
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
