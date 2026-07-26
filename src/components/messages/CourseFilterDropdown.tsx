import { RefObject } from "react";
import Image from "next/image";
import { BookOpen, ChevronDown, Loader2, GraduationCap, Check, Video, FileText, Clock } from "lucide-react";

export interface CourseItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  level?: string;
  courseFormat?: string;
  duration?: number;
  completedLessons?: number;
  totalLessons?: number;
  progress?: number;
}

interface CourseFilterDropdownProps {
  isLoadingCourses: boolean;
  selectedCourseId: string;
  isCourseDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onSelectCourse: (courseId: string) => void;
  myCourses: CourseItem[];
  dropdownRef: RefObject<HTMLDivElement | null>;
}

export default function CourseFilterDropdown({
  isLoadingCourses,
  selectedCourseId,
  isCourseDropdownOpen,
  onToggleDropdown,
  onSelectCourse,
  myCourses,
  dropdownRef,
}: CourseFilterDropdownProps) {
  return (
    <div
      className="px-3 py-2 border-b border-border bg-muted/20 flex items-center justify-between gap-2 text-xs relative"
      ref={dropdownRef}
    >
      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold shrink-0">
        <BookOpen className="w-3.5 h-3.5 text-accent" />
        <span>Khóa học:</span>
      </div>

      {isLoadingCourses ? (
        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
          <span>Đang tải khóa...</span>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={onToggleDropdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-input bg-background/90 text-foreground text-xs font-semibold hover:border-accent hover:text-accent focus:outline-none transition-all shadow-2xs max-w-[170px] cursor-pointer"
          >
            <span className="truncate">
              {selectedCourseId === "ALL"
                ? `Tất cả khóa (${myCourses.length})`
                : myCourses.find((c) => c.id === selectedCourseId)?.title || "Chọn khóa học"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                isCourseDropdownOpen ? "rotate-180 text-accent" : ""
              }`}
            />
          </button>
        </div>
      )}

      {/* Course Dropdown Popover */}
      {!isLoadingCourses && isCourseDropdownOpen && (
        <div className="absolute left-3 right-3 top-full mt-1.5 z-50 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-2.5 space-y-2 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <GraduationCap className="w-4 h-4 text-accent shrink-0" />
              Khóa học đã đăng ký
            </span>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-extrabold shrink-0">
              {myCourses.length} khóa
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
            {/* "Tất cả khóa học" Option */}
            <button
              type="button"
              onClick={() => onSelectCourse("ALL")}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left cursor-pointer group ${
                selectedCourseId === "ALL"
                  ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                  : "text-foreground hover:bg-muted/80 hover:text-accent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    selectedCourseId === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate text-xs">Tất cả khóa học</p>
                  <p
                    className={`text-[10px] font-normal truncate ${
                      selectedCourseId === "ALL" ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    Hiển thị toàn bộ nhóm học
                  </p>
                </div>
              </div>
              {selectedCourseId === "ALL" && <Check className="w-4 h-4 shrink-0 text-white ml-2" />}
            </button>

            {/* Specific Course Options */}
            {myCourses.map((course) => {
              const isSelected = selectedCourseId === course.id;
              const levelUpper = String(course.level || "").toUpperCase();
              const levelText = levelUpper.includes("INTERMEDIATE")
                ? "Trung cấp"
                : levelUpper.includes("BEGINNER")
                ? "Cơ bản"
                : levelUpper.includes("ADVANCED")
                ? "Nâng cao"
                : levelUpper.includes("EXPERT")
                ? "Chuyên gia"
                : "Trung cấp";

              const formatUpper = String(course.courseFormat || "").toUpperCase();
              const formatText = formatUpper.includes("VIDEO")
                ? "Video"
                : formatUpper.includes("TEXT") || formatUpper.includes("DOC")
                ? "Tài liệu"
                : formatUpper.includes("MIXED")
                ? "Hỗn hợp"
                : "Video";

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => onSelectCourse(course.id)}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                    isSelected
                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/25"
                      : "bg-card border-border/70 hover:border-accent/50 hover:bg-accent/5 text-foreground"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border relative flex items-center justify-center ${
                        isSelected ? "border-white/30 bg-white/10" : "border-border bg-muted/30"
                      }`}
                    >
                      {course.thumbnailUrl ? (
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.title}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <BookOpen className={`w-4.5 h-4.5 ${isSelected ? "text-white" : "text-accent"}`} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-bold truncate text-xs leading-snug">{course.title}</p>
                      <div className="flex flex-wrap items-center gap-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                            isSelected ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                          }`}
                        >
                          {levelText}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 ${
                            isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {course.courseFormat === "VIDEO" ? (
                            <Video className="w-2.5 h-2.5" />
                          ) : (
                            <FileText className="w-2.5 h-2.5" />
                          )}
                          {formatText}
                        </span>
                        {typeof course.duration === "number" && course.duration > 0 && (
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 ${
                              isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Clock className="w-2.5 h-2.5" />
                            {course.duration}h
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-medium pt-0.5">
                        <span className={isSelected ? "text-white/90" : "text-muted-foreground"}>
                          {course.completedLessons || 0}/{course.totalLessons || 0} bài học
                        </span>
                        <span className={`font-bold ${isSelected ? "text-white" : "text-accent"}`}>
                          {course.progress || 0}%
                        </span>
                      </div>
                      <div
                        className={`w-full h-1 rounded-full overflow-hidden ${
                          isSelected ? "bg-white/20" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isSelected ? "bg-white" : "bg-accent"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, course.progress || 0))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 shrink-0 text-white ml-2 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
