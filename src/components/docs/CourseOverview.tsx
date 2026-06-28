import { useState, useEffect } from "react";
import { CourseDetailResponse, LessonDetailResponse } from "@/types/course";
import { formatDate } from "@/utils/formatters";
import { 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Calendar, 
  ChevronDown, 
  Video, 
  FileText, 
  Lock, 
  CheckCircle2 
} from "lucide-react";

interface CourseOverviewProps {
  course: CourseDetailResponse;
  chapterLessons?: Record<string, LessonDetailResponse[]>;
  onLessonClick?: (lessonId: string) => void;
  selectedLessonId?: string | null;
}

export default function CourseOverview({ 
  course, 
  chapterLessons, 
  onLessonClick, 
  selectedLessonId 
}: CourseOverviewProps) {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Auto-expand chapter containing the selected lesson
  useEffect(() => {
    if (selectedLessonId && course.chapters) {
      const activeChapter = course.chapters.find(ch => {
        const lessons = chapterLessons?.[ch.id] || ch.lessons || [];
        return lessons.some(l => l.id === selectedLessonId);
      });
      if (activeChapter) {
        setExpandedChapters(prev => ({
          ...prev,
          [activeChapter.id]: true
        }));
      }
    }
  }, [selectedLessonId, course.chapters, chapterLessons]);

  const levelText: Record<string, string> = {
    BEGINNER: "Cơ bản",
    INTERMEDIATE: "Trung cấp",
    ADVANCED: "Nâng cao",
    EXPERT: "Chuyên gia"
  };

  const levelDisplay = course.level ? (levelText[course.level] || course.level) : "Chưa xác định";
  const totalLessons = course.chapters?.reduce((sum, ch) => {
    const lessons = chapterLessons?.[ch.id] || ch.lessons || [];
    return sum + (lessons.length || 0);
  }, 0) || 0;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Course Info Cards */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-accent" />
          Thông tin khóa học
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Level */}
          <div className="group relative overflow-hidden flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 hover:border-accent/40 dark:hover:border-accent/40">
            <div className="w-12 h-12 bg-accent/10 text-accent dark:text-sky-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cấp độ</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{levelDisplay}</p>
            </div>
          </div>

          {/* Card 2: Chapters */}
          <div className="group relative overflow-hidden flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 hover:border-accent/40 dark:hover:border-accent/40">
            <div className="w-12 h-12 bg-accent/10 text-accent dark:text-sky-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số chương</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{course.chapters?.length || 0} chương</p>
            </div>
          </div>

          {/* Card 3: Lessons */}
          <div className="group relative overflow-hidden flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 hover:border-accent/40 dark:hover:border-accent/40">
            <div className="w-12 h-12 bg-accent/10 text-accent dark:text-sky-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tổng số bài học</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{totalLessons} bài học</p>
            </div>
          </div>

          {/* Card 4: Last Updated */}
          <div className="group relative overflow-hidden flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-gray-200/80 dark:border-slate-700/60 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 hover:border-accent/40 dark:hover:border-accent/40">
            <div className="w-12 h-12 bg-accent/10 text-accent dark:text-sky-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cập nhật</p>
              <p className="font-bold text-gray-900 dark:text-white mt-0.5">{formatDate(course.updatedAt || course.createdAt)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Syllabus List */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-accent" />
          Nội dung khóa học
        </h2>
        
        <div className="relative ml-2 sm:ml-4 pl-4 sm:pl-6 border-l-2 border-gray-200 dark:border-slate-800 space-y-6">
          {course.chapters?.map((chapter, index) => {
            const isExpanded = !!expandedChapters[chapter.id];
            const lessons = chapterLessons?.[chapter.id] || chapter.lessons || [];
            const lessonsCount = lessons.length;
            
            return (
              <div key={chapter.id} className="relative group">
                {/* Timeline Bullet */}
                <div className={`absolute -left-[25px] sm:-left-[33px] top-6 flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${
                  isExpanded 
                    ? "border-accent bg-accent text-white scale-110 shadow-sm" 
                    : "border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 group-hover:border-accent"
                }`} />
                
                {/* Horizontal Connector Line */}
                <div className={`absolute -left-2 sm:-left-4 top-8 w-2 sm:w-4 h-0.5 transition-colors duration-300 z-0 ${
                  isExpanded 
                    ? "bg-accent/40" 
                    : "bg-gray-200 dark:bg-slate-700/60 group-hover:bg-accent/30"
                }`} />
                
                {/* Accordion Card */}
                <div className={`overflow-hidden bg-white dark:bg-slate-800 border rounded-2xl transition-all duration-300 ${
                  isExpanded 
                    ? "border-accent/40 shadow-lg shadow-accent/5 dark:shadow-black/25" 
                    : "border-gray-200 dark:border-slate-700/80 hover:border-gray-300 dark:hover:border-slate-650 hover:shadow-md"
                }`}>
                  {/* Chapter Header */}
                  <button 
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 focus:outline-none cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-bold text-accent dark:text-sky-400 uppercase tracking-wider">
                          Chương {index + 1}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600" />
                        <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                          {lessonsCount} bài học
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors duration-200 leading-snug">
                        {chapter.chapterName}
                      </h3>
                      
                      {chapter.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">
                          {chapter.description}
                        </p>
                      )}
                    </div>
                    
                    <div className={`p-1.5 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 mt-1 transition-all duration-300 ${
                      isExpanded 
                        ? "rotate-180 text-accent dark:text-sky-400 bg-accent/10 dark:bg-accent/20" 
                        : "group-hover:bg-gray-100 dark:group-hover:bg-slate-700"
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Chapter Lessons list */}
                  {isExpanded && (
                    <div className="border-t border-gray-150 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/40 divide-y divide-gray-100 dark:divide-slate-700/30">
                      {lessonsCount > 0 ? (
                        lessons.map((lesson) => {
                          const isSelected = selectedLessonId === lesson.id;
                          const isLocked = lesson.canAccess === false;
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => !isLocked && onLessonClick?.(lesson.id)}
                              disabled={isLocked && !lesson.isFreePreview}
                              className={`w-full text-left px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-250 group/lesson ${
                                isSelected 
                                  ? "bg-accent/5 dark:bg-accent/10 border-l-[3px] sm:border-l-4 border-accent" 
                                  : "border-l-[3px] sm:border-l-4 border-transparent hover:bg-gray-100/60 dark:hover:bg-slate-700/40"
                              } ${
                                isLocked && !lesson.isFreePreview 
                                  ? "cursor-not-allowed opacity-60" 
                                  : "cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                                {/* Format/Status Icon */}
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-250 ${
                                  isSelected 
                                    ? "bg-accent/10 text-accent dark:text-sky-400" 
                                    : "bg-gray-100 dark:bg-slate-700/70 text-gray-500 dark:text-gray-400 group-hover/lesson:bg-accent/10 group-hover/lesson:text-accent dark:group-hover/lesson:text-sky-400"
                                }`}>
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                                  ) : lesson.lessonFormat === "VIDEO" ? (
                                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  )}
                                </div>
                                
                                <div className="min-w-0">
                                  <p className={`text-xs sm:text-sm font-semibold truncate transition-colors duration-200 ${
                                    isSelected 
                                      ? "text-accent dark:text-sky-400" 
                                      : "text-gray-800 dark:text-slate-200 group-hover/lesson:text-accent dark:group-hover/lesson:text-sky-400"
                                  }`}>
                                    {lesson.lessonName}
                                  </p>
                                  {lesson.description && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Action/Badge Indicator */}
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                {lesson.isFreePreview && (
                                  <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 px-1.5 sm:px-2 py-0.5 rounded shadow-sm">
                                    Học thử
                                  </span>
                                )}
                                {isLocked && !lesson.isFreePreview ? (
                                  <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400 dark:text-slate-500" />
                                ) : (
                                  <span className={`text-[10px] sm:text-xs font-semibold text-accent dark:text-sky-400 md:opacity-0 md:group-hover/lesson:opacity-100 transition-opacity duration-200 ${
                                    isSelected ? "opacity-100" : "opacity-100 md:opacity-0"
                                  }`}>
                                    {isSelected ? "Đang học" : "Học ngay →"}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-5 text-center text-sm text-gray-500 dark:text-slate-400">
                          Nội dung chương đang được cập nhật
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
