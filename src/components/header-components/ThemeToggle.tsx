"use client";

import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2.5 rounded-full w-11 h-11" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors"
      aria-label={currentTheme === "dark" ? t("header.switchToLight") : t("header.switchToDark")}
    >
      {currentTheme === "dark" ? <HiOutlineSun className="w-6 h-6" /> : <HiOutlineMoon className="w-6 h-6" />}
    </button>
  );
}
