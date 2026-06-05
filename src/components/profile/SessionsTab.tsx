"use client";

import { useState } from "react";
import {
  Clock,
  Globe,
  KeyRound,
  Laptop,
  MapPin,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";
import { UserSessionDetailResponse } from "@/types/userSession";
import { formatReadableDate } from "@/utils/dateUtils";
import { useConfirm } from "@/hooks/useConfirm";
import { useRevokeSession, useUserSessions } from "@/hooks/useUserSessions";
import { useI18n } from "@/contexts/I18nContext";
import { Pagination } from "@/components/ui/Pagination";
import SectionCard from "./SectionCard";

const PAGE_SIZE = 10;

export default function SessionsTab() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { confirm } = useConfirm();

  const { data, isLoading } = useUserSessions(page, PAGE_SIZE);
  const revokeSessionMutation = useRevokeSession();

  const sessions = data?.sessions || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleRevokeSession = async (sessionId: string) => {
    await confirm(
      async () => {
        await revokeSessionMutation.mutateAsync(sessionId);
      },
      {
        title: t("profilePage.sessionsTab.revokeConfirmTitle"),
        message: `<div>${t("profilePage.sessionsTab.revokeConfirmMsg")}</div>`,
        confirmText: t("profilePage.sessionsTab.revokeBtn"),
        cancelText: t("common.cancel"),
        type: "warning",
      }
    );
  };

  const getDeviceIcon = (device: string): LucideIcon => {
    const dev = device?.toLowerCase() || "";
    if (dev.includes("mobile")) return Smartphone;
    if (dev.includes("tablet")) return Tablet;
    return Laptop;
  };

  const getProviderInfo = (
    provider: string
  ): { name: string; icon: React.ReactNode } => {
    const map: Record<string, { name: string; icon: React.ReactNode }> = {
      GOOGLE: {
        name: "Google",
        icon: (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.6 12.227c0-.68-.06-1.336-.176-1.958H12v3.71h5.44c-.234 1.228-.93 2.27-1.976 2.966v2.466h3.19c1.88-1.744 2.97-4.307 2.97-7.184z"
              fill="#EA4335"
            />
            <path
              d="M12 21.6c2.56 0 4.7-.852 6.28-2.18l-3.19-2.466c-.874.588-1.99.94-3.09.94-2.38 0-4.4-1.605-5.12-3.765H2.64v2.36C4.22 19.86 7.86 21.6 12 21.6z"
              fill="#34A853"
            />
            <path
              d="M6.88 14.24a5.2 5.2 0 01-.36-2.24c0-.78.12-1.53.36-2.24V7.06H2.64C1.93 8.86 1.6 10.78 1.6 12.72c0 1.94.33 3.86 1.04 5.66l3.24-2.14z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.64c1.12 0 2.18.384 3 1.12l2.24-2.24C16.66 2.08 14.56 1.2 12 1.2 7.86 1.2 4.22 2.94 2.64 5.94l3.24 2.36C7.6 6.245 9.62 4.64 12 4.64z"
              fill="#4285F4"
            />
          </svg>
        ),
      },
      GITHUB: {
        name: "GitHub",
        icon: (
          <svg
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="text-gray-900 dark:text-white"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        ),
      },
      LINKEDIN: {
        name: "LinkedIn",
        icon: (
          <svg width="14" height="14" fill="#0A66C2" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
      },
      USERNAME_PASSWORD: {
        name: t("userMenu.password"),
        icon: <KeyRound className="h-3.5 w-3.5 text-gray-500" />,
      },
    };
    return map[provider] || { name: provider, icon: null };
  };

  return (
    <SectionCard
      icon={Smartphone}
      title={t("profilePage.sessionsTab.sessionsTitle")}
      subtitle={t("profilePage.sessionsTab.sessionsSubtitle")}
      bodyClassName=""
    >
      {isLoading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700/40"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
            <Smartphone className="h-6 w-6 text-gray-400" />
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {t("profilePage.sessionsTab.noSessions")}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {sessions.map((session: UserSessionDetailResponse) => {
            const DeviceIcon = getDeviceIcon(session.device);
            const isActive = session.status === "ACTIVE";
            const provider = session.provider
              ? getProviderInfo(session.provider)
              : null;

            return (
              <div
                key={session.sessionId}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-slate-700/30 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <DeviceIcon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {session.browser}
                        {session.browserVersion && ` v${session.browserVersion}`}
                      </h4>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                          {t("profilePage.sessionsTab.activeStatus")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          {t("profilePage.sessionsTab.revokedStatus")}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 sm:grid-cols-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Globe className="h-3 w-3" />
                        <span className="truncate">
                          {session.device} • {session.os}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span className="tabular-nums">{session.ipAddress}</span>
                      </span>
                      {provider && (
                        <span className="inline-flex items-center gap-1.5">
                          {provider.icon}
                          <span>
                            {t(
                              "profilePage.sessionsTab.loggedInVia"
                            ).replace("{provider}", provider.name)}
                          </span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span className="tabular-nums">
                          {formatReadableDate(session.createdAt)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <button
                    type="button"
                    onClick={() => handleRevokeSession(session.sessionId)}
                    className="inline-flex flex-shrink-0 items-center rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
                  >
                    {t("profilePage.sessionsTab.revokeBtn")}
                  </button>
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="px-5 py-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                itemName={t("profilePage.sessionsTab.sessionsTitle").toLowerCase()}
              />
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
