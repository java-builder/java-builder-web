import Link from "next/link";
import Image from "next/image";
import { CourseDetailResponse, CourseLevel, CourseFormat } from "@/types/course";
import { LevelBadge } from "./LevelBadge";
import { formatReadableDate } from "@/utils/dateUtils";
import { formatPrice } from "@/utils/formatters";
import { 
  Clock, 
  Coins, 
  Calendar, 
  MoreHorizontal, 
  ExternalLink, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2,
  BookOpen
} from "lucide-react";

interface CourseCardProps {
  course: CourseDetailResponse;
  openMenuId: string | null;
  isDeleting: string;
  onMenuToggle: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onEnroll: (courseId: string, courseTitle: string) => void;
}

export const CourseCard = ({
  course,
  openMenuId,
  isDeleting,
  onMenuToggle,
  onDelete,
  onEnroll,
}: CourseCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-32 h-40 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-accent/60" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg mb-1 truncate" title={course.title}>
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <LevelBadge level={course.level || CourseLevel.BEGINNER} />
                  </div>
                  {course.courseFormat && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${course.courseFormat === CourseFormat.VIDEO
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        : course.courseFormat === CourseFormat.TEXT
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                    >
                      {course.courseFormat === CourseFormat.VIDEO
                        ? "Video"
                        : course.courseFormat === CourseFormat.TEXT
                          ? "Văn bản"
                          : "Kết hợp"}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground/85" />
                    <span>{course.duration || 0} giờ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-muted-foreground/85" />
                    <span className="font-semibold text-foreground">{formatPrice(course.price)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground/85" />
                    <span className="text-xs">{course.createdAt ? formatReadableDate(course.createdAt) : "-"}</span>
                  </div>
                </div>
              </div>

              {/* Actions Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuToggle(course.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-border/40"
                  title="Thao tác"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === course.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => onMenuToggle("")}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-xl border border-border py-1 z-40">
                      <Link
                        href={`/courses/${course.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => onMenuToggle("")}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        Xem trước
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/enrollments`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => onMenuToggle("")}
                      >
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Xem học viên
                      </Link>
                      <button
                        onClick={() => {
                          onEnroll(course.id, course.title);
                          onMenuToggle("");
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                      >
                        <UserPlus className="w-4 h-4 text-muted-foreground" />
                        Thêm học viên
                      </button>
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => onMenuToggle("")}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                        Chỉnh sửa
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={() => {
                          onDelete(course.id, course.title);
                          onMenuToggle("");
                        }}
                        disabled={isDeleting === course.id}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 text-left"
                      >
                        {isDeleting === course.id ? (
                          <span className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Xóa khóa học
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
