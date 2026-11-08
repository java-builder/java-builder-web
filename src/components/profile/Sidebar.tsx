"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Camera,
  KeyRound,
  Loader2,
  LogOut,
  PenSquare,
  ShieldCheck,
  MonitorSmartphone,
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { ProfileDetailResponse } from "@/types/user";
import { userApi } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

interface SidebarProps {
  user: ProfileDetailResponse;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUserUpdate?: (data: Partial<ProfileDetailResponse>) => Promise<void> | void;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function Sidebar({
  user,
  activeTab,
  onTabChange,
  onUserUpdate,
}: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || "");
  const { t } = useI18n();

  useEffect(() => {
    setCurrentAvatar(user.avatar || "");
  }, [user.avatar]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    router.push("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profilePage.profileTab.fileTooLarge"));
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(t("profilePage.profileTab.invalidImage"));
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const response = await userApi.updateAvatar(file);
      if (response.data) {
        setCurrentAvatar(response.data);
        if (onUserUpdate) {
          await onUserUpdate({ avatar: response.data });
        }
        toast.success(t("profilePage.profileTab.avatarSuccess"));
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("profilePage.profileTab.avatarFailed")
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const tabs: TabItem[] = [
    { id: "profile", label: t("userMenu.profile"), icon: UserIcon },
    { id: "my-posts", label: t("userMenu.myPosts"), icon: PenSquare },
    {
      id: "password",
      label: t("profilePage.passwordTab.changePassword"),
      icon: KeyRound,
    },
    {
      id: "security",
      label: t("profilePage.securityTab.security"),
      icon: ShieldCheck,
    },
    {
      id: "sessions",
      label: t("profilePage.sessionsTab.sessionsTitle"),
      icon: MonitorSmartphone,
    },
  ];

  const hasSocialLinks = Boolean(
    user.githubUrl || user.linkedinUrl || user.websiteUrl
  );

  return (
    <aside className="overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs">
      {/* Top User Identity Card (Single authoritative avatar + upload) */}
      <div className="relative border-b border-[#E8E8E8] dark:border-border p-5">
        <div className="flex items-start gap-3.5 text-left">
          <div className="relative flex-shrink-0 group/avatar">
            <div
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ${
                currentAvatar
                  ? "bg-transparent"
                  : "bg-gradient-to-br from-[#FF5A1F] to-[#FF8A4C]"
              }`}
            >
              {currentAvatar ? (
                <Image
                  key={currentAvatar}
                  src={`${currentAvatar}?t=${Date.now()}`}
                  alt={user.username || "User"}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            {/* 2FA Verified Badge */}
            {user.mftEnable && (
              <span
                title={t("profilePage.securityTab.activated")}
                className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface"
              >
                <ShieldCheck className="h-3 w-3 text-white" />
              </span>
            )}

            {/* Avatar Upload Trigger */}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
              className="hidden"
              id="sidebar-avatar-upload"
            />
            <label
              htmlFor="sidebar-avatar-upload"
              title={t("profilePage.profileTab.avatarLabel")}
              className={`absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-surface bg-[#FF5A1F] text-white shadow-xs transition hover:bg-[#e04b16] ${
                isUploadingAvatar
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </label>
          </div>

          <div
            onClick={() => onTabChange("profile")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTabChange("profile");
              }
            }}
            className="min-w-0 flex-1 cursor-pointer group"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="truncate text-sm font-bold text-[#171717] transition group-hover:text-[#FF5A1F] dark:text-foreground">
                {user.username || t("profilePage.sidebar.user")}
              </h3>
              {user.experienceLevel && (
                <span className="inline-flex items-center rounded-md bg-[#FF5A1F]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#FF5A1F]">
                  {user.experienceLevel}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {user.email}
            </p>
            {user.headline && (
              <p className="mt-1 line-clamp-1 text-xs font-medium text-[#171717]/80 dark:text-foreground/80">
                {user.headline}
              </p>
            )}
          </div>
        </div>

        {/* Meta tags (Specialization / University) */}
        {(user.specialization || user.university) && (
          <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-[#E8E8E8]/70 dark:border-border/60">
            {user.specialization && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F8F8F8] dark:bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <Briefcase className="h-3 w-3 text-[#FF5A1F]" />
                <span className="truncate max-w-[180px]">
                  {user.specialization}
                </span>
              </span>
            )}
            {user.university && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F8F8F8] dark:bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <GraduationCap className="h-3 w-3 text-[#FF5A1F]" />
                <span className="truncate max-w-[180px]">{user.university}</span>
              </span>
            )}
          </div>
        )}

        {/* Quick Social Links */}
        {hasSocialLinks && (
          <div className="mt-3 flex items-center gap-2">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 text-muted-foreground transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 text-muted-foreground transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {user.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Website / Portfolio"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E8E8E8] dark:border-border bg-[#F8F8F8] dark:bg-muted/30 text-muted-foreground transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2.5">
        <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Tài khoản & Cài đặt
        </div>
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-[#FF5A1F]/10 text-[#FF5A1F] font-semibold"
                      : "font-medium text-[#171717]/80 hover:bg-[#F8F8F8] hover:text-[#171717] dark:text-foreground/80 dark:hover:bg-muted/40 dark:hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#FF5A1F]" />
                  )}
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 transition ${
                      isActive
                        ? "text-[#FF5A1F]"
                        : "text-muted-foreground group-hover:text-[#171717] dark:group-hover:text-foreground"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#E8E8E8] dark:border-border p-2.5">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-950/30 active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {isLoggingOut
              ? t("profilePage.sidebar.loggingOut")
              : t("profilePage.sidebar.logout")}
          </span>
        </button>
      </div>
    </aside>
  );
}
