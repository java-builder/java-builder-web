// ─────────────────────────────────────────────────────────────────────────────
// System variables: backend injects automatically at send time.
// FE uses these only for preview with sample values — admin does NOT fill them.
// ─────────────────────────────────────────────────────────────────────────────
export const SYSTEM_VARS: Record<string, string> = {
  username: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
};

// ─────────────────────────────────────────────────────────────────────────────
// Template definitions
// ─────────────────────────────────────────────────────────────────────────────
export type TemplateId =
  | "empty"
  | "welcome"
  | "promotion"
  | "system-alert"
  | "re-engage"
  | "payment-success"
  | "new-course"
  | "renewal-reminder"
  | "course-completion";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  emoji: string;
  subject: string;
  preheader: string;
  /** Variables that admin must fill before sending (not system-injected) */
  customVars: string[];
  build: (vars: Record<string, string>) => string;
}

const LOGO_HEADER = `
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="display: inline-block; padding: 10px 16px; background-color: #fff7ed; border-radius: 12px;">
      <span style="font-size: 24px; font-weight: 800; color: #f97316; letter-spacing: -0.5px;">JavaBuilder</span>
    </div>
  </div>`;

const FOOTER = `
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <div style="text-align: center; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">© 2026 JavaBuilder Online. Mọi quyền được bảo lưu.</p>
  </div>`;

const WRAPPER = (inner: string) =>
  `<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">${inner}</div>`;

// ─────────────────────────────────────────────────────────────────────────────
// Individual template builders
// ─────────────────────────────────────────────────────────────────────────────
const buildWelcome = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; font-weight: 600;">Welcome Email</div>
  </div>
  <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 16px; text-align: center;">Chào mừng ${v.username} đến với hệ thống!</h2>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
    Xin chào <strong>${v.username}</strong>, cảm ơn bạn đã tin tưởng và đồng hành cùng <strong>JavaBuilder</strong>.
  </p>
  <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; font-weight: 600;">Một số bước khởi đầu:</h3>
    <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6; font-size: 14px;">
      <li style="margin-bottom: 8px;">Tham gia cộng đồng Q&A để thảo luận bài học.</li>
      <li style="margin-bottom: 8px;">Bắt đầu khóa học Java Core đầu tiên.</li>
      <li>Làm bài tập thực hành và kiểm tra kết quả chấm tự động.</li>
    </ul>
  </div>
  <div style="text-align: center; margin-bottom: 32px;">
    <a href="https://javabuilder.online/courses" style="background-color: #f97316; color: #fff; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 8px; display: inline-block;">Bắt Đầu Học Ngay</a>
  </div>${FOOTER}`);

const buildPromo = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="background: linear-gradient(135deg, #ffedd5 0%, #ffdbb5 100%); border-radius: 12px; padding: 32px 24px; text-align: center; margin-bottom: 30px;">
    <span style="background-color: #ea580c; color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Khuyến Mãi Đặc Biệt</span>
    <h2 style="color: #7c2d12; font-size: 26px; font-weight: 800; margin: 12px 0 8px 0;">GIẢM GIÁ ${v.discount_percent || "40"}% GÓI PREMIUM</h2>
    <p style="color: #9a3412; font-size: 15px; margin: 0;">Dành riêng cho ${v.username}</p>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">Xin chào <strong>${v.username}</strong>, nâng cấp gói Premium ngay để nhận đặc quyền không giới hạn.</p>
  <div style="margin-bottom: 30px;">
    <div style="display: flex; margin-bottom: 12px;"><span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span><span style="color: #475569; font-size: 14.5px;">Truy cập không giới hạn kho bài tập thuật toán & chấm tự động.</span></div>
    <div style="display: flex; margin-bottom: 12px;"><span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span><span style="color: #475569; font-size: 14.5px;">Mở khóa bộ câu hỏi phỏng vấn chuẩn doanh nghiệp.</span></div>
    <div style="display: flex;"><span style="color: #ea580c; margin-right: 8px; font-weight: bold;">✓</span><span style="color: #475569; font-size: 14.5px;">Ưu tiên Review mã nguồn bởi Mentor.</span></div>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="https://javabuilder.online/pricing" style="background-color: #ea580c; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Nâng Cấp Premium Ngay</a>
  </div>
  <p style="color: #94a3b8; font-size: 12px; text-align: center;">*Ưu đãi áp dụng giới hạn thời gian. Liên hệ support@javabuilder.online nếu cần hỗ trợ.</p>`);

const buildAlert = (v: Record<string, string>) =>
  WRAPPER(`
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="font-size: 20px; font-weight: 800; color: #dc2626;">🔔 JavaBuilder Alert</span>
  </div>
  <div style="border-left: 4px solid #dc2626; background-color: #fef2f2; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
    <h3 style="margin: 0 0 6px 0; color: #991b1b; font-size: 16px; font-weight: 700;">Thông báo bảo trì máy chủ biên dịch</h3>
    <p style="margin: 0; color: #b91c1c; font-size: 13.5px;">Hệ thống chấm bài tự động sẽ tạm thời ngoại tuyến.</p>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 20px;">Chào học viên <strong>${v.username}</strong>, hệ thống sẽ bảo trì kỹ thuật định kỳ. Trong thời gian này, tính năng nộp bài và chạy code sẽ không hoạt động.</p>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 0; font-weight: 600; color: #475569; width: 140px;">Thời gian bắt đầu:</td>
      <td style="padding: 10px 0; color: #0f172a;"><strong>${v.start_time || "01:00 AM (Chủ Nhật này)"}</strong></td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 0; font-weight: 600; color: #475569;">Thời gian kết thúc:</td>
      <td style="padding: 10px 0; color: #0f172a;"><strong>${v.end_time || "03:00 AM (Dự kiến 2 tiếng)"}</strong></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #475569;">Ảnh hưởng:</td>
      <td style="padding: 10px 0; color: #0f172a;">Không thể chạy thử hoặc nộp lời giải.</td>
    </tr>
  </table>
  <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8;">
    <p style="margin: 0;">Trân trọng,</p>
    <p style="margin: 4px 0 0 0; font-weight: bold; color: #64748b;">Đội ngũ Kỹ thuật JavaBuilder</p>
  </div>`);

const buildReEngage = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="font-size: 48px; margin-bottom: 12px;">👋</div>
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Bạn có nhớ lộ trình của mình không?</h2>
    <p style="color: #64748b; font-size: 14px; margin: 0;">Đã lâu rồi chúng tôi không thấy <strong>${v.username}</strong> ghé thăm 😊</p>
  </div>
  <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 12px; padding: 24px; margin-bottom: 28px; border: 1px solid #fed7aa;">
    <p style="color: #9a3412; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Bạn đang bỏ lỡ:</p>
    <div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="color: #ea580c; font-size: 16px; margin-right: 10px;">📚</span><span style="color: #7c2d12; font-size: 14px;">Các bài học mới được cập nhật trong khóa học của bạn</span></div>
    <div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="color: #ea580c; font-size: 16px; margin-right: 10px;">💬</span><span style="color: #7c2d12; font-size: 14px;">Câu hỏi và thảo luận mới trong cộng đồng Q&A</span></div>
    <div style="display: flex; align-items: center;"><span style="color: #ea580c; font-size: 16px; margin-right: 10px;">🏆</span><span style="color: #7c2d12; font-size: 14px;">Bài tập thực hành mới chờ bạn chinh phục</span></div>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 28px; text-align: center;">Chỉ cần <strong>15 phút mỗi ngày</strong> là đủ để duy trì đà học tập!</p>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="https://javabuilder.online/my-courses" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Tiếp Tục Học Ngay →</a>
  </div>${FOOTER}`);

const buildPaymentSuccess = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="font-size: 48px; margin-bottom: 12px;">💳</div>
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Thanh toán thành công!</h2>
    <p style="color: #64748b; font-size: 14px; margin: 0;">Cảm ơn <strong>${v.username}</strong> đã nâng cấp tài khoản Premium</p>
  </div>
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
    <p style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0;">Chi tiết đơn hàng</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; color: #64748b;">Gói dịch vụ:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 700; text-align: right;">Premium Member</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; color: #64748b;">Thời hạn:</td>
        <td style="padding: 10px 0; color: #0f172a; font-weight: 600; text-align: right;">${v.plan_duration || "1 tháng"}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #64748b;">Trạng thái:</td>
        <td style="padding: 10px 0; text-align: right;"><span style="background-color: #fff7ed; color: #ea580c; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 9999px;">✦ Đã kích hoạt</span></td>
      </tr>
    </table>
  </div>
  <div style="margin-bottom: 28px;">
    <p style="color: #475569; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Đặc quyền Premium đã được mở khóa:</p>
    <div style="display: flex; align-items: center; margin-bottom: 8px;"><span style="color: #f97316; margin-right: 8px; font-weight: bold; font-size: 16px;">✓</span><span style="color: #475569; font-size: 14px;">Toàn bộ bài tập thuật toán & chấm tự động nâng cao</span></div>
    <div style="display: flex; align-items: center; margin-bottom: 8px;"><span style="color: #f97316; margin-right: 8px; font-weight: bold; font-size: 16px;">✓</span><span style="color: #475569; font-size: 14px;">Bộ câu hỏi phỏng vấn chuẩn doanh nghiệp</span></div>
    <div style="display: flex; align-items: center;"><span style="color: #f97316; margin-right: 8px; font-weight: bold; font-size: 16px;">✓</span><span style="color: #475569; font-size: 14px;">Ưu tiên review code bởi Mentor</span></div>
  </div>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="https://javabuilder.online/my-courses" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Khám Phá Ngay</a>
  </div>
  <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.5;">
    Cần hỗ trợ về hóa đơn? Liên hệ <a href="mailto:support@javabuilder.online" style="color: #f97316;">support@javabuilder.online</a><br/>© 2026 JavaBuilder Online.
  </p>`);

const buildNewCourse = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 14px; padding: 32px 24px; text-align: center; margin-bottom: 28px;">
    <div style="font-size: 11px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">🆕 Khóa Học Mới Ra Mắt</div>
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 10px 0; line-height: 1.3;">${v.course_name || "Spring Boot Microservices từ Zero đến Production"}</h2>
    <p style="color: #94a3b8; font-size: 14px; margin: 0;">Dành riêng cho ${v.username} và cộng đồng JavaBuilder</p>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 20px;">Xin chào <strong>${v.username}</strong>, khóa học được cộng đồng chờ đợi nhất đã chính thức ra mắt!</p>
  <div style="margin-bottom: 28px;">
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
      <span style="font-size: 20px; flex-shrink: 0;">🏗️</span>
      <div><div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">Kiến trúc Microservices thực tế</div><div style="font-size: 13px; color: #64748b;">Service Discovery, API Gateway, Load Balancing</div></div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px;">
      <span style="font-size: 20px; flex-shrink: 0;">🐳</span>
      <div><div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">Docker & Kubernetes deployment</div><div style="font-size: 13px; color: #64748b;">Containerize và deploy lên cloud thực tế</div></div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
      <span style="font-size: 20px; flex-shrink: 0;">📨</span>
      <div><div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">Kafka & Event-Driven Architecture</div><div style="font-size: 13px; color: #64748b;">Xử lý bất đồng bộ, Saga Pattern</div></div>
    </div>
  </div>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="${v.course_url || "https://javabuilder.online/courses"}" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Xem Khóa Học Ngay →</a>
  </div>${FOOTER}`);

const buildRenewalReminder = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="border: 2px solid #fbbf24; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; text-align: center;">
    <div style="font-size: 36px; margin-bottom: 8px;">⏰</div>
    <h2 style="color: #92400e; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">Gói Premium sắp hết hạn!</h2>
    <p style="color: #b45309; font-size: 14px; margin: 0;">Còn <strong>${v.days_left || "7"} ngày</strong> trước khi tài khoản của <strong>${v.username}</strong> trở về Free</p>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 20px;">Xin chào <strong>${v.username}</strong>, gia hạn ngay để không bị gián đoạn hành trình học tập!</p>
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
    <p style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0;">Bạn sẽ mất quyền truy cập vào:</p>
    <div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="color: #dc2626; margin-right: 10px; font-size: 16px;">✗</span><span style="color: #475569; font-size: 14px;">Kho bài tập thuật toán nâng cao & chấm tự động</span></div>
    <div style="display: flex; align-items: center; margin-bottom: 10px;"><span style="color: #dc2626; margin-right: 10px; font-size: 16px;">✗</span><span style="color: #475569; font-size: 14px;">Bộ câu hỏi phỏng vấn chuẩn doanh nghiệp</span></div>
    <div style="display: flex; align-items: center;"><span style="color: #dc2626; margin-right: 10px; font-size: 16px;">✗</span><span style="color: #475569; font-size: 14px;">Ưu tiên review code bởi Mentor</span></div>
  </div>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="https://javabuilder.online/pricing" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Gia Hạn Premium Ngay</a>
  </div>${FOOTER}`);

const buildCourseCompletion = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="font-size: 56px; margin-bottom: 12px;">🎉</div>
    <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">Chúc mừng ${v.username}!</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0;">Bạn đã hoàn thành khóa học thành công</p>
  </div>
  <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #fed7aa; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 28px;">
    <div style="font-size: 13px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">🏆 Chứng Chỉ Hoàn Thành</div>
    <div style="font-size: 20px; font-weight: 800; color: #7c2d12; margin-bottom: 4px;">${v.course_name || "Java Core Fundamentals"}</div>
    <div style="font-size: 13px; color: #9a3412;">Cấp bởi JavaBuilder · 2026</div>
  </div>
  <p style="color: #475569; line-height: 1.7; font-size: 15px; margin-bottom: 20px;">Sự kiên trì và nỗ lực của <strong>${v.username}</strong> thực sự đáng được ghi nhận!</p>
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 28px; border: 1px solid #e2e8f0;">
    <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Bước tiếp theo trong lộ trình:</p>
    <div style="display: flex; align-items: flex-start; margin-bottom: 10px;"><span style="color: #f97316; margin-right: 10px; font-size: 16px; flex-shrink: 0;">→</span><span style="color: #475569; font-size: 14px;">Tiếp tục với <strong>Spring Boot Fundamentals</strong> để xây dựng REST API</span></div>
    <div style="display: flex; align-items: flex-start; margin-bottom: 10px;"><span style="color: #f97316; margin-right: 10px; font-size: 16px; flex-shrink: 0;">→</span><span style="color: #475569; font-size: 14px;">Luyện tập với <strong>bài tập thuật toán</strong> để chuẩn bị phỏng vấn</span></div>
    <div style="display: flex; align-items: flex-start;"><span style="color: #f97316; margin-right: 10px; font-size: 16px; flex-shrink: 0;">→</span><span style="color: #475569; font-size: 14px;">Chia sẻ thành tích lên <strong>LinkedIn</strong> để tăng cơ hội việc làm</span></div>
  </div>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="https://javabuilder.online/courses" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Khóa Học Tiếp Theo</a>
  </div>${FOOTER}`);

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE_LIST — single source of truth for all templates
// customVars: variables admin must fill (system vars like username/email excluded)
// ─────────────────────────────────────────────────────────────────────────────
export const TEMPLATE_LIST: TemplateConfig[] = [
  {
    id: "empty",
    name: "Trang Trắng",
    emoji: "📄",
    subject: "",
    preheader: "",
    customVars: [],
    build: () => "<p>Bắt đầu viết nội dung thư của bạn ở đây...</p>",
  },
  {
    id: "welcome",
    name: "Chào Mừng",
    emoji: "👋",
    subject: "Chào mừng bạn đã tham gia JavaBuilder!",
    preheader: "Nhận lộ trình học Backend Java chuyên nghiệp tại JavaBuilder",
    customVars: [],
    build: buildWelcome,
  },
  {
    id: "promotion",
    name: "Khuyến Mãi",
    emoji: "🎁",
    subject: "Nhận Ưu đãi Đặc biệt Gói Premium",
    preheader: "Mở khoá bài tập thuật toán nâng cao, câu hỏi phỏng vấn chuẩn doanh nghiệp",
    customVars: ["discount_percent"],
    build: buildPromo,
  },
  {
    id: "system-alert",
    name: "Bảo Trì",
    emoji: "🚨",
    subject: "[Thông Báo] Lịch Bảo trì định kỳ Máy chủ nộp bài",
    preheader: "Thời gian bảo trì dự kiến: 2 tiếng Chủ Nhật tuần này",
    customVars: ["start_time", "end_time"],
    build: buildAlert,
  },
  {
    id: "re-engage",
    name: "Nhắc Học Tập",
    emoji: "📚",
    subject: "Bạn có nhớ lộ trình Java của mình không? 👋",
    preheader: "Chỉ 15 phút mỗi ngày là đủ để duy trì đà học tập",
    customVars: [],
    build: buildReEngage,
  },
  {
    id: "payment-success",
    name: "Thanh Toán OK",
    emoji: "💳",
    subject: "Thanh toán thành công - Tài khoản Premium đã được kích hoạt!",
    preheader: "Chào mừng bạn gia nhập hội Premium Member của JavaBuilder",
    customVars: ["plan_duration"],
    build: buildPaymentSuccess,
  },
  {
    id: "new-course",
    name: "Khóa Học Mới",
    emoji: "🆕",
    subject: "[Mới] Khóa học mới vừa ra mắt tại JavaBuilder",
    preheader: "Khóa học được cộng đồng chờ đợi nhất đã chính thức ra mắt",
    customVars: ["course_name", "course_url"],
    build: buildNewCourse,
  },
  {
    id: "renewal-reminder",
    name: "Nhắc Gia Hạn",
    emoji: "⏰",
    subject: "⏰ Gói Premium của bạn sắp hết hạn - Gia hạn ngay!",
    preheader: "Còn 7 ngày trước khi tài khoản trở về Free",
    customVars: ["days_left"],
    build: buildRenewalReminder,
  },
  {
    id: "course-completion",
    name: "Hoàn Thành KH",
    emoji: "🎉",
    subject: "🎉 Chúc mừng! Bạn đã hoàn thành khóa học thành công",
    preheader: "Nhận chứng chỉ và khám phá bước tiếp theo trong lộ trình",
    customVars: ["course_name"],
    build: buildCourseCompletion,
  },
];
