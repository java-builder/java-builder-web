 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/post.service";
import { PostDetail } from "@/types/post";
import PostList from "@/components/posts/PostList";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function MyPostsTab() {
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const resp = await postService.getMyPosts(page);
        if (resp?.data) {
          const items: PostDetail[] = Array.isArray(resp.data.data) ? resp.data.data : [];
          setPosts((prev) => (page === 1 ? items : [...prev, ...items]));
          setTotalPages(resp.data.totalPages ?? 1);
        }
      } catch (e) {
        console.error("Failed to load my posts", e);
        toast.error("Không thể tải bài viết của bạn");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [page]);

  const router = useRouter();
  const [confirmPost, setConfirmPost] = useState<PostDetail | null>(null);

  const handleEdit = (post: PostDetail) => {
    // navigate to edit page by id
    router.push(`/qna/edit/${post.id}`);
  };

  const handleDeleteClick = (post: PostDetail) => {
    setConfirmPost(post);
  };

  const handleConfirmDelete = async () => {
    if (!confirmPost) return;
    try {
      await postService.delete(confirmPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== confirmPost.id));
      toast.success("Đã xóa bài viết");
    } catch (e) {
      console.error("Failed to delete post", e);
      toast.error("Không thể xóa bài viết");
    } finally {
      setConfirmPost(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bài viết của tôi</h2>
            <p className="text-sm text-gray-500 mt-1">Danh sách câu hỏi/bài đăng bạn đã tạo</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading && posts.length === 0 ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : (
          <>
            <PostList posts={posts} showActions onEdit={handleEdit} onDelete={handleDeleteClick} />
            {page < totalPages && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Tải thêm
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {confirmPost && (
        <ConfirmModal
          isOpen={Boolean(confirmPost)}
          onClose={() => setConfirmPost(null)}
          onConfirm={handleConfirmDelete}
          title="Xóa bài viết"
          message={`Bạn có chắc muốn xóa bài viết \"${confirmPost?.title}\"?`}
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
        />
      )}
    </div>
  );
}


