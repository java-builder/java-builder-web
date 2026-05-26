"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/post.service";
import { PostDetail } from "@/types/post";
import PostList from "@/components/posts/PostList";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useI18n } from "@/contexts/I18nContext";

export default function MyPostsTab() {
  const { t } = useI18n();
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
        toast.error(t("profilePage.myPostsTab.loadFailed"));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [page, t]);

  const router = useRouter();
  const [confirmPost, setConfirmPost] = useState<PostDetail | null>(null);

  const handleEdit = (post: PostDetail) => {
    router.push(`/qna/edit/${post.slug}`);
  };

  const handleDeleteClick = (post: PostDetail) => {
    setConfirmPost(post);
  };

  const handleConfirmDelete = async () => {
    if (!confirmPost) return;
    try {
      await postService.delete(confirmPost.id);
      setPosts((prev) => prev.filter((p) => p.id !== confirmPost.id));
      toast.success(t("profilePage.myPostsTab.deleteSuccess"));
    } catch (e) {
      console.error("Failed to delete post", e);
      toast.error(t("profilePage.myPostsTab.deleteFailed"));
    } finally {
      setConfirmPost(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("profilePage.myPostsTab.title")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("profilePage.myPostsTab.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading && posts.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">{t("profilePage.myPostsTab.loading")}</div>
        ) : (
          <>
            <PostList posts={posts} showActions onEdit={handleEdit} onDelete={handleDeleteClick} />
            {page < totalPages && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  {t("profilePage.myPostsTab.loadMore")}
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
          title={t("profilePage.myPostsTab.deleteConfirmTitle")}
          message={t("profilePage.myPostsTab.deleteConfirmMsg").replace("{title}", confirmPost?.title || "")}
          confirmText={t("profilePage.myPostsTab.deleteBtn")}
          cancelText={t("profilePage.myPostsTab.cancelBtn")}
          type="danger"
        />
      )}
    </div>
  );
}


