"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useI18n } from "@/contexts/I18nContext";

export default function AppearanceTab() {
  const { t } = useI18n();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accentTheme, setAccentTheme] = useState("blue");

  useEffect(() => {
    const savedAccentTheme = localStorage.getItem("accent-theme") || "blue";
    document.documentElement.dataset.accentTheme = savedAccentTheme;
    setAccentTheme(savedAccentTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const setAccent = (id: string) => {
    setAccentTheme(id);
    localStorage.setItem("accent-theme", id);
    document.documentElement.dataset.accentTheme = id;
  };

  const themes = [
    {
      id: "light",
      name: t("themePage.lightName"),
      description: t("themePage.lightDesc"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      preview: "bg-white border-gray-200",
    },
    {
      id: "dark",
      name: t("themePage.darkName"),
      description: t("themePage.darkDesc"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      preview: "bg-slate-800 border-slate-700",
    },
    {
      id: "system",
      name: t("themePage.systemName"),
      description: t("themePage.systemDesc"),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      preview: "bg-gradient-to-br from-white to-slate-800 border-gray-400",
    },
  ];

  const accentThemes = [
    { id: "blue", name: t("themePage.blueName"), description: t("themePage.blueDesc"), preview: "from-blue-600 to-blue-800" },
    { id: "emerald", name: t("themePage.emeraldName"), description: t("themePage.emeraldDesc"), preview: "from-emerald-600 to-emerald-800" },
    { id: "purple", name: t("themePage.purpleName"), description: t("themePage.purpleDesc"), preview: "from-purple-600 to-purple-800" },
    { id: "rose", name: t("themePage.roseName"), description: t("themePage.roseDesc"), preview: "from-rose-600 to-rose-800" },
    { id: "amber", name: t("themePage.amberName"), description: t("themePage.amberDesc"), preview: "from-amber-600 to-amber-800" },
    { id: "cyan", name: t("themePage.cyanName"), description: t("themePage.cyanDesc"), preview: "from-cyan-500 to-cyan-700" },
    { id: "teal", name: t("themePage.tealName"), description: t("themePage.tealDesc"), preview: "from-teal-500 to-teal-700" },
    { id: "indigo", name: t("themePage.indigoName"), description: t("themePage.indigoDesc"), preview: "from-indigo-600 to-indigo-800" },
    { id: "pink", name: t("themePage.pinkName"), description: t("themePage.pinkDesc"), preview: "from-pink-600 to-pink-800" },
    { id: "slate", name: t("themePage.slateName"), description: t("themePage.slateDesc"), preview: "from-slate-600 to-slate-800" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("themePage.title")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          {t("themePage.subtitle")}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Theme mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`relative p-4 rounded-xl border transition-all duration-200 text-left group ${
                theme === themeOption.id
                  ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-sm"
                  : "border-gray-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800/50 hover:shadow-sm"
              }`}
            >
              {theme === themeOption.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`mb-3 transition-colors ${
                  theme === themeOption.id ? "text-accent" : "text-gray-400 dark:text-gray-300 group-hover:text-accent"
                }`}>
                  {themeOption.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {themeOption.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {themeOption.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className={`h-12 rounded-lg ${themeOption.preview} border transition-all`} />
              </div>
            </button>
          ))}
        </div>

        {/* Current Status (system) */}
        {theme === "system" && (
          <div className="p-4 bg-accent/5 dark:bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("themePage.currentStatus").replace(
                    "{theme}",
                    currentTheme === "dark" ? t("themePage.darkName") : t("themePage.lightName")
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t("themePage.autoDesc")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Accent Color */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t("themePage.accentTitle")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              {t("themePage.accentSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accentThemes.map((item) => (
              <button
                key={item.id}
                onClick={() => setAccent(item.id)}
                className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-200 text-left group bg-white dark:bg-slate-800/50 ${
                  accentTheme === item.id
                    ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-sm"
                    : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:shadow-sm"
                }`}
              >
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${item.preview} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                {accentTheme === item.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.preview} shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 flex-shrink-0`} />
                  <div className="min-w-0 pr-8">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
