"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemePage() {
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
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
      name: "Sáng",
      description: "Giao diện sáng, dễ nhìn ban ngày",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      preview: "bg-white border-gray-200",
      textColor: "text-gray-900",
    },
    {
      id: "dark",
      name: "Tối",
      description: "Giao diện tối, bảo vệ mắt ban đêm",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      preview: "bg-slate-800 border-slate-700",
      textColor: "text-white",
    },
    {
      id: "system",
      name: "Hệ thống",
      description: "Tự động theo cài đặt thiết bị",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      preview: "bg-gradient-to-br from-white to-slate-800 border-gray-400",
      textColor: "text-gray-700",
    },
  ];

  const accentThemes = [
    {
      id: "blue",
      name: "Java Blue",
      description: "Mặc định, hiện đại và dễ nhìn",
      preview: "from-blue-600 to-blue-800",
    },
    {
      id: "emerald",
      name: "Emerald",
      description: "Xanh lá dịu, cảm giác tập trung",
      preview: "from-emerald-600 to-emerald-800",
    },
    {
      id: "purple",
      name: "Purple",
      description: "Tím công nghệ, nổi bật hơn",
      preview: "from-purple-600 to-purple-800",
    },
    {
      id: "rose",
      name: "Rose",
      description: "Ấm hơn, cá tính hơn",
      preview: "from-rose-600 to-rose-800",
    },
    {
      id: "amber",
      name: "Amber",
      description: "Vàng cam năng lượng",
      preview: "from-amber-600 to-amber-800",
    },
    {
      id: "cyan",
      name: "Cyan",
      description: "Mát mẻ, sáng và hiện đại",
      preview: "from-cyan-500 to-cyan-700",
    },
    {
      id: "teal",
      name: "Teal",
      description: "Cân bằng, dễ chịu khi học lâu",
      preview: "from-teal-500 to-teal-700",
    },
    {
      id: "indigo",
      name: "Indigo",
      description: "Sâu hơn, đậm chất developer",
      preview: "from-indigo-600 to-indigo-800",
    },
    {
      id: "pink",
      name: "Pink",
      description: "Tươi sáng, trẻ trung hơn",
      preview: "from-pink-600 to-pink-800",
    },
    {
      id: "slate",
      name: "Slate",
      description: "Trung tính, tối giản và nghiêm túc",
      preview: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Minimal Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Giao diện
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chọn chế độ hiển thị phù hợp với bạn
          </p>
        </div>

        {/* Theme Options - Compact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`relative p-4 rounded-xl border transition-all duration-200 text-left group ${
                theme === themeOption.id
                  ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-sm"
                  : "border-gray-200 dark:border-slate-700 hover:border-accent/50 bg-white dark:bg-slate-800 hover:shadow-sm"
              }`}
            >
              {/* Selected Indicator */}
              {theme === themeOption.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon & Content */}
              <div className="flex flex-col items-center text-center">
                <div className={`mb-3 transition-colors ${
                  theme === themeOption.id 
                    ? "text-accent" 
                    : "text-gray-400 dark:text-gray-500 group-hover:text-accent"
                }`}>
                  {themeOption.icon}
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {themeOption.name}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {themeOption.description}
                </p>
              </div>

              {/* Visual Preview */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <div className={`h-12 rounded-lg ${themeOption.preview} border transition-all`}></div>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Màu chủ đề
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chọn màu nhấn cho nút, liên kết và trạng thái đang chọn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accentThemes.map((item) => (
              <button
                key={item.id}
                onClick={() => setAccent(item.id)}
                className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 text-left group bg-white dark:bg-slate-800 ${
                  accentTheme === item.id
                    ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-md shadow-accent/10"
                    : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:shadow-md"
                }`}
              >
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${item.preview} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                {accentTheme === item.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-sm">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.preview} shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105`} />
                  <div className="min-w-0 pr-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                    <div className="mt-3 flex gap-1.5">
                      <span className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${item.preview}`} />
                      <span className="h-1.5 w-4 rounded-full bg-gray-200 dark:bg-slate-700" />
                      <span className="h-1.5 w-4 rounded-full bg-gray-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Status - Compact */}
        {theme === "system" && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Đang sử dụng chế độ {currentTheme === "dark" ? "Tối" : "Sáng"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tự động theo cài đặt hệ thống
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
