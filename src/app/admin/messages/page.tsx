"use client";

import { useState } from "react";

const initialConversations = [
  {
    id: "conv-1",
    name: "Nguyễn Văn A",
    avatar: "",
    messages: [
      {
        id: 1,
        sender: "user",
        text: "Xin chào, tôi cần hỗ trợ về khóa học.",
        time: "09:12",
      },
      {
        id: 2,
        sender: "admin",
        text: "Chào bạn, bạn cần hỗ trợ gì cụ thể?",
        time: "09:14",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Trần Thị B",
    avatar: "",
    messages: [
      {
        id: 1,
        sender: "user",
        text: "Khi nào có lịch học mới?",
        time: "08:03",
      },
      {
        id: 2,
        sender: "admin",
        text: "Sẽ có vào tuần tới, mình gửi lịch sớm nhé.",
        time: "08:15",
      },
    ],
  },
];

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [input, setInput] = useState("");

  const activeConv = conversations.find((c) => c.id === activeId)!;

  const handleSend = () => {
    if (!input.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: Date.now(),
                  sender: "admin",
                  text: input.trim(),
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : c,
      ),
    );
    setInput("");
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden flex h-full min-h-0">
        <div className="w-80 border-r border-gray-100 p-0 overflow-auto">
          <div className="text-sm text-gray-500 mb-3 px-3 py-2">Cuộc trò chuyện</div>
          <div className="space-y-2">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-4 py-3 rounded ${c.id === activeId ? "bg-accent-50 border border-accent" : "hover:bg-gray-50"} transition-colors flex items-center gap-3`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                  {c.name.split(" ").pop()?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {c.messages[c.messages.length - 1].text}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col relative">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              {activeConv.name.split(" ").pop()?.charAt(0)}
            </div>
            <div>
              <div className="font-semibold">{activeConv.name}</div>
              <div className="text-xs text-gray-500">Trò chuyện gần đây</div>
            </div>
          </div>

          <div className="flex-1 overflow-auto space-y-4 bg-gray-50 px-4 py-4">
            {activeConv.messages.map((m) => (
              <div key={m.id} className="w-full">
                {m.sender === "admin" ? (
                  <div className="flex w-full items-center">
                    <div className="ml-auto max-w-[70%] flex items-center gap-2">
                      <div className="bg-accent text-white px-4 py-2 rounded-lg shadow-sm">
                        <div className="text-sm">{m.text}</div>
                      </div>
                      <div className="text-xs text-white/80">{m.time}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-center">
                    <div className="max-w-[70%] flex items-center gap-2">
                      <div className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-sm">
                        <div className="text-sm">{m.text}</div>
                      </div>
                      <div className="text-xs text-gray-400">{m.time}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute left-0 right-0 bottom-0 border-t border-gray-100 flex items-center gap-3 p-3 bg-white rounded-b-lg">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-accent text-white rounded-md disabled:opacity-50"
              disabled={!input.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
