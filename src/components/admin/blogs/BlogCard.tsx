import Image from "next/image";
import {
  Eye,
  FolderOpen,
  Heart,
  ImageOff,
  Loader2,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "./BlogTypeIcon";
import MarkdownRenderer from "./MarkdownRenderer";
import { formatApiDate } from "@/utils/dateUtils";

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string, title: string) => void;
  onPreview?: (blog: Blog) => void;
  isDeleting?: boolean;
}

export default function BlogCard({
  blog,
  onEdit,
  onDelete,
  onPreview,
  isDeleting,
}: BlogCardProps) {
  const tags = blog.tags ?? [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
        {blog.thumbnailUrl ? (
          <Image
            src={blog.thumbnailUrl}
            alt={blog.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {/* Type chip */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm dark:bg-slate-900/90 dark:text-gray-200 dark:ring-slate-700">
            <BlogTypeIcon
              blogType={blog.blogType}
              className="h-3 w-3 text-accent"
            />
            {BlogTypeDisplayNames[blog.blogType]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors dark:text-white">
          {blog.title}
        </h3>

        {/* Summary */}
        {blog.summary && (
          <div className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            <MarkdownRenderer content={blog.summary} className="line-clamp-2" />
          </div>
        )}

        {/* Category + Tags */}
        {(blog.categoryName || tags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blog.categoryName && (
              <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                <FolderOpen className="h-3 w-3" />
                {blog.categoryName}
              </span>
            )}
            {tags.slice(0, 3).map((tag, index) => {
              const key = typeof tag === "string" ? tag : tag.id || index;
              const label = typeof tag === "string" ? tag : tag.name;
              return (
                <span
                  key={key}
                  className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
                >
                  #{label}
                </span>
              );
            })}
            {tags.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer push footer xuống đáy */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Eye className="h-3.5 w-3.5" />
            {blog.viewCount}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Heart className="h-3.5 w-3.5" />
            {blog.likeCount}
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <MessageSquare className="h-3.5 w-3.5" />
            {blog.commentCount}
          </span>
          <span className="ml-auto truncate text-gray-400 dark:text-gray-500">
            {formatApiDate(blog.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 dark:border-slate-700">
          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(blog)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
            >
              <Eye className="h-3.5 w-3.5" />
              Xem
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(blog)}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </button>
          <button
            type="button"
            onClick={() => onDelete(blog.id, blog.title)}
            disabled={isDeleting}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </article>
  );
}
