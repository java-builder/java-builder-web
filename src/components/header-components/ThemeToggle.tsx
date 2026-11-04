"use client";

import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface ThemeToggleProps {
  className?: string;
  iconClassName?: string;
  variant?: "default" | "on-dark";
}

export default function ThemeToggle({
  className = "",
  iconClassName = "",
  variant = "default",
}: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "on-dark") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-full hover:bg-white/15 transition-all cursor-pointer text-white flex items-center justify-center ${className}`}
        aria-label={isDark ? t("header.switchToLight") : t("header.switchToDark")}
        title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      >
        {isDark ? (
          <HiOutlineSun className={`w-5 h-5 text-amber-400 hover:text-amber-300 transition-colors drop-shadow-sm ${iconClassName}`} />
        ) : (
          <HiOutlineMoon className={`w-5 h-5 text-white hover:text-amber-300 transition-colors drop-shadow-sm ${iconClassName}`} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-[#FFF0E8] dark:bg-primary/15 dark:hover:bg-muted text-[#171717] dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center ${className}`}
      aria-label={isDark ? t("header.switchToLight") : t("header.switchToDark")}
      title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
    >
      {isDark ? (
        <HiOutlineSun className={`w-5 h-5 text-amber-400 hover:text-amber-300 transition-colors ${iconClassName}`} />
      ) : (
        <HiOutlineMoon className={`w-5 h-5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors ${iconClassName}`} />
      )}
    </button>
  );
}
