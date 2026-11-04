import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Blog, BlogTypeDisplayNames } from "@/types/blog";
import BlogTypeIcon from "@/components/admin/blogs/BlogTypeIcon";
import { formatRelativeTime } from "@/utils/dateUtils";
import AuthRequiredModal from "@/components/ui/auth-required-modal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowRight, Eye, Heart, MessageSquare } from "lucide-react";

interface PublicBlogCardProps {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: PublicBlogCardProps) {
  const { t } = useI18n();
  const { data: currentUser } = useCurrentUser();

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleReadMoreClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setAuthModal({
        isOpen: true,
        title: "Đăng nhập để đọc bài viết",
        message: "Bạn cần đăng nhập để đọc đầy đủ nội dung bài viết này.",
      });
      return;
    }
  };

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5">
      {blog.thumbnailUrl && (
        <Link href={`/blogs/${blog.slug}`} onClick={handleReadMoreClick} className="block relative flex-shrink-0">
          <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-900">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      )}

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Header với type và date */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0E8] dark:bg-orange-950/40 text-[#FF5A1F] border border-[#FFD8C7] dark:border-orange-900/50">
              <BlogTypeIcon
                blogType={blog.blogType}
                className="w-3 h-3 text-[#FF5A1F]"
              />
              {BlogTypeDisplayNames[blog.blogType]}
            </span>
          </div>
          <time className="text-xs text-[#64748B] dark:text-slate-400" dateTime={blog.createdAt}>
            {formatRelativeTime(blog.createdAt, t)}
          </time>
        </div>

        {/* Title */}
        <Link href={`/blogs/${blog.slug}`} onClick={handleReadMoreClick} className="block mb-1.5">
          <h3 className="text-base font-bold text-[#171717] dark:text-white line-clamp-2 group-hover:text-[#FF5A1F] transition-colors duration-200 leading-snug">
            {blog.title}
          </h3>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="text-xs text-[#64748B] dark:text-slate-400 mb-3.5 line-clamp-2 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Category and Tags */}
        {(blog.categoryName || (blog.tags && blog.tags.length > 0)) && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {blog.categoryName && (
              <span className="inline-flex items-center px-2 py-0.5 bg-[#F8F8F8] dark:bg-slate-800 text-[#171717] dark:text-slate-200 border border-[#E8E8E8] dark:border-border rounded-full text-[11px] font-medium">
                {blog.categoryName}
              </span>
            )}
            {blog.tags && blog.tags.slice(0, 3).map((tag, index) => (
              <span key={typeof tag === 'string' ? tag : tag.id || index} className="inline-flex items-center px-2 py-0.5 bg-slate-50 dark:bg-slate-900 text-[#64748B] dark:text-slate-400 border border-[#E8E8E8] dark:border-border rounded-full text-[11px] font-medium">
                #{typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {blog.tags && blog.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-medium">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer với stats và author */}
        <div className="mt-auto pt-3 border-t border-[#E8E8E8] dark:border-border">
          <div className="flex items-center justify-between">
            {/* Stats section */}
            <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-slate-400">
              <span className="flex items-center gap-1" title="Lượt xem">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-medium">{blog.viewCount}</span>
              </span>

              <span className="flex items-center gap-1" title="Lượt thích">
                <Heart className="w-3.5 h-3.5" />
                <span className="font-medium">{blog.likeCount}</span>
              </span>

              <span className="flex items-center gap-1" title="Bình luận">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="font-medium">{blog.commentCount}</span>
              </span>
            </div>

            <Link
              href={`/blogs/${blog.slug}`}
              onClick={handleReadMoreClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A1F] hover:text-[#e04b16] transition-transform duration-200 group-hover:translate-x-0.5 cursor-pointer"
            >
              <span>Đọc tiếp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Author */}
          <div className="mt-2.5 pt-2.5 border-t border-[#E8E8E8]/70 dark:border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logos/java-logo.png"
                alt="JavaBuilder"
                width={18}
                height={18}
                className="rounded-full"
              />
              <span className="text-xs text-[#64748B] dark:text-slate-400">
                Tác giả: <span className="font-semibold text-[#171717] dark:text-slate-200">JavaBuilder</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        redirectTo={`/blogs/${blog.slug}`}
        title={authModal.title}
        message={authModal.message}
      />
    </article>
  );
}
