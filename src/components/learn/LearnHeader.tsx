"use client";

interface LearnHeaderProps {
  chapterName?: string;
  lessonName?: string;
  canPrev: boolean;
  canNext: boolean;
  completedCount?: number;
  totalLessons?: number;
  onToggleSidebar: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LearnHeader({
  chapterName,
  lessonName,
  canPrev,
  canNext,
  completedCount = 0,
  totalLessons = 0,
  onToggleSidebar,
  onPrev,
  onNext,
}: LearnHeaderProps) {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="relative h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700/60 flex items-center px-4 justify-between flex-shrink-0 transition-all duration-250 z-30">
      
      {/* Left: Lesson Info */}
      {lessonName && (
        <div className="flex-1 min-w-0 pr-4">
          {chapterName && (
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none truncate hidden sm:block mb-1">
              {chapterName}
            </p>
          )}
          <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate leading-tight" title={lessonName}>
            {lessonName}
          </h1>
        </div>
      )}

      {/* Right Controls Group */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        
        {/* Progress Text Indicator */}
        {totalLessons > 0 && (
          <div className="hidden md:flex flex-col items-end justify-center mr-2">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              Tiến độ khóa học
            </p>
            <p className="text-xs font-extrabold text-accent mt-1 leading-none">
              {completedCount}/{totalLessons} bài học ({percent}%)
            </p>
          </div>
        )}

        {/* Prev / Next Navigation Buttons */}
        <div className="flex items-center bg-gray-50 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-700/50 rounded-xl p-1 gap-1">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            title="Bài học trước"
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 cursor-pointer"
            aria-label="Previous lesson"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            title="Bài học tiếp theo"
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 cursor-pointer"
            aria-label="Next lesson"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200 dark:bg-slate-700/80 hidden sm:block" />

        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          title="Mở/Đóng danh mục bài học"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Bottom Thin Accent Progress Bar */}
      {totalLessons > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-slate-700/60 overflow-hidden">
          <div 
            className="h-full bg-accent rounded-r-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
}
