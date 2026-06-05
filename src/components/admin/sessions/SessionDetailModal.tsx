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

interface SessionDetailModalProps {
  session: UserSession;
  imageErrors: Set<string>;
  onImageError: (sessionId: string) => void;
  onClose: () => void;
  onRevokeSession: (session: UserSession) => void;
  onRevokeAllSessions: (userId: string, username: string) => void;
}

export const SessionDetailModal = ({
  session,
  imageErrors,
  onImageError,
  onClose,
  onRevokeSession,
  onRevokeAllSessions,
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-slate-700">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Chi tiết phiên đăng nhập
              </h2>
              <p className="mt-0.5 truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                {session.sessionId}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {/* User card */}
            <div className="border-b border-gray-200 bg-gradient-to-br from-accent/5 to-transparent px-5 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                {session.avatar && !imageErrors.has(session.sessionId) ? (
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
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
                  <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {session.username}
                  </div>
                  <div className="flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{session.email}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {getStatusBadge(session.status)}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="divide-y divide-gray-100 px-5 dark:divide-slate-700">
              <DetailSection
                icon={<Globe className="h-3.5 w-3.5" />}
                title="Thông tin truy cập"
              >
                <DetailRow label="Nguồn">
                  <span className="font-medium">{getProviderBadge(session.provider)}</span>
                </DetailRow>
                <DetailRow label="Địa chỉ IP">
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {session.ipAddress}
                  </span>
                </DetailRow>
                <DetailRow label="Thời gian truy cập">
                  <span className="text-sm tabular-nums text-gray-900 dark:text-white">
                    {formatReadableDate(session.createdAt)}
                  </span>
                </DetailRow>
              </DetailSection>

              <DetailSection
                icon={<Monitor className="h-3.5 w-3.5" />}
                title="Thiết bị & trình duyệt"
              >
                <DetailRow label="Trình duyệt">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.browser}{" "}
                    <span className="font-normal text-gray-500">
                      {session.browserVersion}
                    </span>
                  </span>
                </DetailRow>
                <DetailRow label="Hệ điều hành">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.os}
                  </span>
                </DetailRow>
                <DetailRow label="Thiết bị">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
                    <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                    {session.device}
                  </span>
                </DetailRow>
              </DetailSection>
            </div>
          </div>

          {/* Footer */}
          {isActive && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50/50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900/30">
              <button
                type="button"
                onClick={() => {
                  onRevokeAllSessions(session.userId, session.username);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" />
                Thu hồi tất cả
              </button>
              <button
                type="button"
                onClick={() => {
                  onRevokeSession(session);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
              >
                <X className="h-4 w-4" />
                Thu hồi phiên này
              </button>
            </div>
          )}
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
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
          {icon}
        </span>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
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
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
