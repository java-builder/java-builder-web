"use client";

import { useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import CommentCard from "./CommentCard";
import ReplyModal from "./ReplyModal";
import toast from "react-hot-toast";
import CommentFilter from "./CommentFilter";

type CommentStatus = "ACTIVE" | "DELETED" | "ALL";

// Mock data with replies and avatars
const mockCourseComments = [
  {
    id: "1",
    content: "Bài học rất chi tiết, giảng viên giải thích dễ hiểu! Mình đã follow được hết các bước trong video.",
    author: "Phạm Văn D",
    authorEmail: "phamvand@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=68",
    courseTitle: "Spring Boot Backend End-to-End",
    lessonTitle: "Bài 1: Giới thiệu về Spring Boot",
    lessonId: "lesson-001",
    status: "ACTIVE" as const,
    createdAt: "19-01-2025 08:20:00",
    likes: 15,
    replies: [
      {
        id: "1-1",
        content: "Cảm ơn bạn! Nếu có thắc mắc gì cứ hỏi nhé.",
        author: "Admin",
        authorEmail: "admin@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "19-01-2025 09:00:00",
        isAdmin: true,
      },
    ],
  },
  {
    id: "2",
    content: "Phần code demo có thể share link GitHub không ạ? Mình muốn tham khảo thêm.",
    author: "Hoàng Thị E",
    authorEmail: "hoangthie@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=49",
    courseTitle: "Spring Boot Backend End-to-End",
    lessonTitle: "Bài 3: Spring Security JWT",
    lessonId: "lesson-003",
    status: "ACTIVE" as const,
    createdAt: "19-01-2025 14:30:00",
    likes: 8,
    replies: [],
  },
  {
    id: "3",
    content: "Video bị lỗi không xem được, mong admin kiểm tra lại.",
    author: "Vũ Văn F",
    authorEmail: "vuvanf@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=52",
    courseTitle: "Microservices với Spring Cloud",
    lessonTitle: "Bài 5: Service Discovery với Eureka",
    lessonId: "lesson-005",
    status: "ACTIVE" as const,
    createdAt: "18-01-2025 16:45:00",
    likes: 2,
    replies: [
      {
        id: "3-1",
        content: "Mình đã kiểm tra và fix lỗi rồi. Bạn thử refresh lại nhé!",
        author: "Admin",
        authorEmail: "admin@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "18-01-2025 17:00:00",
        isAdmin: true,
      },
      {
        id: "3-2",
        content: "Đã xem được rồi ạ, cảm ơn admin!",
        author: "Vũ Văn F",
        authorEmail: "vuvanf@example.com",
        authorAvatar: "https://i.pravatar.cc/150?img=52",
        createdAt: "18-01-2025 17:30:00",
        isAdmin: false,
      },
    ],
  },
  {
    id: "4",
    content: "Inappropriate content... spam spam spam!!!",
    author: "Bad User",
    authorEmail: "baduser@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=70",
    courseTitle: "Docker & Kubernetes",
    lessonTitle: "Bài 2: Docker Compose",
    lessonId: "lesson-002",
    status: "DELETED" as const,
    createdAt: "17-01-2025 11:20:00",
    likes: 0,
    replies: [],
  },
  {
    id: "5",
    content: "Cảm ơn thầy, em đã hiểu rõ về Kafka partitions! Giải thích rất dễ hiểu và có ví dụ thực tế.",
    author: "Đỗ Thị G",
    authorEmail: "dothig@example.com",
    authorAvatar: "https://i.pravatar.cc/150?img=44",
    courseTitle: "Apache Kafka Fundamentals",
    lessonTitle: "Bài 4: Kafka Partitions và Consumer Groups",
    lessonId: "lesson-004",
    status: "ACTIVE" as const,
    createdAt: "18-01-2025 10:15:00",
    likes: 20,
    replies: [],
  },
];

export default function CourseCommentsTab() {
  const [statusFilter, setStatusFilter] = useState<CommentStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<typeof mockCourseComments[0] | null>(null);
  const { confirm } = useConfirm();

  const filteredComments = mockCourseComments.filter((comment) => {
    const matchesStatus =
      statusFilter === "ALL" || comment.status === statusFilter;
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: mockCourseComments.length,
    active: mockCourseComments.filter((c) => c.status === "ACTIVE").length,
    deleted: mockCourseComments.filter((c) => c.status === "DELETED").length,
  };

  const handleDelete = async (id: string) => {
    const comment = mockCourseComments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
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
    const comment = mockCourseComments.find((c) => c.id === id);
    if (!comment) return;

    await confirm(
      async () => {
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
    const comment = mockCourseComments.find((c) => c.id === id);
    if (!comment) return;

    setSelectedComment(comment);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = async (content: string) => {
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
              type="course"
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
