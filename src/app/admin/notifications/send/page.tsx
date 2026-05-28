"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";

// Default template HTML generators
const welcomeTemplate = (username: string) => `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; padding: 12px; background-color: #fff7ed; border-radius: 12px; margin-bottom: 8px;">
      <span style="font-size: 28px; font-weight: 800; color: #f97316; letter-spacing: -0.5px;">JavaBuilder</span>
    </div>
    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600;">Welcome Email</div>
  </div>
  
  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 16px; text-align: center;">Chào mừng ${username} đến với hệ thống!</h2>
  
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
    Xin chào <strong>${username}</strong>, cảm ơn bạn đã tin tưởng và đồng hành cùng <strong>JavaBuilder</strong> - Nền tảng học lập trình Java Backend chuyên sâu. Lộ trình chinh phục Java Developer của bạn đã sẵn sàng bắt đầu!
  </p>
  
  <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: 600;">Một số bước khởi đầu cho bạn:</h3>
    <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6; font-size: 14px;">
      <li style="margin-bottom: 8px;">Tham gia cộng đồng Q&A để cùng thảo luận bài học.</li>
      <li style="margin-bottom: 8px;">Bắt đầu khóa học Java Core đầu tiên trong danh sách.</li>
      <li style="margin-bottom: 0;">Làm bài tập thực hành và kiểm tra kết quả chấm tự động.</li>
    </ul>
  </div>
  
  <div style="text-align: center; margin-bottom: 32px;">
    <a href="https://javabuilder.online/courses" style="background-color: #f97316; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: background-color 0.2s;">Bắt Đầu Học Ngay</a>
  </div>
  
  <p style="color: #64748b; line-height: 1.7; font-size: 14px; margin-bottom: 30px; text-align: center;">
    Nếu bạn có bất kỳ khó khăn nào, đừng ngần ngại gửi câu hỏi tại trang hỗ trợ hoặc phản hồi trực tiếp email này. Mentor sẽ hỗ trợ bạn sớm nhất!
  </p>
  
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
  
  <div style="text-align: center; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">Bạn nhận được email này vì đã đăng ký tài khoản tại JavaBuilder.</p>
    <p style="margin: 0;">© 2026 JavaBuilder Online. Mọi quyền được bảo lưu.</p>
  </div>
</div>
`;

const promoTemplate = (username: string) => `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-size: 24px; font-weight: 800; color: #f97316; letter-spacing: -0.5px;">JavaBuilder</span>
  </div>

  <div style="background: linear-gradient(135deg, #ffedd5 0%, #ffdbb5 100%); border-radius: 12px; padding: 32px 24px; text-align: center; margin-bottom: 30px;">
    <span style="background-color: #ea580c; color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Khuyến Mãi Đặc Biệt</span>
    <h2 style="color: #7c2d12; font-size: 26px; font-weight: 800; margin: 12px 0 8px 0;">GIẢM GIÁ 40% GÓI PREMIUM</h2>
    <p style="color: #9a3412; font-size: 15px; margin: 0; font-weight: 500;">Bứt phá kỹ năng lập trình dành riêng cho ${username}</p>
  </div>

  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
    Xin chào <strong>${username}</strong>, bạn muốn làm chủ kỹ năng làm việc thực tế và nâng cấp sự nghiệp Java Backend của mình nhanh nhất?
  </p>
  
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
    Đăng ký nâng cấp gói **Premium Member** ngay hôm nay để nhận các đặc quyền không giới hạn:
  </p>

  <div style="margin-bottom: 30px;">
    <div style="display: flex; margin-bottom: 12px; align-items: flex-start;">
      <span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span>
      <span style="color: #475569; font-size: 14.5px;">Truy cập không giới hạn kho bài tập thuật toán & hệ thống chấm tự động nâng cao.</span>
    </div>
    <div style="display: flex; margin-bottom: 12px; align-items: flex-start;">
      <span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span>
      <span style="color: #475569; font-size: 14.5px;">Mở khóa bộ câu hỏi phỏng vấn chuẩn doanh nghiệp thực tế.</span>
    </div>
    <div style="display: flex; align-items: flex-start;">
      <span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span>
      <span style="color: #475569; font-size: 14.5px;">Được ưu tiên Review mã nguồn bởi đội ngũ Mentor giàu kinh nghiệm.</span>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="https://javabuilder.online/pricing" style="background-color: #ea580c; color: #ffffff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);">Nâng Cấp Premium Ngay</a>
  </div>

  <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5; margin-top: 30px;">
    *Ưu đãi áp dụng giới hạn thời gian. Liên hệ support@javabuilder.online nếu bạn cần hỗ trợ xuất hóa đơn hoặc thanh toán doanh nghiệp.
  </p>
</div>
`;

const alertTemplate = (username: string) => `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="font-size: 20px; font-weight: 800; color: #dc2626; letter-spacing: -0.5px;">🔔 JavaBuilder Alert</span>
  </div>

  <div style="border-left: 4px solid #dc2626; background-color: #fef2f2; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
    <h3 style="margin: 0 0 6px 0; color: #991b1b; font-size: 16px; font-weight: 700;">Thông báo bảo trì máy chủ biên dịch</h3>
    <p style="margin: 0; color: #b91c1c; font-size: 13.5px;">Hệ thống chấm bài tự động sẽ tạm thời ngoại tuyến.</p>
  </div>

  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 16px;">
    Chào học viên <strong>${username}</strong>,
  </p>

  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 20px;">
    Để nâng cấp khả năng xử lý của máy chủ chấm mã nguồn Java tự động, hệ thống sẽ thực hiện bảo trì kỹ thuật định kỳ. Trong thời gian bảo trì, các tính năng nộp bài, chạy code trực tuyến sẽ không hoạt động.
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 0; font-weight: 600; color: #475569; width: 140px;">Thời gian bắt đầu:</td>
      <td style="padding: 10px 0; color: #0f172a;"><strong>01:00 AM (Chủ Nhật này)</strong></td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 0; font-weight: 600; color: #475569;">Thời gian kết thúc:</td>
      <td style="padding: 10px 0; color: #0f172a;"><strong>03:00 AM (Dự kiến 2 tiếng)</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #475569;">Ảnh hưởng:</td>
      <td style="padding: 10px 0; color: #0f172a;">Không thể chạy thử hoặc nộp lời giải.</td>
    </tr>
  </table>

  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
    Các khóa học lý thuyết, diễn đàn hỏi đáp và thông tin hồ sơ của bạn vẫn hoạt động bình thường. Cảm ơn sự thông cảm và hợp tác của bạn!
  </p>

  <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">Trân trọng,</p>
    <p style="margin: 4px 0 0 0; font-weight: bold; color: #64748b;">Đội ngũ Kỹ thuật JavaBuilder</p>
  </div>
</div>
`;

export default function SendNotificationPage() {
  const [activeTab, setActiveTab] = useState<"config" | "content" | "audience" | "schedule">("config");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<"empty" | "welcome" | "promotion" | "system-alert">("empty");
  
  // Basic Settings
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [senderName, setSenderName] = useState("JavaBuilder Support");
  const [senderEmail, setSenderEmail] = useState("noreply@javabuilder.online");
  const [replyTo, setReplyTo] = useState("support@javabuilder.online");

  // Content
  const [content, setContent] = useState("");

  // Target Segment
  const [targetSegment, setTargetSegment] = useState<"all" | "premium" | "inactive" | "custom">("all");
  
  // Custom Users List
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Delivery Setting
  const [scheduleType, setScheduleType] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [priority, setPriority] = useState<"HIGH" | "NORMAL" | "LOW">("NORMAL");
  const [isSending, setIsSending] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setUsers([]);
      setIsLoadingUsers(false);
      return;
    }
    setIsLoadingUsers(true);
    try {
      const res = await userApi.search({
        page: 1,
        search: debouncedSearchQuery.trim(),
      });
      setUsers(res.data?.data || []);
    } catch {
      // Offline fallback mock data for testing UI without API errors
      const allMockUsers = [
        { id: "1", username: "alex_java", email: "alex.java@gmail.com", active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "2", username: "tranthib", email: "b.tranthi@outlook.com", active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "3", username: "mentor_duc", email: "duc.le@javabuilder.online", active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "4", username: "premium_user", email: "premium.dev@gmail.com", active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
      ] as unknown as UserDetailResponse[];
      const query = debouncedSearchQuery.toLowerCase();
      setUsers(allMockUsers.filter(u => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)));
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  // Change Template logic
  const handleTemplateChange = (template: typeof selectedTemplate) => {
    setSelectedTemplate(template);
    if (template === "empty") {
      setSubject("");
      setPreheader("");
      setContent("<p>Bắt đầu viết nội dung thư của bạn ở đây...</p>");
    } else if (template === "welcome") {
      setSubject("Chào mừng bạn đã tham gia JavaBuilder!");
      setPreheader("Nhận lộ trình học Backend Java chuyên nghiệp tại JavaBuilder");
      setContent(welcomeTemplate("{username}"));
    } else if (template === "promotion") {
      setSubject("Nhận Ưu đãi Đặc biệt 40% Gói Premium");
      setPreheader("Mở khoá bài tập thuật toán nâng cao, câu hỏi phỏng vấn chuẩn doanh nghiệp");
      setContent(promoTemplate("{username}"));
    } else if (template === "system-alert") {
      setSubject("[Thông Báo] Lịch Bảo trì định kỳ Máy chủ nộp bài");
      setPreheader("Thời gian bảo trì dự kiến: 2 tiếng Chủ Nhật tuần này");
      setContent(alertTemplate("{username}"));
    }
  };

  const insertTag = (tag: string) => {
    setContent((prev) => prev + ` ${tag} `);
    toast.success(`Đã thêm thẻ ${tag}`);
  };

  // Live personalized Preview generator
  const getPersonalizedPreviewHtml = () => {
    if (!content) return "<p style='color:#94a3b8; text-align:center; padding: 40px;'>Nội dung thư rỗng</p>";
    return content.replace(/{username}/g, "Nguyễn Văn A").replace(/{email}/g, "nguyenvana@gmail.com");
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Vui lòng nhập Tiêu đề Email");
      setActiveTab("config");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng soạn Thư nội dung");
      setActiveTab("content");
      return;
    }
    if (targetSegment === "custom" && selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 người nhận");
      setActiveTab("audience");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const targetText =
        targetSegment === "all"
          ? "tất cả thành viên"
          : targetSegment === "premium"
          ? "thành viên Premium"
          : targetSegment === "inactive"
          ? "thành viên chưa kích hoạt"
          : `${selectedUsers.length} người nhận đã chọn`;

      const scheduleText =
        scheduleType === "now"
          ? "Gửi ngay lập tức"
          : `Lên lịch vào lúc ${scheduleTime} ngày ${scheduleDate}`;

      toast.success(`Bắt đầu chạy chiến dịch gửi Email thành công!\nĐối tượng: ${targetText}\nLên lịch: ${scheduleText}`);
    }, 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-5">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Gửi Chiến Dịch Email Marketing
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Thiết kế mẫu, lựa chọn phân khúc người dùng và lập lịch gửi email chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Quick Send Options */}
        <div className="flex items-center gap-2">

          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-full sm:w-auto px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSending ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gửi Chiến Dịch
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tab buttons */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-gray-200/40 dark:border-slate-700/50">
            {[
              { id: "config", label: "Thiết Lập Chung", icon: "⚙️" },
              { id: "content", label: "Nội Dung Thư", icon: "✍️" },
              { id: "audience", label: "Người Nhận", icon: "👥" },
              { id: "schedule", label: "Lập Lịch Gửi", icon: "📅" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isActive
                      ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md font-bold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form settings wrapper */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm min-h-[500px]">
            
            {/* TAB 1: Config */}
            {activeTab === "config" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">⚙️</span>
                  Cấu hình chiến dịch Email
                </h3>

                <div className="space-y-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Tiêu đề thư (Subject) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="VD: Cập nhật tài khoản Premium của bạn ngay hôm nay..."
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium"
                    />
                  </div>

                  {/* Preheader */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                      <span>Nội dung tóm tắt (Preheader text)</span>
                      <span className="text-xs text-gray-400 font-light">Xuất hiện cạnh tiêu đề ở hộp thư</span>
                    </label>
                    <input
                      type="text"
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      placeholder="VD: Nhận ưu đãi lớn nhất trong năm từ cộng đồng JavaBuilder"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium"
                    />
                  </div>

                  {/* Sender Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tên Người Gửi (Sender Name)
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Người Gửi (Sender Email)
                      </label>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Reply To */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Phản Hồi (Reply-To)
                    </label>
                    <input
                      type="email"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveTab("content")}
                    className="px-5 py-2 bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1"
                  >
                    <span>Tiếp tục soạn thư</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Content & Templates */}
            {activeTab === "content" && (
              <div className="space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">✍️</span>
                    Soạn thảo Nội Dung
                  </h3>

                  {/* Merge tags buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium mr-1">Chèn tag nhanh:</span>
                    <button
                      type="button"
                      onClick={() => insertTag("{username}")}
                      className="px-2 py-1 text-[11px] bg-orange-100 hover:bg-orange-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-orange-700 dark:text-orange-400 rounded font-semibold border border-orange-200 dark:border-slate-600 transition-colors"
                    >
                      Tên user ({`{username}`})
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("{email}")}
                      className="px-2 py-1 text-[11px] bg-blue-100 hover:bg-blue-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-400 rounded font-semibold border border-blue-200 dark:border-slate-600 transition-colors"
                    >
                      Email ({`{email}`})
                    </button>
                  </div>
                </div>

                {/* Pick templates slider */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Chọn Mẫu Gửi Nhanh (Templates)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "empty", name: "Trang Trắng", emoji: "📄" },
                      { id: "welcome", name: "Mẫu Chào Mừng", emoji: "👋" },
                      { id: "promotion", name: "Mẫu Khuyến Mãi", emoji: "🎁" },
                      { id: "system-alert", name: "Mẫu Bảo Trì", emoji: "🚨" }
                    ].map((tpl) => {
                      const isSel = selectedTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => handleTemplateChange(tpl.id as typeof selectedTemplate)}
                          className={`p-3 border rounded-xl flex flex-col items-center gap-1.5 justify-center transition-all ${
                            isSel
                              ? "border-accent bg-accent/5 dark:bg-accent/15 ring-2 ring-accent/20"
                              : "border-gray-200 dark:border-slate-800 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/30 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-xl">{tpl.emoji}</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{tpl.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rich content text area */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nội dung thư (Hỗ trợ định dạng HTML/Inline Styles)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Viết mã HTML hoặc văn bản của email tại đây..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-xs font-mono line-clamp-none resize-y"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setActiveTab("config")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => setActiveTab("audience")}
                    className="px-5 py-2 bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1"
                  >
                    <span>Chọn Người Nhận</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Audience Selector */}
            {activeTab === "audience" && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">👥</span>
                  Cấu hình đối tượng nhận thư
                </h3>

                {/* Select segment options */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Chọn nhóm đối tượng gửi
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "all", title: "Tất cả học viên", desc: "Gửi đến toàn bộ người dùng trong hệ thống" },
                      { id: "premium", title: "Thành viên Premium", desc: "Gửi riêng tới những người đã mua gói học phí" },
                      { id: "inactive", title: "Chưa kích hoạt", desc: "Học viên chưa xác thực tài khoản hoặc lâu không hoạt động" },
                      { id: "custom", title: "Người nhận tùy chọn", desc: "Tìm kiếm và lựa chọn thủ công từng tài khoản" }
                    ].map((seg) => {
                      const isSel = targetSegment === seg.id;
                      return (
                        <button
                          key={seg.id}
                          type="button"
                          onClick={() => setTargetSegment(seg.id as typeof targetSegment)}
                          className={`p-4 text-left border rounded-xl flex flex-col gap-1.5 transition-all ${
                            isSel
                              ? "border-accent bg-accent/5 dark:bg-accent/15"
                              : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <span className="font-bold text-sm text-gray-900 dark:text-white">{seg.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{seg.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Show custom list selection */}
                {targetSegment === "custom" && (
                  <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-slate-800 animate-slideDown">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Tìm kiếm theo username, email..."
                          className="w-full px-4 py-2 pl-10 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                        />
                        <svg
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-4 py-2 text-xs font-bold text-accent hover:bg-accent/5 border border-accent/20 rounded-xl transition-colors"
                      >
                        {selectedUsers.length === users.length && users.length > 0
                          ? "Bỏ chọn tất cả"
                          : "Chọn toàn bộ"}
                      </button>
                    </div>

                    {selectedUsers.length > 0 && (
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Đã chọn: <span className="text-accent">{selectedUsers.length}</span> người nhận
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto border border-gray-100 dark:border-slate-800 rounded-xl divide-y divide-gray-50 dark:divide-slate-800">
                      {isLoadingUsers ? (
                        <div className="p-6 text-center text-xs text-gray-400 animate-pulse">Đang tìm kiếm...</div>
                      ) : users.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">Không tìm thấy tài khoản người dùng nào</div>
                      ) : (
                        users.map((user) => {
                          const isSel = selectedUsers.includes(user.id);
                          return (
                            <div
                              key={user.id}
                              onClick={() => handleUserSelect(user.id)}
                              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                                isSel ? "bg-accent/5" : "hover:bg-gray-50 dark:hover:bg-slate-800/30"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSel ? "bg-accent border-accent" : "border-gray-300 dark:border-slate-600"
                              }`}>
                                {isSel && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
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
                        })
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setActiveTab("content")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => setActiveTab("schedule")}
                    className="px-5 py-2 bg-gray-900 dark:bg-slate-800 hover:bg-gray-800 dark:hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-1"
                  >
                    <span>Thiết Lập Lịch</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: Scheduling & Delivery */}
            {activeTab === "schedule" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="p-1.5 bg-orange-50 dark:bg-slate-800 rounded-lg text-sm">📅</span>
                  Lập lịch gửi thư & Mức độ ưu tiên
                </h3>

                {/* Send Option */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thời gian chạy chiến dịch
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/30">
                      <input
                        type="radio"
                        checked={scheduleType === "now"}
                        onChange={() => setScheduleType("now")}
                        className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">Gửi ngay lập tức</div>
                        <div className="text-xs text-gray-400">Email sẽ được chuyển sang hàng đợi gửi đi ngay</div>
                      </div>
                    </label>
                    <label className="flex-1 flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/30">
                      <input
                        type="radio"
                        checked={scheduleType === "schedule"}
                        onChange={() => setScheduleType("schedule")}
                        className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">Lên lịch gửi (Schedule)</div>
                        <div className="text-xs text-gray-400">Chọn thời gian cụ thể trong tương lai</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Show Date Time inputs if Scheduled */}
                {scheduleType === "schedule" && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-200/50 dark:border-slate-700/50 animate-slideDown">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Chọn Ngày Gửi</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Chọn Giờ Gửi</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Sending Priority */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mức độ ưu tiên xử lý hàng đợi (Priority)
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "LOW", label: "Thấp (Low)", desc: "Xử lý sau khi hàng đợi trống" },
                      { value: "NORMAL", label: "Bình thường (Normal)", desc: "Tốc độ tiêu chuẩn" },
                      { value: "HIGH", label: "Cao (High)", desc: "Được ưu tiên đẩy lên đầu" }
                    ].map((p) => {
                      const isSel = priority === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value as typeof priority)}
                          className={`flex-1 p-3 border rounded-xl text-left transition-all ${
                            isSel
                              ? "border-accent bg-accent/5 dark:bg-accent/15"
                              : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{p.label}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 leading-snug">{p.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setActiveTab("audience")}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-sm font-bold rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md shadow-accent/15"
                  >
                    <span>Lên lịch & Hoàn tất</span>
                    <span>✓</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Responsive Preview (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            
            {/* Header: Title and Preview toggle */}
            <div className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                Xem Trước Email (Live Preview)
              </h3>
              
              <div className="flex bg-gray-200 dark:bg-slate-700/60 p-0.5 rounded-lg border border-gray-300/40 dark:border-slate-600/50">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-1.5 rounded-md transition-all ${
                    previewMode === "desktop"
                      ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  title="Giao diện máy tính"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-1.5 rounded-md transition-all ${
                    previewMode === "mobile"
                      ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                  title="Giao diện di động"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Email client Header Simulation */}
            <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex border-b border-gray-100/50 dark:border-slate-800/50 pb-2">
                <span className="text-gray-400 font-medium w-14 flex-shrink-0">Từ:</span>
                <span className="text-gray-700 dark:text-gray-300 font-bold truncate">
                  {senderName || "JavaBuilder"} &lt;{senderEmail || "noreply@javabuilder.online"}&gt;
                </span>
              </div>
              <div className="flex border-b border-gray-100/50 dark:border-slate-800/50 pb-2">
                <span className="text-gray-400 font-medium w-14 flex-shrink-0">Đến:</span>
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {targetSegment === "custom"
                    ? `${selectedUsers.length} tài khoản đã chọn...`
                    : targetSegment === "premium"
                    ? "Tất cả học viên Premium"
                    : targetSegment === "inactive"
                    ? "Tất cả tài khoản chưa kích hoạt"
                    : "Toàn bộ thành viên JavaBuilder"}
                </span>
              </div>
              <div className="flex pb-1">
                <span className="text-gray-400 font-medium w-14 flex-shrink-0">Tiêu đề:</span>
                <span className="text-gray-900 dark:text-white font-extrabold truncate">{subject || "(Chưa nhập tiêu đề)"}</span>
              </div>
            </div>

            {/* Simulated Frame view */}
            <div className="p-4 bg-gray-100 dark:bg-slate-950 flex justify-center items-start overflow-x-hidden min-h-[460px] max-h-[600px] overflow-y-auto">
              <div
                className={`bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden transition-all duration-300 ${
                  previewMode === "mobile" ? "w-[360px]" : "w-full"
                }`}
              >
                {/* HTML Render container */}
                <div
                  className="p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none text-xs leading-normal"
                  dangerouslySetInnerHTML={{ __html: getPersonalizedPreviewHtml() }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
