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
import { Button } from "@/components/ui/button";

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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
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
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {/* Type chip */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-2.5 py-0.5 text-[11px] font-semibold text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm dark:bg-background/90">
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
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {blog.title}
        </h3>

        {/* Summary */}
        {blog.summary && (
          <div className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer push footer xuống đáy */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
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
          <span className="ml-auto truncate text-muted-foreground/80">
            {formatApiDate(blog.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPreview(blog)}
              className="flex-1"
            >
              <Eye className="h-3.5 w-3.5" />
              Xem
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(blog)}
            className="flex-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDelete(blog.id, blog.title)}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Đang xoá..." : "Xoá"}
          </Button>
        </div>
      </div>
    </article>
  );
}
