"use client";

import { useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import ReplyModal from "./ReplyModal";
import toast from "react-hot-toast";
import CommentFilter from "./CommentFilter";
import CommentCard from "./CommentCard";

type CommentStatus = "ACTIVE" | "DELETED" | "ALL";

// Mock data with replies and avatars
const mockBlogComments = [
  {
    id: "1",
    content: "Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ kiến thức về Kafka. Mình đang tìm hiểu về message queue và bài viết này giúp mình hiểu rõ hơn nhiều.",
    author: "Nguyễn Văn A",
    authorEmail: "nguyenvana@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=12",
    blogTitle: "Kafka vs @Async: Xử lý đồng thời đúng cách",
    blogSlug: "kafka-vs-async-xu-ly-dong-thoi-dung-cach",
    status: "ACTIVE" as const,
    createdAt: "19-01-2025 10:30:00",
    likes: 12,
    replies: [
      {
        id: "1-1",
        content: "Cảm ơn bạn đã đọc! Rất vui khi bài viết giúp ích được cho bạn.",
        author: "Admin",
        authorEmail: "admin@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "19-01-2025 11:00:00",
        isAdmin: true,
      },
    ],
  },
  {
    id: "2",
    content: "Mình có thể áp dụng Kafka cho dự án nhỏ không? Hay nên dùng RabbitMQ?",
    author: "Trần Thị B",
    authorEmail: "tranthib@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=45",
    blogTitle: "Kafka vs @Async: Xử lý đồng thời đúng cách",
    blogSlug: "kafka-vs-async-xu-ly-dong-thoi-dung-cach",
    status: "ACTIVE" as const,
    createdAt: "19-01-2025 11:15:00",
    likes: 5,
    replies: [],
  },
  {
    id: "3",
    content: "Spam content here... Click this link to win money!!!",
    author: "Spammer",
    authorEmail: "spam@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=60",
    blogTitle: "Spring Boot 4: Tổng hợp các tính năng mới",
    blogSlug: "spring-boot-4-tinh-nang-moi",
    status: "DELETED" as const,
    createdAt: "18-01-2025 14:20:00",
    likes: 0,
    replies: [],
  },
  {
    id: "4",
    content: "Code example rất dễ hiểu, thanks! Mình đã apply vào project và chạy ngon lành.",
    author: "Lê Văn C",
    authorEmail: "levanc@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=33",
    blogTitle: "Spring Method Security",
    blogSlug: "spring-method-security",
    status: "ACTIVE" as const,
    createdAt: "18-01-2025 09:45:00",
    likes: 8,
    replies: [
      {
        id: "4-1",
        content: "Tuyệt vời! Nếu có thắc mắc gì cứ hỏi nhé.",
        author: "Admin",
        authorEmail: "admin@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "18-01-2025 10:00:00",
        isAdmin: true,
      },
      {
        id: "4-2",
        content: "Mình cũng đang dùng Spring Security, bài viết này rất hữu ích!",
        author: "Phạm Thị D",
        authorEmail: "phamthid@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=47",
        createdAt: "18-01-2025 14:30:00",
        isAdmin: false,
      },
    ],
  },
];

export default function BlogCommentsTab() {
  const [statusFilter, setStatusFilter] = useState<CommentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<typeof mockBlogComments[0] | null>(null);
  const { confirm } = useConfirm();

  const filteredComments = mockBlogComments.filter((comment) => {
    const matchesStatus =
      statusFilter === "ALL" || comment.status === statusFilter;
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.blogTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: mockBlogComments.length,
    active: mockBlogComments.filter((c) => c.status === "ACTIVE").length,
    deleted: mockBlogComments.filter((c) => c.status === "DELETED").length,
  };

  const handleDelete = async (id: string) => {
    const comment = mockBlogComments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
        // TODO: Call API to delete comment
        console.log("Delete comment:", id);
        toast.success("Đã xóa bình luận");
      },
      {
        title: "Xác nhận xóa bình luận",
        message: `Bạn có chắc chắn muốn xóa bình luận của <strong>${comment.author}</strong>?<br/><br/><em class="text-gray-600">"${comment.content.substring(0, 100)}..."</em>`,
        confirmText: "Xóa bình luận",
        cancelText: "Hủy bỏ",
        type: "error",
      }
    );
  };

  const handleRestore = async (id: string) => {
    const comment = mockBlogComments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
        // TODO: Call API to restore comment
        console.log("Restore comment:", id);
        toast.success("Đã khôi phục bình luận");
      },
      {
        title: "Xác nhận khôi phục",
        message: `Khôi phục bình luận của <strong>${comment.author}</strong>?`,
        confirmText: "Khôi phục",
        cancelText: "Hủy bỏ",
        type: "warning",
      }
    );
  };

  const handleReply = (id: string) => {
    const comment = mockBlogComments.find((c) => c.id === id);
    if (!comment) return;

    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async (content: string) => {
    // TODO: Call API to submit reply
    console.log("Reply to comment:", selectedComment?.id, "Content:", content);
    toast.success("Đã gửi phản hồi");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Tổng bình luận</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Đang hiển thị</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Đã xóa</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.deleted}</p>
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
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
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
            <p className="text-gray-500 text-lg font-medium">Không có bình luận nào</p>
            <p className="text-gray-400 text-sm mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              type="blog"
              onDelete={handleDelete}
              onRestore={handleRestore}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setSelectedComment(null);
        }}
        onSubmit={handleSubmitReply}
        commentAuthor={selectedComment?.author || ""}
        commentContent={selectedComment?.content || ""}
      />
    </div>
  );
}
