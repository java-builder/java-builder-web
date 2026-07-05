"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useI18n } from "@/contexts/I18nContext";
import SecurityTab from "@/components/profile/SecurityTab";
import AppearanceTab from "@/components/admin/settings/AppearanceTab";
import LanguageTab from "@/components/admin/settings/LanguageTab";

type Tab = "security" | "appearance" | "language";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const { user, loading, error, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("security");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "security",
      label: t("admin.settings.tabSecurity"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: "appearance",
      label: t("admin.settings.tabAppearance"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      id: "language",
      label: t("admin.settings.tabLanguage"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5c-.347 2.225-1.512 4.417-3.239 6.275zM8.5 13H5m3.5-3.5a18.022 18.022 0 01-2.088-3.5" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse bg-gray-50 dark:bg-slate-900 min-h-screen">
        <div className="space-y-2">
          <div className="h-7 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tabs skeleton */}
          <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-4 space-y-2 h-48" />
          {/* Form skeleton */}
          <div className="md:col-span-3 bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700/60 rounded-xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-10 bg-muted rounded w-full" />
            </div>
            <div className="h-10 bg-muted rounded w-32 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("admin.settings.loadUserError")}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
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
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              {t("admin.settings.breadcrumbDashboard")}
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-muted-foreground/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm font-medium text-muted-foreground/80 md:ml-2">
                {t("admin.settings.breadcrumbSettings")}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-sm">
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
          <div className="bg-card rounded-xl border border-border shadow-sm p-3 sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                      isActive
                        ? "bg-accent text-white shadow-sm"
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
          <div className="bg-card rounded-xl border border-border shadow-sm p-2">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      isActive
                        ? "bg-accent text-white shadow-sm"
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
