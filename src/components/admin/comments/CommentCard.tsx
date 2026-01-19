import Image from "next/image";
import { formatRelativeTime } from "@/utils/dateUtils";

interface Reply {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  createdAt: string;
  isAdmin?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  authorAvatar: string;
  status: "ACTIVE" | "DELETED";
  createdAt: string;
  likes: number;
  blogTitle?: string;
  blogSlug?: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonId?: string;
  replies?: Reply[];
}

interface CommentCardProps {
  comment: Comment;
  type: "blog" | "course";
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onReply: (id: string) => void;
}

export default function CommentCard({
  comment,
  type,
  onDelete,
  onRestore,
  onReply,
}: CommentCardProps) {
  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-200 ${
      comment.status === "DELETED" 
        ? "border-red-200 bg-red-50/30" 
        : "border-gray-200 hover:border-accent/30 hover:shadow-md"
    }`}>
      {/* Main Comment */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100">
              <Image
                src={comment.authorAvatar}
                alt={comment.author}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {comment.author}
                  </h4>
                  {comment.status === "ACTIVE" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Hiển thị
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Đã xóa
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{comment.authorEmail}</p>
              </div>
              <span className="text-xs text-gray-400">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            {/* Comment Content */}
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {comment.content}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Blog/Course Info */}
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {type === "blog" ? (
                    <span className="font-medium">{comment.blogTitle}</span>
                  ) : (
                    <div>
                      <span className="font-medium">{comment.courseTitle}</span>
                      <span className="mx-1">•</span>
                      <span>{comment.lessonTitle}</span>
                    </div>
                  )}
                </div>

                {/* Likes */}
                <div className="flex items-center text-xs text-gray-500">
                  <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{comment.likes}</span>
                </div>

                {/* Replies Count */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="font-medium">{comment.replies.length} phản hồi</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onReply(comment.id)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-accent hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Trả lời
                </button>

                {comment.status === "ACTIVE" ? (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                ) : (
                  <button
                    onClick={() => onRestore(comment.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Khôi phục
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex items-start space-x-3">
                {/* Reply Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white">
                    <Image
                      src={reply.authorAvatar}
                      alt={reply.author}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Reply Content */}
                <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-900">
                        {reply.author}
                      </span>
                      {reply.isAdmin && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent text-white">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
