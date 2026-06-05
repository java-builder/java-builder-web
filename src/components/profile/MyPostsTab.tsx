"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, FileText, Loader2, PenSquare } from "lucide-react";
import toast from "react-hot-toast";
import { postService } from "@/services/post.service";
import { PostDetail } from "@/types/post";
import PostList from "@/components/posts/PostList";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useI18n } from "@/contexts/I18nContext";
import SectionCard from "./SectionCard";

export default function MyPostsTab() {
  const { t } = useI18n();
  const router = useRouter();
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmPost, setConfirmPost] = useState<PostDetail | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const resp = await postService.getMyPosts(page);
        if (resp?.data) {
          const items: PostDetail[] = Array.isArray(resp.data.data)
            ? resp.data.data
            : [];
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
    <>
      <SectionCard
        icon={PenSquare}
        title={t("profilePage.myPostsTab.title")}
        subtitle={t("profilePage.myPostsTab.subtitle")}
      >
        {isLoading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("profilePage.myPostsTab.loading")}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {t("profilePage.myPostsTab.subtitle")}
            </p>
          </div>
        ) : (
          <>
            <PostList
              posts={posts}
              showActions
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            {page < totalPages && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-accent hover:text-accent disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {t("profilePage.myPostsTab.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </SectionCard>

      {confirmPost && (
        <ConfirmModal
          isOpen={Boolean(confirmPost)}
          onClose={() => setConfirmPost(null)}
          onConfirm={handleConfirmDelete}
          title={t("profilePage.myPostsTab.deleteConfirmTitle")}
          message={t("profilePage.myPostsTab.deleteConfirmMsg").replace(
            "{title}",
            confirmPost?.title || ""
          )}
          confirmText={t("profilePage.myPostsTab.deleteBtn")}
          cancelText={t("profilePage.myPostsTab.cancelBtn")}
          type="danger"
        />
      )}
    </>
  );
}
