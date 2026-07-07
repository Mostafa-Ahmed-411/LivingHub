import React, { useState } from "react";
import {
  CheckCircle,
  MessageSquare,
  CreditCard,
  Eye,
  Shield,
  Bell,
  Clock
} from "lucide-react";
import Btn from "../components/common/Btn";
import { notifData } from "../data/mockData";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifData);
  const unread = notifs.filter((n) => !n.read).length;

  const iconMap = {
    check: CheckCircle,
    message: MessageSquare,
    payment: CreditCard,
    eye: Eye,
    shield: Shield
  };

  const colorMap = {
    check: "bg-green-100 text-green-600",
    message: "bg-blue-100 text-blue-600",
    payment: "bg-amber-100 text-amber-600",
    eye: "bg-purple-100 text-purple-600",
    shield: "bg-gray-100 text-gray-600"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Notifications
          </h2>
          <p className="text-sm text-gray-500">{unread} unread</p>
        </div>
        <Btn
          variant="ghost"
          size="sm"
          onClick={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
        >
          Mark all as read
        </Btn>
      </div>

      <div className="space-y-2">
        {notifs.map((n) => {
          const Icon = iconMap[n.type] || Bell;
          const cc = colorMap[n.type] || "bg-gray-100 text-gray-600";
          return (
            <div
              key={n.id}
              onClick={() =>
                setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
              }
              className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                n.read ? "bg-white border-gray-100" : "bg-blue-50/40 border-blue-100"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cc}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-semibold ${n.read ? "text-gray-900" : "text-blue-900"}`}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {n.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
