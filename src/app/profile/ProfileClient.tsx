"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, UserX } from "lucide-react";
import { useProfileDetails } from "@/hooks/useProfileDetails";
import Sidebar from "@/components/profile/Sidebar";
import ProfileTab from "@/components/profile/ProfileTab";
import MyPostsTab from "@/components/profile/MyPostsTab";
import SecurityTab from "@/components/profile/SecurityTab";
import PasswordTab from "@/components/profile/PasswordTab";
import SessionsTab from "@/components/profile/SessionsTab";
import { ProfileDetailResponse } from "@/types/user";
import { useI18n } from "@/contexts/I18nContext";

function ProfileLoadingState() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <div className="space-y-2">
        <div className="h-7 w-56 animate-pulse rounded-lg bg-[#E8E8E8] dark:bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-lg bg-[#E8E8E8]/70 dark:bg-muted/60" />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="h-[420px] w-full animate-pulse rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface lg:w-72 xl:w-80" />
        <div className="h-[540px] flex-1 animate-pulse rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface" />
      </div>
    </div>
  );
}

function ProfileContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams?.get("tab");
  const { profile: user, loading, error, updateProfile } = useProfileDetails();
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

  const handleSave = async (data: Partial<ProfileDetailResponse>) => {
    try {
      setIsSaving(true);
      await updateProfile(data);
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
        return <SecurityTab user={user} onUserUpdate={updateProfile} />;
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
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
        <div className="mx-auto max-w-6xl">
          <ProfileLoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20 shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#171717] dark:text-foreground">
              {t("profilePage.errorTitle")}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] active:scale-95 px-5 py-2 text-sm font-semibold text-white shadow-xs transition"
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
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface p-10 text-center shadow-xs sm:p-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
              <UserX className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#171717] dark:text-foreground">
              {t("profilePage.notFoundUser")}
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              {t("profilePage.loginToView")}
            </p>
            <a
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] active:scale-95 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition"
            >
              {t("profilePage.loginBtn")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-[#171717] dark:text-foreground sm:text-2xl">
            {t("profilePage.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("profilePage.subtitle")}
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full flex-shrink-0 lg:w-72 xl:w-80 lg:sticky lg:top-20">
            <Sidebar
              user={user}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onUserUpdate={handleSave}
            />
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
        <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
          <div className="mx-auto max-w-6xl">
            <ProfileLoadingState />
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
