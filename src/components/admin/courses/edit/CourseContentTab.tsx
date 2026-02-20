"use client";

import { ChapterDetailResponse, LessonDetailResponse } from "@/types/course";

interface CourseContentTabProps {
  chapters: ChapterDetailResponse[];
  expandedChapters: Set<string>;
  chapterLessons: Record<string, LessonDetailResponse[]>;
  loadingLessons: Set<string>;
  onToggleChapter: (chapterId: string) => void;
  onAddChapter: () => void;
  onEditChapter: (chapter: ChapterDetailResponse) => void;
  onDeleteChapter: (chapterId: string, chapterName: string) => void;
  onAddLesson: (chapterId: string) => void;
  onEditLesson: (lesson: LessonDetailResponse, chapterId: string) => void;
  onPreviewLesson: (lesson: LessonDetailResponse) => void;
  onDeleteLesson: (lessonId: string, lessonName: string, chapterId: string) => void;
}

export default function CourseContentTab({
  chapters,
  expandedChapters,
  chapterLessons,
  loadingLessons,
  onToggleChapter,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onPreviewLesson,
  onDeleteLesson,
}: CourseContentTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Danh sách chương ({chapters.length})</h3>
        <button
          onClick={onAddChapter}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm chương
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>Chưa có chương nào</p>
          <p className="text-sm">Nhấn &quot;Thêm chương&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onToggleChapter(chapter.id)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${expandedChapters.has(chapter.id) ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm font-medium text-gray-500">Chương {index + 1}</span>
                  <span className="font-medium text-gray-900">{chapter.chapterName}</span>
                  <span className="text-xs text-gray-400">({chapterLessons[chapter.id]?.length || 0} bài học)</span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onAddLesson(chapter.id)}
                    className="p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600 rounded transition-colors"
                    title="Thêm bài học"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEditChapter(chapter)}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                    title="Sửa chương"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteChapter(chapter.id, chapter.chapterName)}
                    className="p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                    title="Xóa chương"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {expandedChapters.has(chapter.id) && (
                <div className="border-t border-gray-200">
                  {chapter.description && (
                    <p className="text-sm text-gray-600 px-4 py-2 bg-gray-50/50">{chapter.description}</p>
                  )}
                  {/* Lessons list */}
                  <div className="divide-y divide-gray-100">
                    {loadingLessons.has(chapter.id) ? (
                      <div className="px-4 py-6 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Đang tải...
                      </div>
                    ) : chapterLessons[chapter.id] && chapterLessons[chapter.id].length > 0 ? (
                      chapterLessons[chapter.id].map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all duration-200 group"
                        >
                          <div 
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => onPreviewLesson(lesson)}
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold bg-accent/10 text-accent transition-all duration-200">
                              {lessonIndex + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-900 group-hover:text-accent transition-colors">{lesson.lessonName}</span>
                                {lesson.isFreePreview && (
                                  <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                    Miễn phí
                                  </span>
                                )}
                                {lesson.videoUrl && (
                                  <svg className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                )}
                              </div>
                              {lesson.videoUrl && (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Có video
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditLesson(lesson, chapter.id);
                              }}
                              className="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded transition-colors"
                              title="Sửa bài học"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLesson(lesson.id, lesson.lessonName, chapter.id);
                              }}
                              className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                              title="Xóa bài học"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-400 text-sm">
                        Chưa có bài học nào
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
