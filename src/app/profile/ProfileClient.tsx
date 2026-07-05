"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, UserX } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import Sidebar from "@/components/profile/Sidebar";
import ProfileTab from "@/components/profile/ProfileTab";
import MyPostsTab from "@/components/profile/MyPostsTab";
import SecurityTab from "@/components/profile/SecurityTab";
import PasswordTab from "@/components/profile/PasswordTab";
import SessionsTab from "@/components/profile/SessionsTab";
import { UserDetailResponse } from "@/types/user";
import { useI18n } from "@/contexts/I18nContext";

function ProfileLoadingState() {
  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="space-y-2">
        <div className="h-6 w-56 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-slate-700/60" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="h-96 w-full animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800 lg:w-72" />
        <div className="h-96 flex-1 animate-pulse rounded-2xl bg-white shadow-sm dark:bg-slate-800" />
      </div>
    </div>
  );
}

function ProfileContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams?.get("tab");
  const { user, loading, error, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`);
  };

  const handleSave = async (data: Partial<UserDetailResponse>) => {
    try {
      setIsSaving(true);
      await updateUser(data);
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    if (!user) return null;
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab user={user} onSave={handleSave} isSaving={isSaving} />
        );
      case "sessions":
        return <SessionsTab />;
      case "security":
        return <SecurityTab user={user} onUserUpdate={updateUser} />;
      case "password":
        return <PasswordTab />;
      case "my-posts":
        return <MyPostsTab />;
      default:
        return (
          <ProfileTab user={user} onSave={handleSave} isSaving={isSaving} />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <ProfileLoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-900/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t("profilePage.errorTitle")}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              {t("profilePage.retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <UserX className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t("profilePage.notFoundUser")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
              {t("profilePage.loginToView")}
            </p>
            <a
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              {t("profilePage.loginBtn")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {t("profilePage.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t("profilePage.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div className="w-full flex-shrink-0 lg:w-72 xl:w-80">
            <div className="lg:sticky lg:top-6">
              <Sidebar
                user={user}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          <ProfileLoadingState />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
