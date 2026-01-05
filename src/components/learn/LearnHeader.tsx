"use client";

interface LearnHeaderProps {
  chapterName?: string;
  lessonName?: string;
  canPrev: boolean;
  canNext: boolean;
  onToggleSidebar: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LearnHeader({
  chapterName,
  lessonName,
  canPrev,
  canNext,
  onToggleSidebar,
  onPrev,
  onNext,
}: LearnHeaderProps) {
  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 flex-shrink-0">
      <button
        onClick={onToggleSidebar}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {lessonName && (
        <div className="flex-1 min-w-0">
          {chapterName && (
            <p className="text-xs text-gray-500 truncate hidden sm:block">{chapterName}</p>
          )}
          <p className="text-sm text-gray-900 dark:text-white truncate">{lessonName}</p>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous lesson"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next lesson"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
