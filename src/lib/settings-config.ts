import { SettingsConfig } from "@/types/settings";

export const settingsConfig: SettingsConfig = {
  tabs: [
    {
      id: "system",
      name: "Hệ thống",
      icon: "⚙️",
      sections: [
        {
          id: "app-info",
          title: "Thông tin ứng dụng",
          fields: [
            {
              id: "app-name",
              type: "text",
              label: "Tên ứng dụng",
              defaultValue: "JavaBuilder",
              required: true,
            },
            {
              id: "app-version",
              type: "text",
              label: "Phiên bản",
              defaultValue: "1.0.0",
              required: true,
            },
            {
              id: "app-description",
              type: "textarea",
              label: "Mô tả hệ thống",
              defaultValue:
                "Nền tảng học trực tuyến JavaBuilder - Giải pháp đào tạo toàn diện",
            },
          ],
        },
        {
          id: "regional",
          title: "Cài đặt khu vực",
          fields: [
            {
              id: "timezone",
              type: "select",
              label: "Múi giờ",
              defaultValue: "Asia/Ho_Chi_Minh",
              options: [
                { value: "Asia/Ho_Chi_Minh", label: "GMT+7 (Việt Nam)" },
                { value: "Asia/Bangkok", label: "GMT+7 (Bangkok)" },
                { value: "Asia/Singapore", label: "GMT+8 (Singapore)" },
              ],
            },
            {
              id: "default-language",
              type: "select",
              label: "Ngôn ngữ mặc định",
              defaultValue: "en",
              options: [
                { value: "vi", label: "Tiếng Việt" },
                { value: "en", label: "English" },
                { value: "zh", label: "中文" },
              ],
            },
            {
              id: "date-format",
              type: "select",
              label: "Định dạng ngày",
              defaultValue: "DD/MM/YYYY",
              options: [
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
              ],
            },
          ],
        },
        {
          id: "contact",
          title: "Thông tin liên hệ",
          fields: [
            {
              id: "support-email",
              type: "email",
              label: "Email hỗ trợ",
              defaultValue: "support@JavaBuilder.com",
              required: true,
            },
            {
              id: "phone",
              type: "tel",
              label: "Số điện thoại",
              defaultValue: "+84 123 456 789",
            },
            {
              id: "address",
              type: "textarea",
              label: "Địa chỉ",
              defaultValue: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
            },
          ],
        },
        {
          id: "system-status",
          title: "Trạng thái hệ thống",
          fields: [
            {
              id: "maintenance-mode",
              type: "toggle",
              label: "Chế độ bảo trì",
              description: "Tạm dừng truy cập website",
              defaultValue: false,
            },
            {
              id: "allow-registration",
              type: "toggle",
              label: "Đăng ký mới",
              description: "Cho phép người dùng đăng ký",
              defaultValue: true,
            },
            {
              id: "debug-mode",
              type: "toggle",
              label: "Debug mode",
              description: "Hiển thị thông tin debug",
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      id: "email",
      name: "Email",
      icon: "📧",
      sections: [
        {
          id: "smtp-config",
          title: "Cấu hình SMTP",
          fields: [
            {
              id: "smtp-host",
              type: "text",
              label: "SMTP Host",
              placeholder: "smtp.gmail.com",
            },
            {
              id: "smtp-port",
              type: "number",
              label: "SMTP Port",
              defaultValue: 587,
              required: true,
            },
            {
              id: "smtp-username",
              type: "email",
              label: "Username",
              
            },
            {
              id: "smtp-password",
              type: "text",
              label: "Password",
            },
            {
              id: "smtp-secure",
              type: "toggle",
              label: "Sử dụng SSL/TLS",
              defaultValue: true,
            },
          ],
        },
        {
          id: "email-templates",
          title: "Mẫu email",
          fields: [
            {
              id: "welcome-subject",
              type: "text",
              label: "Tiêu đề email chào mừng",
              defaultValue: "Chào mừng bạn đến với JavaBuilder!",
            },
            {
              id: "welcome-template",
              type: "textarea",
              label: "Nội dung email chào mừng",
              defaultValue:
                "Xin chào {{name}},\n\nChào mừng bạn đến với JavaBuilder...",
            },
            {
              id: "reset-password-subject",
              type: "text",
              label: "Tiêu đề email đặt lại mật khẩu",
              defaultValue: "Đặt lại mật khẩu JavaBuilder",
            },
          ],
        },
      ],
    },
    {
      id: "payment",
      name: "Thanh toán",
      icon: "💳",
      sections: [
        {
          id: "payment-gateways",
          title: "Cổng thanh toán",
          fields: [
            {
              id: "vnpay-enabled",
              type: "toggle",
              label: "Kích hoạt VNPay",
              defaultValue: false,
            },
            {
              id: "vnpay-merchant-id",
              type: "text",
              label: "VNPay Merchant ID",
            },
            {
              id: "vnpay-secret-key",
              type: "text",
              label: "VNPay Secret Key",
            },
            {
              id: "momo-enabled",
              type: "toggle",
              label: "Kích hoạt MoMo",
              defaultValue: false,
            },
            {
              id: "paypal-enabled",
              type: "toggle",
              label: "Kích hoạt PayPal",
              defaultValue: false,
            },
          ],
        },
        {
          id: "pricing",
          title: "Cài đặt giá",
          fields: [
            {
              id: "currency",
              type: "select",
              label: "Đơn vị tiền tệ",
              defaultValue: "VND",
              options: [
                { value: "VND", label: "Việt Nam Đồng (VND)" },
                { value: "USD", label: "US Dollar (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
              ],
            },
            {
              id: "tax-rate",
              type: "number",
              label: "Thuế VAT (%)",
              defaultValue: 10,
            },
          ],
        },
      ],
    },
    {
      id: "security",
      name: "Bảo mật",
      icon: "🔒",
      sections: [
        {
          id: "password-policy",
          title: "Chính sách mật khẩu",
          fields: [
            {
              id: "min-password-length",
              type: "number",
              label: "Độ dài tối thiểu",
              defaultValue: 8,
              validation: { min: 6, max: 50 },
            },
            {
              id: "require-uppercase",
              type: "toggle",
              label: "Yêu cầu chữ hoa",
              defaultValue: true,
            },
            {
              id: "require-numbers",
              type: "toggle",
              label: "Yêu cầu số",
              defaultValue: true,
            },
            {
              id: "require-special-chars",
              type: "toggle",
              label: "Yêu cầu ký tự đặc biệt",
              defaultValue: false,
            },
          ],
        },
        {
          id: "session-security",
          title: "Bảo mật phiên",
          fields: [
            {
              id: "session-timeout",
              type: "number",
              label: "Thời gian hết hạn phiên (phút)",
              defaultValue: 30,
            },
            {
              id: "max-login-attempts",
              type: "number",
              label: "Số lần đăng nhập tối đa",
              defaultValue: 5,
            },
            {
              id: "lockout-duration",
              type: "number",
              label: "Thời gian khóa tài khoản (phút)",
              defaultValue: 15,
            },
          ],
        },
      ],
    },
    {
      id: "display",
      name: "Giao diện",
      icon: "🎨",
      sections: [
        {
          id: "theme",
          title: "Chủ đề",
          fields: [
            {
              id: "default-theme",
              type: "select",
              label: "Chủ đề mặc định",
              defaultValue: "light",
              options: [
                { value: "light", label: "Sáng" },
                { value: "dark", label: "Tối" },
                { value: "auto", label: "Tự động" },
              ],
            },
            {
              id: "primary-color",
              type: "text",
              label: "Màu chủ đạo",
              defaultValue: "#3B82F6",
            },
            {
              id: "secondary-color",
              type: "text",
              label: "Màu phụ",
              defaultValue: "#6B7280",
            },
          ],
        },
        {
          id: "layout",
          title: "Bố cục",
          fields: [
            {
              id: "sidebar-collapsed",
              type: "toggle",
              label: "Thu gọn sidebar mặc định",
              defaultValue: false,
            },
            {
              id: "show-breadcrumb",
              type: "toggle",
              label: "Hiển thị breadcrumb",
              defaultValue: true,
            },
            {
              id: "items-per-page",
              type: "select",
              label: "Số item mỗi trang",
              defaultValue: "20",
              options: [
                { value: "10", label: "10" },
                { value: "20", label: "20" },
                { value: "50", label: "50" },
                { value: "100", label: "100" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "performance",
      name: "Hiệu suất",
      icon: "⚡",
      sections: [
        {
          id: "caching",
          title: "Bộ nhớ đệm",
          fields: [
            {
              id: "enable-cache",
              type: "toggle",
              label: "Kích hoạt cache",
              defaultValue: true,
            },
            {
              id: "cache-duration",
              type: "number",
              label: "Thời gian cache (giây)",
              defaultValue: 3600,
            },
            {
              id: "redis-enabled",
              type: "toggle",
              label: "Sử dụng Redis",
              defaultValue: false,
            },
          ],
        },
        {
          id: "optimization",
          title: "Tối ưu hóa",
          fields: [
            {
              id: "compress-images",
              type: "toggle",
              label: "Nén hình ảnh",
              defaultValue: true,
            },
            {
              id: "lazy-loading",
              type: "toggle",
              label: "Lazy loading",
              defaultValue: true,
            },
            {
              id: "minify-assets",
              type: "toggle",
              label: "Minify CSS/JS",
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      id: "backup",
      name: "Sao lưu",
      icon: "💾",
      sections: [
        {
          id: "auto-backup",
          title: "Sao lưu tự động",
          fields: [
            {
              id: "enable-auto-backup",
              type: "toggle",
              label: "Kích hoạt sao lưu tự động",
              defaultValue: false,
            },
            {
              id: "backup-frequency",
              type: "select",
              label: "Tần suất sao lưu",
              defaultValue: "daily",
              options: [
                { value: "hourly", label: "Mỗi giờ" },
                { value: "daily", label: "Hàng ngày" },
                { value: "weekly", label: "Hàng tuần" },
                { value: "monthly", label: "Hàng tháng" },
              ],
            },
            {
              id: "backup-retention",
              type: "number",
              label: "Giữ lại (ngày)",
              defaultValue: 30,
            },
          ],
        },
        {
          id: "backup-storage",
          title: "Lưu trữ sao lưu",
          fields: [
            {
              id: "storage-type",
              type: "select",
              label: "Loại lưu trữ",
              defaultValue: "local",
              options: [
                { value: "local", label: "Máy chủ local" },
                { value: "s3", label: "Amazon S3" },
                { value: "google-drive", label: "Google Drive" },
              ],
            },
            {
              id: "s3-bucket",
              type: "text",
              label: "S3 Bucket Name",
            },
            {
              id: "s3-region",
              type: "text",
              label: "S3 Region",
            },
          ],
        },
      ],
    },
  ],
};
