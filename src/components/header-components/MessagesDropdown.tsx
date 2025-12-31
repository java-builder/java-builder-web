"use client";

import { useState, useEffect } from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const MOCK_MESSAGES = [
  { id: 1, sender: "Nguyễn Văn A", text: "Xin chào, tôi muốn hỏi về khóa học React.", time: "2 giờ trước" },
  { id: 2, sender: "Bạn", text: "Chào anh, khóa học React hiện đang có chương trình ưu đãi.", time: "2 giờ trước" },
  { id: 3, sender: "Nguyễn Văn A", text: "Chi phí và lịch học thế nào?", time: "2 giờ trước" },
  { id: 4, sender: "Bạn", text: "Anh có thể tham khảo lịch học trên trang khoá học, hoặc mình gửi link nhanh.", time: "1 giờ 58 phút trước" },
  { id: 5, sender: "Nguyễn Văn A", text: "Gửi giúp tôi link với.", time: "1 giờ 55 phút trước" },
  { id: 6, sender: "Bạn", text: "Đã gửi, anh kiểm tra inbox nhé.", time: "1 giờ 50 phút trước" },
  { id: 7, sender: "Nguyễn Văn A", text: "Tuyệt, cảm ơn!", time: "1 giờ 45 phút trước" },
  { id: 8, sender: "Trần Thị B", text: "Cảm ơn đã hỗ trợ, tôi đã đăng ký thành công.", time: "1 ngày trước" },
  { id: 9, sender: "Bạn", text: "Chúc mừng chị, nếu cần hỗ trợ thêm inbox mình nhé.", time: "23 giờ trước" },
  { id: 10, sender: "Nguyễn Văn A", text: "Một câu hỏi nữa: cần chuẩn bị gì trước khi học?", time: "10 phút trước" },
  { id: 11, sender: "Bạn", text: "Không cần nhiều, có laptop và tinh thần là đủ.", time: "Vừa xong" },
];

export default function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  // Add/remove body class when chat is open
  useEffect(() => {
    if (selectedConversation) {
      document.body.classList.add("header-chat-open");
    } else {
      document.body.classList.remove("header-chat-open");
    }
    return () => document.body.classList.remove("header-chat-open");
  }, [selectedConversation]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: "Bạn", text: messageInput, time: "Vừa xong" }]);
    setMessageInput("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedConversation(null);
  };

  const conversations = Array.from(new Map(MOCK_MESSAGES.map((m) => [m.sender, m])));

  return (
    <div className="relative" data-dropdown>
      <button
        onClick={() => { setIsOpen(!isOpen); setSelectedConversation(null); }}
        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 relative"
        aria-label="Tin nhắn"
      >
        <HiOutlineChatAlt2 className="w-6 h-6" />
        <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-600 rounded-full" />
      </button>

      {/* Conversations List */}
      {isOpen && !selectedConversation && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 w-full sm:w-96 h-full sm:h-auto bg-white dark:bg-slate-800 sm:rounded-xl sm:shadow-2xl sm:border sm:border-gray-100 dark:sm:border-slate-700 z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-accent to-blue-600 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Tin nhắn</h3>
              <button 
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors sm:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 sm:h-[420px] overflow-y-auto">
            {conversations.map(([, m]) => (
              <button
                key={m.sender}
                onClick={() => setSelectedConversation(m.sender)}
                className="w-full text-left px-4 py-3 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 border-b border-gray-50 dark:border-slate-700 last:border-0 group"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-semibold text-base shadow-sm">
                      {m.sender?.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{m.sender}</h4>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{m.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {m.text}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {m.sender !== "Bạn" && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex-shrink-0">
            <button className="w-full text-center text-sm font-medium text-accent hover:text-blue-700 transition-colors">
              Xem tất cả tin nhắn
            </button>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && selectedConversation && (
        <div className="header-chat-modal fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-96 h-[85vh] sm:h-[560px] max-h-[820px] sm:max-h-[560px] bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  {selectedConversation?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{selectedConversation}</div>
                  <div className="text-xs text-white/80">Đang hoạt động</div>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
            {messages
              .filter((m) => m.sender === selectedConversation || m.sender === "Bạn")
              .map((m) => {
                const isMe = m.sender === "Bạn";
                return (
                  <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${isMe ? "" : "flex items-start gap-2"}`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {m.sender?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className={`${
                          isMe 
                            ? "bg-gradient-to-r from-accent to-blue-600 text-white" 
                            : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-600"
                        } px-4 py-2.5 rounded-2xl ${isMe ? "rounded-br-sm" : "rounded-bl-sm"} shadow-sm`}>
                          <div className="text-sm leading-relaxed">{m.text}</div>
                        </div>
                        <div className={`mt-1 text-xs text-gray-500 ${isMe ? "text-right" : "text-left"} px-1`}>
                          {m.time}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-accent transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-slate-700 text-sm"
                placeholder="Nhập tin nhắn..."
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="text-accent hover:text-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Gửi"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
