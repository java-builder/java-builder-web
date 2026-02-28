"use client";

import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";

interface CourseCurriculumProps {
  chapters: ChapterDetailResponse[];
  expandedChapters: Set<string>;
  chapterLessons: Record<string, LessonDetailResponse[]>;
  loadingLessons: Set<string>;
  isEnrolled: boolean;
  isPremiumUser: boolean;
  onToggleChapter: (chapterId: string) => void;
  onLessonClick: (lesson: LessonDetailResponse) => void;
}

export default function CourseCurriculum({
  chapters,
  expandedChapters,
  chapterLessons,
  loadingLessons,
  isEnrolled,
  isPremiumUser,
  onToggleChapter,
  onLessonClick,
}: CourseCurriculumProps) {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Chưa có nội dung
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Nội dung khóa học đang được cập nhật
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
        >
          {/* Chapter Header */}
          <div
            className="flex items-start sm:items-center justify-between px-3 sm:px-4 py-3 bg-gray-50 dark:bg-slate-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors gap-2"
            onClick={() => onToggleChapter(chapter.id)}
          >
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 mt-0.5 sm:mt-0 ${
                  expandedChapters.has(chapter.id) ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                  Chương {index + 1}
                </span>
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {chapter.chapterName}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {chapterLessons[chapter.id]
                ? `${chapterLessons[chapter.id].length} bài`
                : ""}
            </span>
          </div>

          {/* Lessons List */}
          {expandedChapters.has(chapter.id) && (
            <div className="border-t border-gray-200 dark:border-slate-700">
              {chapter.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 px-3 sm:px-4 py-2 bg-gray-50/50 dark:bg-slate-700/30 border-b border-gray-100 dark:border-slate-700">
                  {chapter.description}
                </p>
              )}
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {loadingLessons.has(chapter.id) ? (
                  <div className="px-3 sm:px-4 py-6 text-center text-gray-400 dark:text-gray-500 text-sm flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tải...
                  </div>
                ) : chapterLessons[chapter.id] &&
                  chapterLessons[chapter.id].length > 0 ? (
                  chapterLessons[chapter.id].map((lesson, lessonIndex) => {
                    const canWatch =
                      isEnrolled || isPremiumUser || lesson.isFreePreview;
                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-start sm:items-center justify-between px-3 sm:px-4 py-3 transition-colors gap-2 ${
                          canWatch
                            ? "hover:bg-accent-50 dark:hover:bg-accent-900/20 cursor-pointer group"
                            : "bg-gray-50/30 dark:bg-slate-700/20"
                        }`}
                        onClick={() => onLessonClick(lesson)}
                      >
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold flex-shrink-0 ${
                              canWatch
                                ? "bg-accent/10 dark:bg-accent-900/30 text-accent dark:text-accent-400"
                                : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500"
                            } transition-colors`}
                          >
                            {lessonIndex + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                              <span
                                className={`text-sm ${
                                  canWatch
                                    ? "text-gray-900 dark:text-white group-hover:text-accent dark:group-hover:text-accent-400"
                                    : "text-gray-500 dark:text-gray-400"
                                } transition-colors break-words`}
                              >
                                {lesson.lessonName}
                              </span>
                              {lesson.isFreePreview && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full flex-shrink-0 border border-emerald-200 dark:border-emerald-800">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  Xem miễn phí
                                </span>
                              )}
                            </div>
                            {lesson.videoUrl && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Video
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {canWatch ? (
                            <svg
                              className="w-5 h-5 text-accent dark:text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-gray-300 dark:text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 sm:px-4 py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Chưa có bài học nào
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
