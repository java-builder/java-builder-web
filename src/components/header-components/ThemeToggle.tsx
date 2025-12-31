"use client";

import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
      aria-label={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {theme === "dark" ? <HiOutlineSun className="w-6 h-6" /> : <HiOutlineMoon className="w-6 h-6" />}
    </button>
  );
}
