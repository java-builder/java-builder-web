"use client";

import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

export default function AuthButtons() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <Link 
        href="/login" 
        className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
      >
        {t("auth.login")}
      </Link>
      <Link 
        href="/register" 
        className="hidden sm:inline-flex px-4 py-1.5 bg-accent hover:bg-accent-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
      >
        {t("auth.register")}
      </Link>
    </div>
  );
}
