"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminNotificationDropdown from "@/components/admin/notifications/AdminNotificationDropdown";
import ThemeToggle from "@/components/header-components/ThemeToggle";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/header-components/Logo";
import {
  LayoutGrid,
  LayoutDashboard,
  Home,
  User,
  LogOut,
  Users,
  UserCheck,
  ShieldCheck,
  Monitor,
  BarChart3,
  Flame,
  Crown,
  CreditCard,
  GraduationCap,
  BookOpen,
  Award,
  Code2,
  Briefcase,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  FolderOpen,
  Tag,
  Newspaper,
  FileText,
  Bell,
  MessageCircle,
  Radio,
  Mail,
  Send,
  BarChart2,
  Bot,
  Clock,
  Settings,
  ShieldAlert,
  Database,
  Activity,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  nameKey: string;
  href: string;
  colorKey: string;
  icon: ReactNode;
}

interface NavGroup {
  titleKey: string;
  borderColor: string;
  icon: ReactNode;
  items: NavItem[];
}

interface ColorTheme {
  iconActive: string;
  itemActiveText: string;
  itemActiveBg: string;
  itemHoverText: string;
  itemHoverBg: string;
  borderClass: string;
}

const activeItemStyle = {
  iconActive: "text-primary",
  itemActiveText: "text-primary font-semibold",
  itemActiveBg:
    "relative bg-primary-soft dark:bg-primary/15 text-primary font-semibold rounded-xl before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:rounded-r-full before:bg-primary",
  itemHoverText: "hover:text-foreground",
  itemHoverBg: "hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-xl",
  borderClass: "border-border",
};

const colorThemes: Record<string, ColorTheme> = new Proxy(
  {},
  {
    get: () => activeItemStyle,
  }
);

const navGroups: NavGroup[] = [
  {
    titleKey: "admin.layout.groupOverview",
    borderColor: "border-orange-300 dark:border-orange-500/40",
    icon: <LayoutGrid className="w-4 h-4 text-primary" />,
    items: [
      {
        nameKey: "admin.layout.home",
        href: "/admin",
        colorKey: "blue",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.reports",
        href: "/admin/reports",
        colorKey: "cyan",
        icon: <BarChart2 className="w-5 h-5" />,
      },
    ],
  },
  {
    titleKey: "admin.layout.groupUsers",
    borderColor: "border-blue-300 dark:border-blue-500/40",
    icon: <Users className="w-4 h-4 text-secondary" />,
    items: [
      {
        nameKey: "admin.layout.users",
        href: "/admin/users",
        colorKey: "teal",
        icon: <UserCheck className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.roles",
        href: "/admin/roles",
        colorKey: "pink",
        icon: <ShieldCheck className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.sessions",
        href: "/admin/sessions",
        colorKey: "emerald",
        icon: <Monitor className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.sessionsAnalytics",
        href: "/admin/sessions/analytics",
        colorKey: "indigo",
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.activeUsers",
        href: "/admin/active-users",
        colorKey: "cyan",
        icon: <Users className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.userStreaks",
        href: "/admin/user-streaks",
        colorKey: "orange",
        icon: <Flame className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.userSubscriptions",
        href: "/admin/user-subscriptions",
        colorKey: "purple",
        icon: <Crown className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.subscriptions",
        href: "/admin/subscriptions",
        colorKey: "yellow",
        icon: <Crown className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.payments",
        href: "/admin/payments",
        colorKey: "green",
        icon: <CreditCard className="w-5 h-5" />,
      },
    ],
  },
  {
    titleKey: "admin.layout.groupCourses",
    borderColor: "border-amber-300 dark:border-amber-500/40",
    icon: <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    items: [
      {
        nameKey: "admin.layout.courses",
        href: "/admin/courses",
        colorKey: "orange",
        icon: <BookOpen className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.challenges",
        href: "/admin/challenges",
        colorKey: "amber",
        icon: <Flame className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.exercises",
        href: "/admin/exercises",
        colorKey: "indigo",
        icon: <Code2 className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.interviewTopics",
        href: "/admin/interview-topics",
        colorKey: "red",
        icon: <Briefcase className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.questionContributions",
        href: "/admin/question-contributions",
        colorKey: "fuchsia",
        icon: <Lightbulb className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.certificates",
        href: "/admin/certificates",
        colorKey: "amber",
        icon: <Award className="w-5 h-5" />,
      },
    ],
  },
  {
    titleKey: "admin.layout.groupBlogs",
    borderColor: "border-indigo-300 dark:border-indigo-500/40",
    icon: <Newspaper className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    items: [
      {
        nameKey: "admin.layout.blogs",
        href: "/admin/blogs",
        colorKey: "violet",
        icon: <Newspaper className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.documents",
        href: "/admin/documents",
        colorKey: "amber",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.qna",
        href: "/admin/qna",
        colorKey: "cyan",
        icon: <HelpCircle className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.comments",
        href: "/admin/comments",
        colorKey: "purple",
        icon: <MessageSquare className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.categories",
        href: "/admin/categories",
        colorKey: "emerald",
        icon: <FolderOpen className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.tags",
        href: "/admin/tags",
        colorKey: "blue",
        icon: <Tag className="w-5 h-5" />,
      },
    ],
  },
  {
    titleKey: "admin.layout.groupNotifications",
    borderColor: "border-rose-300 dark:border-rose-500/40",
    icon: <Bell className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
    items: [
      {
        nameKey: "admin.layout.notifications",
        href: "/admin/notifications",
        colorKey: "pink",
        icon: <Bell className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.messages",
        href: "/admin/messages",
        colorKey: "sky",
        icon: <MessageCircle className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.pushNotifications",
        href: "/admin/push-notifications",
        colorKey: "amber",
        icon: <Radio className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.emailTemplates",
        href: "/admin/email-templates",
        colorKey: "purple",
        icon: <Mail className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.emailMarketing",
        href: "/admin/notifications/send",
        colorKey: "rose",
        icon: <Send className="w-5 h-5" />,
      },
    ],
  },
  {
    titleKey: "admin.layout.groupSystem",
    borderColor: "border-teal-300 dark:border-teal-500/40",
    icon: <Settings className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
    items: [
      {
        nameKey: "admin.layout.aiTraining",
        href: "/admin/ai-training",
        colorKey: "purple",
        icon: <Bot className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.scheduledJobs",
        href: "/admin/scheduled-jobs",
        colorKey: "sky",
        icon: <Clock className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.settings",
        href: "/admin/settings",
        colorKey: "slate",
        icon: <Settings className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.ipAccessRules",
        href: "/admin/ip-access-rules",
        colorKey: "red",
        icon: <ShieldAlert className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.caches",
        href: "/admin/caches",
        colorKey: "emerald",
        icon: <Database className="w-5 h-5" />,
      },
      {
        nameKey: "admin.layout.systemMetrics",
        href: "/admin/system-metrics",
        colorKey: "cyan",
        icon: <Activity className="w-5 h-5" />,
      },
    ],
  },
];


export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  useEffect(() => {
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-sidebar-collapsed") === "true";
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  };

  const { t, isSwitching } = useI18n();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Initialize group states and auto-expand active group
  useEffect(() => {
    const initialState: Record<string, boolean> = {};
    navGroups.forEach((group) => {
      // Auto-expand if any item in the group is active
      const hasActiveChild = group.items.some((item) => {
        if (item.href === "/admin") {
          return pathname === "/admin";
        }
        return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
      });
      initialState[group.titleKey] = hasActiveChild || true;
    });
    setOpenGroups(initialState);
  }, [pathname]);

  const toggleGroup = (groupTitleKey: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupTitleKey]: !prev[groupTitleKey],
    }));
  };

  const renderSidebarContent = (isCollapsedState: boolean, isDesktop: boolean) => {
    return (
      <div className="flex flex-col h-full">
        {/* Logo & Toggle Header */}
        <div className={`flex items-center p-4 border-b border-border ${isCollapsedState && isDesktop ? "lg:flex-col lg:gap-3 lg:justify-center" : "justify-between"}`}>
          {isCollapsedState && isDesktop ? (
            <Link href="/" className="hidden lg:flex items-center justify-center">
              <div className="relative w-9 h-9">
                <Image
                  src="/logos/java-logo.png"
                  alt="Java Builder"
                  width={36}
                  height={36}
                  className="object-contain [filter:hue-rotate(16deg)_saturate(1.25)_brightness(1.05)]"
                />
              </div>
            </Link>
          ) : (
            <Logo hideText={false} />
          )}

          <div className="flex items-center gap-1.5">
            {isDesktop && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-lg hover:bg-muted dark:hover:text-white transition-colors text-text-muted cursor-pointer"
                aria-label={isCollapsedState ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                {isCollapsedState ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            )}

            {!isDesktop && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-muted rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className={`flex-1 py-4 space-y-3.5 overflow-y-auto ${isCollapsedState && isDesktop ? "px-1.5" : "px-2.5"}`}>
          {navGroups.map((group, groupIdx) => {
            const isOpen = (isCollapsedState && isDesktop) ? true : !!openGroups[group.titleKey];

            return (
              <div
                key={group.titleKey}
                className={`space-y-1 ${groupIdx > 0 ? "pt-3 mt-3 border-t border-border/60" : ""}`}
              >
                {/* Group Header Button */}
                {!(isCollapsedState && isDesktop) && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.titleKey)}
                    className="group w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-extrabold tracking-wider text-slate-800 dark:text-slate-100 uppercase select-none rounded-xl hover:text-primary hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-primary-soft dark:bg-primary/15 text-primary flex-shrink-0 flex items-center justify-center transition-all duration-200 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:flex-shrink-0 [&_svg]:!text-primary">
                        {group.icon}
                      </span>
                      <span className="truncate">{t(group.titleKey as Parameters<typeof t>[0])}</span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                )}

                {/* Group Items */}
                {isOpen && (
                  <div className={(isCollapsedState && isDesktop)
                    ? "space-y-1.5 flex flex-col items-center"
                    : "space-y-0.5"
                  }>
                    {group.items.map((item) => {
                      const theme = colorThemes[item.colorKey] || colorThemes.blue;
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname === item.href ||
                          (item.href !== "/" &&
                            pathname.startsWith(`${item.href}/`) &&
                            !navGroups.some((g) =>
                              g.items.some((i) => i.href !== item.href && i.href !== "/admin" && i.href !== "/" && pathname.startsWith(i.href))
                            ));

                      const label = t(item.nameKey as Parameters<typeof t>[0]);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={(isCollapsedState && isDesktop) ? label : undefined}
                          className={`group flex items-center transition-all duration-150 ${(isCollapsedState && isDesktop)
                            ? `justify-center w-11 h-11 rounded-xl ${isActive ? `${theme.itemActiveBg} before:hidden` : `text-slate-700 dark:text-slate-300 ${theme.itemHoverBg} ${theme.itemHoverText}`}`
                            : `px-3 py-2 text-[13.5px] font-medium rounded-xl ${isActive ? `${theme.itemActiveBg} ${theme.itemActiveText}` : `text-slate-700 dark:text-slate-300 ${theme.itemHoverBg} ${theme.itemHoverText}`}`
                            }`}
                        >
                          <span
                            className={`flex-shrink-0 transition-colors duration-150 ${(isCollapsedState && isDesktop) ? "" : "mr-2.5"} ${isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 group-hover:text-foreground"}`}
                          >
                            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 [&_svg]:flex-shrink-0">
                              {item.icon}
                            </div>
                          </span>
                          {!(isCollapsedState && isDesktop) && <span className="truncate flex-1">{label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

      </div>
    );
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="h-screen bg-background overflow-hidden relative" suppressHydrationWarning>
          {/* Fullscreen skeleton overlay khi đổi locale */}
          {isSwitching && (
            <div className="fixed inset-0 z-[60] bg-background flex">
              {/* Sidebar skeleton */}
              <div className={`hidden lg:flex flex-shrink-0 bg-surface border-r border-border flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
                <div className={`h-16 border-b border-border flex items-center ${isCollapsed ? "px-4 justify-center" : "px-6"}`}>
                  <div className={`h-6 bg-gray-200 dark:bg-slate-700 rounded-md ${isCollapsed ? "w-8" : "w-28"}`} />
                </div>
                <div className={`flex-1 space-y-2 py-6 ${isCollapsed ? "px-2" : "px-4"}`}>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className={`flex items-center rounded-xl ${isCollapsed ? "justify-center py-2" : "px-4 py-3"}`}>
                      <div className={`w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-md ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <div className="h-4 flex-1 bg-gray-200 dark:bg-slate-700 rounded-md" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main area skeleton */}
              <div className="flex-1 flex flex-col">
                {/* Header skeleton */}
                <div className="bg-surface h-16 px-6 flex items-center justify-between flex-shrink-0">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded-md" />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-md" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-md" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="h-7 w-64 bg-gray-200 dark:bg-slate-700 rounded-md" />
                    <div className="h-4 w-96 bg-gray-200 dark:bg-slate-700 rounded-md" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="bg-surface border border-border rounded-2xl p-5 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-md" />
                            <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-md" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded-md" />
                        <div className="h-3 w-5/6 bg-gray-200 dark:bg-slate-700 rounded-md" />
                        <div className="flex justify-end gap-2 pt-3 border-t border-border">
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded-md" />
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded-md" />
                          <div className="h-7 w-7 bg-gray-200 dark:bg-slate-700 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          )}

          {/* Mobile Sidebar - Drawer style */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border shadow-xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden flex flex-col`}
          >
            {renderSidebarContent(false, false)}
          </div>

          {/* Desktop Sidebar - Fixed height & transition width */}
          <aside
            className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-surface border-r border-border transition-all duration-300 z-40 ${isCollapsed ? "w-20" : "w-64"}`}
          >
            {renderSidebarContent(isCollapsed, true)}
          </aside>

          {/* Main content area */}
          <div className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
            {/* Top header - Fixed */}
            <header className="bg-surface flex-shrink-0">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <div className="flex items-center min-w-0 mr-2 sm:mr-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 flex-shrink-0 p-1 -ml-1 rounded-md"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="ml-2.5 sm:ml-4 lg:ml-0 text-base sm:text-xl font-semibold text-foreground truncate whitespace-nowrap">
                    {(() => {
                      let currentItem: NavItem | undefined;
                      for (const group of navGroups) {
                        const found = group.items.find((item) => item.href === pathname);
                        if (found) {
                          currentItem = found;
                          break;
                        }
                      }
                      return currentItem
                        ? t(currentItem.nameKey as Parameters<typeof t>[0])
                        : t("admin.layout.dashboard");
                    })()}
                  </h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <ThemeToggle variant="default" />
                  <LanguageSwitcher variant="ghost" showLabel={true} />
                  <AdminNotificationDropdown />

                  {/* Thin Vertical Divider Line */}
                  <div className="h-5 w-px mx-0.5 bg-border" />

                  {currentUser && (
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                        className={`flex items-center gap-2 sm:gap-2.5 p-1 sm:pr-2.5 rounded-full transition-all cursor-pointer select-none ${
                          isUserDropdownOpen
                            ? "bg-primary-soft dark:bg-primary/15 text-primary"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-foreground"
                        }`}
                        aria-expanded={isUserDropdownOpen}
                        aria-label="Tài khoản quản trị"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center border-2 border-white/50 shadow-xs flex-shrink-0">
                          {currentUser.avatar ? (
                            <Image
                              src={currentUser.avatar}
                              alt={currentUser.username || "Admin"}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {currentUser.username?.charAt(0).toUpperCase() || "A"}
                            </span>
                          )}
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold tracking-wide truncate max-w-[120px]">
                          {currentUser.username}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                            isUserDropdownOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {/* Admin User Dropdown Menu */}
                      {isUserDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                          {/* User Header */}
                          <div className="px-3.5 py-3 border-b border-border mb-1">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-primary flex items-center justify-center border border-white/40 shadow-2xs flex-shrink-0">
                                {currentUser.avatar ? (
                                  <Image
                                    src={currentUser.avatar}
                                    alt={currentUser.username || "Admin"}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-bold text-white">
                                    {currentUser.username?.charAt(0).toUpperCase() || "A"}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-bold text-foreground truncate">
                                    {currentUser.username}
                                  </p>
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-soft-border shrink-0">
                                    ADMIN
                                  </span>
                                </div>
                                {currentUser.email && (
                                  <p className="text-xs text-text-muted truncate mt-0.5">
                                    {currentUser.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Navigation Items */}
                          <div className="space-y-0.5">
                            <Link
                              href="/"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                            >
                              <Home className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                              <span>{t("admin.layout.backToUser") || "Về trang người dùng"}</span>
                            </Link>

                            <Link
                              href="/profile"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                            >
                              <User className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                              <span>Thông tin cá nhân</span>
                            </Link>

                            <Link
                              href="/admin/settings"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                            >
                              <Settings className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                              <span>{t("admin.layout.settings") || "Cấu hình hệ thống"}</span>
                            </Link>

                            <Link
                              href="/admin/system-metrics"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary-soft hover:text-primary dark:hover:bg-slate-800/70 transition-colors"
                            >
                              <Activity className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                              <span>{t("admin.layout.systemMetrics") || "Giám sát hệ thống"}</span>
                            </Link>
                          </div>

                          {/* Divider */}
                          <div className="my-1 border-t border-border" />

                          {/* Logout Button */}
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-error hover:bg-error-soft transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Page content - Scrollable */}
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </div>
    </ProtectedRoute>
  );
}
