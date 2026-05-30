export const SYSTEM_VARS: Record<string, string> = {
  username: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
};

export type TemplateId =
  | "empty"
  | "promotion"
  | "system-alert"
  | "re-engage"
  | "new-course"
  | "thank-you";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  emoji: string;
  subject: string;
  preheader: string;
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

const buildPromo = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="background: linear-gradient(135deg, #ffedd5 0%, #ffdbb5 100%); border-radius: 12px; padding: 32px 24px; text-align: center; margin-bottom: 30px;">
    <span style="background-color: #ea580c; color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px;">Khuyến Mãi Đặc Biệt</span>
    <h2 style="color: #7c2d12; font-size: 26px; font-weight: 800; margin: 12px 0 8px 0;">GIẢM GIÁ ${v.discountPercent || "40"}% GÓI PREMIUM</h2>
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
      <td style="padding: 10px 0; color: #0f172a;"><strong>${v.startTime || "01:00 AM (Chủ Nhật này)"}</strong></td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 0; font-weight: 600; color: #475569;">Thời gian kết thúc:</td>
      <td style="padding: 10px 0; color: #0f172a;"><strong>${v.endTime || "03:00 AM (Dự kiến 2 tiếng)"}</strong></td>
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

const buildNewCourse = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 14px; padding: 32px 24px; text-align: center; margin-bottom: 28px;">
    <div style="font-size: 11px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">🆕 Khóa Học Mới Ra Mắt</div>
    <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 10px 0; line-height: 1.3;">${v.courseName || "Spring Boot Microservices từ Zero đến Production"}</h2>
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
    <a href="https://javabuilder.online/courses/${v.courseSlug || ""}" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Xem Khóa Học Ngay →</a>
  </div>${FOOTER}`);

const buildThankYou = (v: Record<string, string>) =>
  WRAPPER(`${LOGO_HEADER}
  <div style="text-align: center; margin-bottom: 28px;">
    <div style="font-size: 52px; margin-bottom: 12px;">🙏</div>
    <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 8px 0;">Cảm ơn bạn đã đồng hành!</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0;">Xin chào <strong>${v.username}</strong>, chúng tôi trân trọng sự tin tưởng của bạn</p>
  </div>
  <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-radius: 14px; padding: 28px 24px; margin-bottom: 28px; border: 1px solid #fed7aa;">
    <p style="color: #7c2d12; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">
      Cảm ơn bạn đã tin tưởng và sử dụng <strong>JavaBuilder</strong> — nền tảng học lập trình Java chuyên nghiệp.
      Sự đồng hành của bạn là động lực lớn nhất để chúng tôi không ngừng cải thiện và phát triển.
    </p>
    <p style="color: #9a3412; font-size: 14px; margin: 0;">
      Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua email
      <a href="mailto:support@javabuilder.online" style="color: #f97316; font-weight: 600;">support@javabuilder.online</a>.
      Chúng tôi luôn sẵn sàng lắng nghe!
    </p>
  </div>
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; border: 1px solid #e2e8f0; text-align: center;">
    <p style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0 0 6px 0;">🎓 Chúc bạn học tập vui vẻ!</p>
    <p style="color: #64748b; font-size: 14px; margin: 0;">Mỗi dòng code bạn viết hôm nay là một bước tiến trên con đường trở thành lập trình viên chuyên nghiệp.</p>
  </div>
  <div style="text-align: center; margin-bottom: 28px;">
    <a href="https://javabuilder.online/courses" style="background-color: #f97316; color: #fff; padding: 14px 32px; text-decoration: none; font-weight: 700; border-radius: 8px; display: inline-block;">Tiếp Tục Học Ngay →</a>
  </div>${FOOTER}`);

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
    id: "thank-you",
    name: "Cảm Ơn",
    emoji: "🙏",
    subject: "🙏 Cảm ơn bạn đã đồng hành cùng JavaBuilder!",
    preheader: "Chúng tôi trân trọng sự tin tưởng của bạn — chúc bạn học tập vui vẻ",
    customVars: [],
    build: buildThankYou,
  },
  {
    id: "promotion",
    name: "Khuyến Mãi",
    emoji: "🎁",
    subject: "Nhận Ưu đãi Đặc biệt Gói Premium",
    preheader: "Mở khoá bài tập thuật toán nâng cao, câu hỏi phỏng vấn chuẩn doanh nghiệp",
    customVars: ["discountPercent"],
    build: buildPromo,
  },
  {
    id: "system-alert",
    name: "Bảo Trì",
    emoji: "🚨",
    subject: "[Thông Báo] Lịch Bảo trì định kỳ Máy chủ nộp bài",
    preheader: "Thời gian bảo trì dự kiến: 2 tiếng Chủ Nhật tuần này",
    customVars: ["startTime", "endTime"],
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
    id: "new-course",
    name: "Khóa Học Mới",
    emoji: "🆕",
    subject: "[Mới] Khóa học mới vừa ra mắt tại JavaBuilder",
    preheader: "Khóa học được cộng đồng chờ đợi nhất đã chính thức ra mắt",
    customVars: ["courseName", "courseSlug"],
    build: buildNewCourse,
  },
];
