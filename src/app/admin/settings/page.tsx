"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useI18n } from "@/contexts/I18nContext";
import SecurityTab from "@/components/profile/SecurityTab";
import AppearanceTab from "@/components/admin/settings/AppearanceTab";
import LanguageTab from "@/components/admin/settings/LanguageTab";
import { ShieldCheck, Palette, Languages, AlertTriangle, Home, ChevronRight } from "lucide-react";

type Tab = "security" | "appearance" | "language";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const { user, loading, error, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("security");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "security",
      label: t("admin.settings.tabSecurity"),
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: "appearance",
      label: t("admin.settings.tabAppearance"),
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: "language",
      label: t("admin.settings.tabLanguage"),
      icon: <Languages className="w-5 h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background min-h-screen">
        <div className="space-y-2">
          <div className="h-7 bg-muted rounded-full w-48" />
          <div className="h-4 bg-muted rounded-full w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tabs skeleton */}
          <div className="bg-surface border border-border rounded-2xl p-4 space-y-2 h-48" />
          {/* Form skeleton */}
          <div className="md:col-span-3 bg-surface border border-border rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-full w-24" />
              <div className="h-10 bg-muted rounded-xl w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-full w-24" />
              <div className="h-10 bg-muted rounded-xl w-full" />
            </div>
            <div className="h-10 bg-muted rounded-full w-32 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-surface rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("admin.settings.loadUserError")}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {t("admin.settings.retryBtn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 text-foreground">
      {/* Breadcrumb */}
      <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium hover:text-accent"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("admin.settings.breadcrumbDashboard")}
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 mx-1" />
              <span className="text-sm font-medium text-muted-foreground/80">
                {t("admin.settings.breadcrumbSettings")}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          {t("admin.settings.pageTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("admin.settings.pageSubtitle")}
        </p>
      </div>

      {/* Tabs + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-3 sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-foreground/90 hover:bg-muted"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-muted-foreground"}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="lg:hidden">
          <div className="bg-surface rounded-2xl border border-border shadow-sm p-2">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-semibold"
                        : "text-foreground/90 hover:bg-muted"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "security" && (
            <SecurityTab user={user} onUserUpdate={updateUser} />
          )}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "language" && <LanguageTab />}
        </div>
      </div>
    </div>
  );
}
