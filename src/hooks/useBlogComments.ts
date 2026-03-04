import { Blog } from "@/types/blog";
import toast from "react-hot-toast";

export function useBlogComments(
  addComment: (content: string) => Promise<void>,
  replyToComment: (commentId: string, content: string) => Promise<void>,
  deleteComment: (commentId: string) => Promise<void>,
  setBlog: React.Dispatch<React.SetStateAction<Blog | null>>
) {
  const handleAddComment = async (content: string) => {
    try {
      await addComment(content);
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
      toast.success("Đăng bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể đăng bình luận");
    }
  };

  const handleReplyComment = async (commentId: string, content: string) => {
    try {
      await replyToComment(commentId, content);
      setBlog((prev) =>
        prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev
      );
      toast.success("Đăng câu trả lời phần bình luận thành công");
    } catch (err) {
      toast.error((err as Error).message || "Không thể gửi trả lời");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setBlog((prev) => {
        if (!prev) return prev;
        const nextCount = prev.commentCount > 0 ? prev.commentCount - 1 : 0;
        return { ...prev, commentCount: nextCount };
      });
      toast.success("Xóa bình luận thành công");
    } catch {
      toast.error("Không thể xóa bình luận");
    }
  };

  return {
    handleAddComment,
    handleReplyComment,
    handleDeleteComment,
  };
}
