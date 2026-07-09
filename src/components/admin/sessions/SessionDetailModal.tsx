"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  Globe,
  LogOut,
  Mail,
  Monitor,
  Smartphone,
  X,
} from "lucide-react";
import { UserSession } from "@/types/session";
import { formatReadableDate } from "@/utils/dateUtils";
import { getProviderBadge, getStatusBadge } from "./SessionBadges";
import { Button } from "@/components/ui/button";

interface SessionDetailModalProps {
  session: UserSession;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onClose: () => void;
  onRevokeSession: (session: UserSession) => void;
  onRevokeAllSessions: (userId: string, username: string) => void;
  onBlockIp?: (ipAddress: string) => void;
}

export const SessionDetailModal = ({
  session,
  imageErrors,
  onImageError,
  onClose,
  onRevokeSession,
  onRevokeAllSessions,
  onBlockIp,
}: SessionDetailModalProps) => {
  // Lock body scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isActive = session.status === "ACTIVE";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                Chi tiết phiên đăng nhập
              </h2>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                {session.sessionId}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {/* User card */}
            <div className="border-b border-border bg-muted/20 px-5 py-4">
              <div className="flex items-center gap-3">
                {session.avatar && !imageErrors.has(session.sessionId) ? (
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={session.avatar}
                      alt={session.username || "User avatar"}
                      fill
                      sizes="44px"
                      className="object-cover"
                      onError={() => onImageError(session.sessionId)}
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-base font-semibold text-white">
                    {session.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {session.username}
                  </div>
                  <div className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{session.email}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {getStatusBadge(session.status)}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="divide-y divide-border px-5">
              <DetailSection
                icon={<Globe className="h-3.5 w-3.5 text-accent dark:text-accent-on-dark" />}
                title="Thông tin truy cập"
              >
                <DetailRow label="Nguồn">
                  <span className="font-semibold">{getProviderBadge(session.provider)}</span>
                </DetailRow>
                <DetailRow label="Địa chỉ IP">
                  <span className="font-mono text-sm text-foreground">
                    {session.ipAddress}
                  </span>
                </DetailRow>
                <DetailRow label="Thời gian truy cập">
                  <span className="text-sm tabular-nums text-foreground">
                    {formatReadableDate(session.createdAt)}
                  </span>
                </DetailRow>
              </DetailSection>

              <DetailSection
                icon={<Monitor className="h-3.5 w-3.5 text-accent dark:text-accent-on-dark" />}
                title="Thiết bị & trình duyệt"
              >
                <DetailRow label="Trình duyệt">
                  <span className="text-sm font-semibold text-foreground">
                    {session.browser}{" "}
                    <span className="font-normal text-muted-foreground">
                      {session.browserVersion}
                    </span>
                  </span>
                </DetailRow>
                <DetailRow label="Hệ điều hành">
                  <span className="text-sm font-medium text-foreground">
                    {session.os}
                  </span>
                </DetailRow>
                <DetailRow label="Thiết bị">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                    {session.device}
                  </span>
                </DetailRow>
              </DetailSection>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/20 px-5 py-3.5">
            {onBlockIp && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onBlockIp(session.ipAddress);
                  onClose();
                }}
                className="gap-1.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white border-transparent cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Chặn IP
              </Button>
            )}
            {isActive && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onRevokeAllSessions(session.userId, session.username);
                    onClose();
                  }}
                  className="gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  Thu hồi tất cả
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    onRevokeSession(session);
                    onClose();
                  }}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Thu hồi phiên này
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-4">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          {icon}
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      <dl className="space-y-2">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
