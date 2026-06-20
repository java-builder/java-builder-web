"use client";

import { useState, useEffect } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import ReplyModal from "./ReplyModal";
import toast from "react-hot-toast";
import CommentFilter from "./CommentFilter";
import CommentCard from "./CommentCard";
import { commentApi } from "@/services/comment.service";
import { CommentDetailResponse } from "@/types/comment";
import { Pagination } from "@/components/ui/Pagination";

type CommentStatus = "ACTIVE" | "DELETED" | "ALL";

export default function DocsCommentsTab() {
  const [statusFilter, setStatusFilter] = useState<CommentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const { confirm } = useConfirm();

  const fetchComments = async (page: number, commentStatus?: "ACTIVE" | "DELETED") => {
    try {
      setLoading(true);
      const response = await commentApi.getCommentsForAdmin({
        page,
        size: 10,
        type: "DOCS",
        status: commentStatus,
      });

      if (response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Không thể tải bình luận");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      const result = await fetchComments(
        currentPage,
        statusFilter === "ALL" ? undefined : statusFilter
      );
      
      if (result) {
        setComments(result.data);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      }
    };

    loadComments();
  }, [currentPage, statusFilter]);

  const filteredComments = comments.filter((comment) => {
    if (!searchQuery) return true;
    return (
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const stats = {
    total: comments.length,
    active: comments.filter((c) => c.status === "ACTIVE").length,
    deleted: comments.filter((c) => c.status === "DELETED").length,
  };

  const handleDelete = async (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
        await commentApi.delete(id);
        setComments(comments.filter((c) => c.id !== id));
      },
      {
        title: "Xác nhận xóa bình luận",
        message: `Bạn có chắc chắn muốn xóa bình luận của <strong>${comment.username}</strong>?<br/><br/><em class="text-gray-600">"${comment.content.substring(0, 100)}..."</em>`,
        confirmText: "Xóa bình luận",
        cancelText: "Hủy bỏ",
        type: "error",
      }
    );
  };

  const handleRestore = async (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
        console.log("Restore comment:", id);
        toast.success("Đã khôi phục bình luận");
      },
      {
        title: "Xác nhận khôi phục",
        message: `Khôi phục bình luận của <strong>${comment.username}</strong>?`,
        confirmText: "Khôi phục",
        cancelText: "Hủy bỏ",
        type: "warning",
      }
    );
  };

  const handleReply = (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async (content: string) => {
    if (!selectedComment) return;

    try {
      await commentApi.create({
        targetId: selectedComment.targetId || "",
        targetType: selectedComment.targetType || "DOCS",
        parentId: selectedComment.id,
        content,
      });
      toast.success("Đã gửi phản hồi");
      setReplyModalOpen(false);
      setSelectedComment(null);
    } catch {
      toast.error("Không thể gửi phản hồi");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tổng bình luận</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Đang hiển thị</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.active}</p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Đã xóa</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.deleted}</p>
        </div>
      </div>

      {/* Filter */}
      <CommentFilter
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
              <svg
                className="w-20 h-20 text-muted-foreground/40 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p className="text-muted-foreground text-base font-semibold">Không có bình luận nào</p>
              <p className="text-muted-foreground/80 text-xs mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={{
                  id: comment.id,
                  content: comment.content,
                  author: comment.username,
                  authorEmail: "",
                  authorAvatar: comment.avatar || `https://i.pravatar.cc/150?u=${comment.username}`,
                  status: comment.status,
                  createdAt: comment.createdAt,
                  likes: 0,
                  replies: [],
                }}
                repliesCount={comment.repliesCount}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onReply={handleReply}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemName="bình luận"
        />
      )}

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setSelectedComment(null);
        }}
        onSubmit={handleSubmitReply}
        commentAuthor={selectedComment?.username || ""}
        commentContent={selectedComment?.content || ""}
      />
    </div>
  );
}
