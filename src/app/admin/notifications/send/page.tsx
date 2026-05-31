"use client";

import { useEmailCampaign } from "@/components/admin/notifications/useEmailCampaign";
import { TEMPLATE_LIST } from "@/components/admin/notifications/emailTemplates";
import EmailPreviewPanel from "@/components/admin/notifications/EmailPreviewPanel";

export default function SendNotificationPage() {
  const c = useEmailCampaign();

  return (
    <div className="p-3 sm:p-6 max-w-[1600px] mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-700 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Gửi Chiến Dịch Email Marketing
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
            Thiết kế mẫu, lựa chọn phân khúc người dùng và lập lịch gửi email chuyên nghiệp
          </p>
        </div>
        <button
          onClick={() => c.handleSubmit()}
          disabled={c.isSending}
          className="w-full md:w-auto px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          {c.isSending ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xử lý...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Gửi Chiến Dịch
            </>
          )}
        </button>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: Form tabs */}
        <div className="lg:col-span-7 space-y-6 min-w-0">

          {/* Tab nav */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-gray-200/40 dark:border-slate-700/50">
            {([
              { id: "config",   label: "Thiết Lập", icon: "⚙️" },
              { id: "content",  label: "Nội Dung",  icon: "✍️" },
              { id: "audience", label: "Người Nhận", icon: "👥" },
              { id: "schedule", label: "Lập Lịch",  icon: "📅" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => c.setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 ${
                  c.activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="text-base sm:text-sm">{tab.icon}</span>
                <span className="text-[10px] sm:text-xs leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm min-h-[500px]">

            {/* ── TAB 1: Config ─────────────────────────────────────────── */}
            {c.activeTab === "config" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">⚙️</span>
                  Cấu hình chiến dịch Email
                </h3>

                {/* Subject + Preheader presets */}
                <div className="bg-orange-50/40 dark:bg-slate-800/40 border border-orange-100 dark:border-slate-700 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">Mẫu nhanh</span>
                    <span className="text-[11px] text-gray-500">click để áp dụng</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "🎁 Khuyến mãi tháng", subject: "🎁 Ưu đãi đặc biệt tháng này - Giảm tới 50%!", summary: "Mở khoá toàn bộ kho học liệu Premium với mức giá tốt nhất năm" },
                      { label: "🆕 Khoá học mới", subject: "🆕 Khoá học mới vừa lên sóng tại JavaBuilder", summary: "Khám phá lộ trình học tiếp theo do mentor hàng đầu xây dựng" },
                      { label: "🔧 Bảo trì hệ thống", subject: "🔧 Thông báo lịch bảo trì hệ thống nộp bài", summary: "Hệ thống chấm tự động tạm ngưng - vui lòng đọc chi tiết bên trong" },
                      { label: "👋 Quay lại học tập", subject: "👋 Lộ trình của bạn đang chờ - quay lại nhé!", summary: "Chỉ 15 phút mỗi ngày là đủ để duy trì đà học tập của bạn" },
                      { label: "📢 Cập nhật tính năng", subject: "✨ Tính năng mới vừa được ra mắt!", summary: "Cập nhật mới giúp việc học của bạn hiệu quả và mượt mà hơn" },
                      { label: "🎉 Sự kiện đặc biệt", subject: "🎉 Sự kiện đặc biệt từ JavaBuilder - đừng bỏ lỡ!", summary: "Workshop, livestream miễn phí và các phần quà giá trị đang chờ bạn" },
                      { label: "🙏 Cảm ơn cộng đồng", subject: "🙏 Cảm ơn bạn đã đồng hành cùng JavaBuilder!", summary: "Chúng tôi trân trọng sự tin tưởng của bạn — chúc bạn học tập vui vẻ" },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => { c.setSubject(p.subject); c.setPreheader(p.summary); }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-orange-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-slate-600 rounded-md transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Tiêu đề thư (Subject) <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={c.subject} onChange={(e) => c.setSubject(e.target.value)}
                      placeholder="VD: Cập nhật tài khoản Premium của bạn ngay hôm nay..."
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Nội dung tóm tắt (Preheader text)
                      </label>
                      <span className="text-xs text-gray-400 font-light hidden sm:block">Xuất hiện cạnh tiêu đề ở hộp thư</span>
                    </div>
                    <input type="text" value={c.preheader} onChange={(e) => c.setPreheader(e.target.value)}
                      placeholder="VD: Nhận ưu đãi lớn nhất trong năm từ cộng đồng JavaBuilder"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tên Người Gửi</label>
                      <input type="text" value={c.senderName} onChange={(e) => c.setSenderName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Người Gửi</label>
                      <input type="email" value={c.senderEmail} onChange={(e) => c.setSenderEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Phản Hồi (Reply-To)</label>
                    <input type="email" value={c.replyTo} onChange={(e) => c.setReplyTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={() => c.setActiveTab("content")}
                    className="px-5 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1">
                    <span>Tiếp tục soạn thư</span><span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: Content ────────────────────────────────────────── */}
            {c.activeTab === "content" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">✍️</span>
                    Soạn thảo Nội Dung
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium mr-1">Chèn tag:</span>
                    <button type="button" onClick={() => c.insertTag("{username}")}
                      className="px-2 py-1 text-[11px] bg-orange-100 hover:bg-orange-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-700 dark:text-orange-400 rounded font-semibold border border-orange-200 dark:border-slate-600 transition-colors">
                      {"{username}"}
                    </button>
                    <button type="button" onClick={() => c.insertTag("{email}")}
                      className="px-2 py-1 text-[11px] bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 rounded font-semibold border border-blue-200 dark:border-slate-600 transition-colors">
                      {"{email}"}
                    </button>
                  </div>
                </div>

                {/* Template picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 mb-2">
                    Chọn Mẫu Gửi Nhanh
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TEMPLATE_LIST.map((tpl) => {
                      const isSel = c.selectedTemplate === tpl.id;
                      return (
                        <button key={tpl.id} type="button" onClick={() => c.handleTemplateChange(tpl.id)}
                          className={`p-2.5 border rounded-xl flex flex-col items-center gap-1 justify-center transition-all ${
                            isSel
                              ? "border-accent bg-accent/5 dark:bg-accent/15 ring-2 ring-accent/20"
                              : "border-gray-200 dark:border-slate-800 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/30 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-xl">{tpl.emoji}</span>
                          <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 text-center leading-tight">{tpl.name}</span>
                          {tpl.customVars.length > 0 && (
                            <span className="text-[9px] text-amber-500 font-semibold">{tpl.customVars.length} biến</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HTML editor */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nội dung thư (HTML / Inline Styles)
                  </label>
                  <textarea value={c.content} onChange={(e) => c.setContent(e.target.value)}
                    placeholder="Viết mã HTML hoặc văn bản của email tại đây..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-xs font-mono resize-y" />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => c.setActiveTab("config")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all">
                    Quay lại
                  </button>
                  <button onClick={() => c.setActiveTab("audience")}
                    className="px-5 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1">
                    <span>Chọn Người Nhận</span><span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 3: Audience ───────────────────────────────────────── */}
            {c.activeTab === "audience" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">👥</span>
                  Cấu hình đối tượng nhận thư
                </h3>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Chọn nhóm đối tượng gửi</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { id: "all",      title: "Tất cả học viên",       desc: "Gửi đến toàn bộ người dùng trong hệ thống" },
                      { id: "premium",  title: "Thành viên Premium",     desc: "Gửi riêng tới những người đã mua gói học phí" },
                      { id: "inactive", title: "Chưa kích hoạt",         desc: "Học viên chưa xác thực hoặc lâu không hoạt động" },
                      { id: "custom",   title: "Người nhận tùy chọn",    desc: "Tìm kiếm và lựa chọn thủ công từng tài khoản" },
                    ] as const).map((seg) => (
                      <button key={seg.id} type="button" onClick={() => c.setTargetSegment(seg.id)}
                        className={`p-4 text-left border rounded-xl flex flex-col gap-1.5 transition-all ${
                          c.targetSegment === seg.id
                            ? "border-accent bg-accent/5 dark:bg-accent/15"
                            : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{seg.title}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-300">{seg.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {c.targetSegment === "custom" && (
                  <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-800 animate-slideDown">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="relative flex-1">
                        <input type="text" value={c.searchQuery} onChange={(e) => c.setSearchQuery(e.target.value)}
                          placeholder="Tìm kiếm theo username, email..."
                          className="w-full px-4 py-2 pl-10 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button type="button" onClick={c.handleSelectAll}
                        className="px-4 py-2 text-xs font-bold text-accent hover:bg-accent/5 border border-accent/20 rounded-xl transition-colors">
                        {c.selectedUsers.length === c.users.length && c.users.length > 0 ? "Bỏ chọn tất cả" : "Chọn toàn bộ"}
                      </button>
                    </div>
                    {c.selectedUsers.length > 0 && (
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                        Đã chọn: <span className="text-accent">{c.selectedUsers.length}</span> người nhận
                      </div>
                    )}
                    <div className="max-h-60 overflow-y-auto border border-gray-100 dark:border-slate-800 rounded-xl divide-y divide-gray-50 dark:divide-slate-800">
                      {c.isLoadingUsers ? (
                        <div className="p-6 text-center text-xs text-gray-400 animate-pulse">Đang tìm kiếm...</div>
                      ) : c.users.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">Không tìm thấy tài khoản nào</div>
                      ) : c.users.map((user) => {
                        const isSel = c.selectedUsers.includes(user.id);
                        return (
                          <div key={user.id} onClick={() => c.handleUserSelect(user.id)}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isSel ? "bg-accent/5" : "hover:bg-gray-50 dark:hover:bg-slate-800/30"}`}>
                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSel ? "bg-accent border-accent" : "border-gray-300 dark:border-slate-600"}`}>
                              {isSel && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-tr from-accent to-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.username}</div>
                              <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => c.setActiveTab("content")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all">
                    Quay lại
                  </button>
                  <button onClick={() => c.setActiveTab("schedule")}
                    className="px-5 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1">
                    <span>Thiết Lập Lịch</span><span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 4: Schedule ───────────────────────────────────────── */}
            {c.activeTab === "schedule" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">📅</span>
                  Lập lịch gửi thư & Mức độ ưu tiên
                </h3>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Thời gian chạy chiến dịch</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      { id: "now",      title: "Gửi ngay lập tức",      desc: "Email sẽ được chuyển sang hàng đợi gửi đi ngay" },
                      { id: "schedule", title: "Lên lịch gửi (Schedule)", desc: "Chọn thời gian cụ thể trong tương lai" },
                    ] as const).map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/30">
                        <input type="radio" checked={c.scheduleType === opt.id} onChange={() => c.setScheduleType(opt.id)}
                          className="w-4 h-4 text-accent border-gray-300 focus:ring-accent flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{opt.title}</div>
                          <div className="text-xs text-gray-400">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {c.scheduleType === "schedule" && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-slate-700/50 animate-slideDown">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1.5">Chọn Ngày Gửi</label>
                      <input type="date" value={c.scheduleDate} onChange={(e) => c.setScheduleDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1.5">Chọn Giờ Gửi</label>
                      <input type="time" value={c.scheduleTime} onChange={(e) => c.setScheduleTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Mức độ ưu tiên (Priority)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { value: "LOW",    label: "Thấp (Low)",    desc: "Xử lý sau khi hàng đợi trống" },
                      { value: "NORMAL", label: "Bình thường",   desc: "Tốc độ tiêu chuẩn" },
                      { value: "HIGH",   label: "Cao (High)",    desc: "Được ưu tiên đẩy lên đầu" },
                    ] as const).map((p) => (
                      <button key={p.value} type="button" onClick={() => c.setPriority(p.value)}
                        className={`p-3 border rounded-xl text-left transition-all ${
                          c.priority === p.value
                            ? "border-accent bg-accent/5 dark:bg-accent/15"
                            : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="text-xs font-bold text-gray-900 dark:text-white">{p.label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => c.setActiveTab("audience")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all">
                    Quay lại
                  </button>
                  <button onClick={() => c.handleSubmit()}
                    className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-accent/15">
                    <span>Lên lịch & Hoàn tất</span><span>✓</span>
                  </button>
                </div>
              </div>
            )}

          </div>{/* end tab panels */}
        </div>{/* end LEFT col */}

        {/* RIGHT: Live preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 min-w-0">
          <EmailPreviewPanel
            previewMode={c.previewMode}
            setPreviewMode={c.setPreviewMode}
            previewHtml={c.previewHtml}
            senderName={c.senderName}
            senderEmail={c.senderEmail}
            subject={c.subject}
            targetSegment={c.targetSegment}
            selectedUsersCount={c.selectedUsers.length}
            currentTemplateCfg={c.currentTemplateCfg}
            systemVarsDetected={c.systemVarsDetected}
            customVarValues={c.customVarValues}
            onCustomVarChange={c.handleCustomVarChange}
          />
        </div>

      </div>{/* end grid */}
    </div>
  );
}
