import React, { useState } from "react";
import { Search, Phone, MoreVertical, Building2, Check, Image as ImgIcon, Send } from "lucide-react";
import Inp from "../components/common/Inp";
import { convList, initMsgs } from "../data/mockData";

export default function ChatPage({ compact = false }) {
  const [selected, setSelected] = useState(convList[0]);
  const [msgs, setMsgs] = useState(initMsgs);
  const [newMsg, setNewMsg] = useState("");

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    setMsgs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: newMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sent: true,
        read: false
      }
    ]);
    setNewMsg("");
  };

  const height = compact ? "h-[560px]" : "h-[calc(100vh-8rem)]";

  return (
    <div
      className={`flex ${height} rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden ${
        compact ? "" : "mt-4"
      }`}
    >
      {/* Sidebar - Conversations */}
      <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Inp placeholder="Search conversations..." icon={Search} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {convList.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelected(conv)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                selected.id === conv.id ? "bg-blue-50/70" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{conv.time}</span>
                </div>
                <p className="text-xs text-blue-500 truncate font-medium">{conv.property}</p>
                <p className="text-xs text-gray-400 truncate">{conv.last}</p>
              </div>
              {conv.unread > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <img src={selected.avatar} alt={selected.name} className="w-10 h-10 rounded-full object-cover" />
            {selected.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{selected.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              {selected.online ? (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online
                </>
              ) : (
                "Last seen recently"
              )}
            </p>
          </div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Phone className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Property Reference Strip */}
        <div className="mx-4 my-3 bg-blue-50 rounded-xl p-3 flex items-center gap-3 flex-shrink-0">
          <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs font-medium text-blue-700 truncate flex-1">
            Re: {selected.property}
          </p>
          <button className="text-xs text-blue-600 font-semibold whitespace-nowrap">View</button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {msgs.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
              {!msg.sent && (
                <img
                  src={selected.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover mr-2 self-end flex-shrink-0"
                />
              )}
              <div className={`flex flex-col gap-0.5 max-w-[70%] ${msg.sent ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sent
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 text-xs text-gray-400 ${msg.sent ? "flex-row-reverse" : ""}`}>
                  <span>{msg.time}</span>
                  {msg.sent && (
                    <Check className={`w-3 h-3 ${msg.read ? "text-blue-500" : "text-gray-400"}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2">
            <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
              <ImgIcon className="w-5 h-5 text-gray-400" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMsg}
              className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                newMsg.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-400"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
