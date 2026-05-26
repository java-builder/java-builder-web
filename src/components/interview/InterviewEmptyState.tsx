import { useI18n } from "@/contexts/I18nContext";

export default function InterviewEmptyState() {
  const { t } = useI18n();

  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {t("interviewPage.noTopicsTitle")}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t("interviewPage.noTopicsDesc")}
      </p>
    </div>
  );
}
