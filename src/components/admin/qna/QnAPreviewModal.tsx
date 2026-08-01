"use client";

import { X, Eye, ExternalLink, Calendar, MessageSquare, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostDetail } from "@/types/post";
import Link from "next/link";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface QnAPreviewModalProps {
  post: PostDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QnAPreviewModal({ post, isOpen, onClose }: QnAPreviewModalProps) {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Xem Trước Bài Viết</h2>
              <p className="text-xs text-muted-foreground">Giao diện xem chi tiết câu hỏi của người dùng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Post Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2">
            {post.isSolved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã giải quyết
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              <Tag className="w-3.5 h-3.5" />
              {post.category?.name || "Thảo luận"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground leading-snug">{post.title}</h1>

          {/* Author bar */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              {post.author?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={post.author.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-semibold flex items-center justify-center">
                  {(post.author?.username || "A").substring(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">{post.author?.username || "Tác giả"}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {post.createdAt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.viewCount || 0} lượt xem
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                {post.commentCount || 0} bình luận
              </span>
            </div>
          </div>

          {/* Rendered Body Content via PublicMarkdownRenderer */}
          <div className="p-5 rounded-lg border border-border bg-background">
            <PublicMarkdownRenderer content={post.content} className="prose-sm sm:prose max-w-full dark:prose-invert" />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {post.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-foreground border border-border">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          {post.slug ? (
            <Link
              href={`/qna/${post.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mở trên giao diện người dùng
            </Link>
          ) : (
            <div />
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
