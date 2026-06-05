import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  CalendarClock,
  Crown,
  Flame,
  Gift,
  Heart,
  Megaphone,
  Minus,
  PartyPopper,
  Send,
  Sparkles,
  UserCog,
  UserX,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  ActiveTab,
  Priority,
  TargetSegment,
} from "@/components/admin/notifications/useEmailCampaign";

export type IconTone = "amber" | "violet" | "orange" | "blue" | "cyan" | "pink" | "rose" | "emerald" | "gray";

export const ICON_TONE: Record<IconTone, string> = {
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  gray: "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400",
};

export interface SubjectPreset {
  label: string;
  subject: string;
  summary: string;
  icon: LucideIcon;
  tone: IconTone;
}

export const SUBJECT_PRESETS: SubjectPreset[] = [
  {
    label: "Khuyến mãi tháng",
    subject: "Ưu đãi đặc biệt tháng này — Giảm tới 50%!",
    summary: "Mở khoá toàn bộ kho học liệu Premium với mức giá tốt nhất năm",
    icon: Gift,
    tone: "amber",
  },
  {
    label: "Khoá học mới",
    subject: "Khoá học mới vừa lên sóng tại JavaBuilder",
    summary: "Khám phá lộ trình học tiếp theo do mentor hàng đầu xây dựng",
    icon: Sparkles,
    tone: "violet",
  },
  {
    label: "Bảo trì hệ thống",
    subject: "Thông báo lịch bảo trì hệ thống nộp bài",
    summary: "Hệ thống chấm tự động tạm ngưng — vui lòng đọc chi tiết bên trong",
    icon: AlertTriangle,
    tone: "orange",
  },
  {
    label: "Quay lại học tập",
    subject: "Lộ trình của bạn đang chờ — quay lại nhé!",
    summary: "Chỉ 15 phút mỗi ngày là đủ để duy trì đà học tập của bạn",
    icon: BookOpen,
    tone: "blue",
  },
  {
    label: "Cập nhật tính năng",
    subject: "Tính năng mới vừa được ra mắt!",
    summary: "Cập nhật mới giúp việc học của bạn hiệu quả và mượt mà hơn",
    icon: Megaphone,
    tone: "cyan",
  },
  {
    label: "Sự kiện đặc biệt",
    subject: "Sự kiện đặc biệt từ JavaBuilder — đừng bỏ lỡ!",
    summary: "Workshop, livestream miễn phí và các phần quà giá trị đang chờ bạn",
    icon: PartyPopper,
    tone: "pink",
  },
  {
    label: "Cảm ơn cộng đồng",
    subject: "Cảm ơn bạn đã đồng hành cùng JavaBuilder!",
    summary: "Chúng tôi trân trọng sự tin tưởng của bạn — chúc bạn học tập vui vẻ",
    icon: Heart,
    tone: "rose",
  },
];

export interface SegmentOption {
  id: TargetSegment;
  title: string;
  desc: string;
  icon: LucideIcon;
  tone: IconTone;
}

export const SEGMENTS: SegmentOption[] = [
  {
    id: "all",
    title: "Tất cả học viên",
    desc: "Gửi đến toàn bộ người dùng trong hệ thống",
    icon: Users,
    tone: "blue",
  },
  {
    id: "premium",
    title: "Thành viên Premium",
    desc: "Gửi riêng tới những người đã mua gói học phí",
    icon: Crown,
    tone: "amber",
  },
  {
    id: "inactive",
    title: "Chưa kích hoạt",
    desc: "Học viên chưa xác thực hoặc lâu không hoạt động",
    icon: UserX,
    tone: "orange",
  },
  {
    id: "custom",
    title: "Người nhận tuỳ chọn",
    desc: "Tìm kiếm và lựa chọn thủ công từng tài khoản",
    icon: UserCog,
    tone: "violet",
  },
];

export interface ScheduleOption {
  id: "now" | "schedule";
  title: string;
  desc: string;
  icon: LucideIcon;
  tone: IconTone;
}

export const SCHEDULE_OPTIONS: ScheduleOption[] = [
  {
    id: "now",
    title: "Gửi ngay lập tức",
    desc: "Email sẽ được chuyển sang hàng đợi gửi đi ngay",
    icon: Send,
    tone: "emerald",
  },
  {
    id: "schedule",
    title: "Lên lịch gửi",
    desc: "Chọn thời gian cụ thể trong tương lai",
    icon: CalendarClock,
    tone: "blue",
  },
];

export interface PriorityOption {
  value: Priority;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: IconTone;
}

export const PRIORITIES: PriorityOption[] = [
  {
    value: "LOW",
    label: "Thấp",
    desc: "Xử lý sau khi hàng đợi trống",
    icon: ArrowDown,
    tone: "gray",
  },
  {
    value: "NORMAL",
    label: "Bình thường",
    desc: "Tốc độ tiêu chuẩn",
    icon: Minus,
    tone: "blue",
  },
  {
    value: "HIGH",
    label: "Cao",
    desc: "Được ưu tiên đẩy lên đầu",
    icon: Flame,
    tone: "rose",
  },
];

export const STEPS: { id: ActiveTab; label: string; description: string }[] = [
  {
    id: "config",
    label: "Thiết lập",
    description: "Tiêu đề, preheader và thông tin người gửi",
  },
  {
    id: "content",
    label: "Nội dung",
    description: "Chọn template hoặc soạn email HTML tuỳ chỉnh",
  },
  {
    id: "audience",
    label: "Người nhận",
    description: "Chọn nhóm hoặc tìm người nhận cụ thể",
  },
  {
    id: "schedule",
    label: "Lập lịch",
    description: "Gửi ngay hoặc đặt lịch theo mức độ ưu tiên",
  },
];

// Avoid unused import warning for ArrowUp (kept as reusable export option)
export { ArrowUp };
