"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, HelpCircle, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Eye, Edit3, Trash2, Tag, Calendar, Wand2, Clock, Bug, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { Pagination } from "@/components/ui/Pagination";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { PostDetail } from "@/types/post";
import { useConfirm } from "@/hooks/useConfirm";
import { useI18n } from "@/contexts/I18nContext";
import CreateQnAModal from "@/components/admin/qna/CreateQnAModal";
import GenerateQnAWithAIModal from "@/components/admin/qna/GenerateQnAWithAIModal";
import UpdateQnAModal from "@/components/admin/qna/UpdateQnAModal";
import QnAPreviewModal from "@/components/admin/qna/QnAPreviewModal";

export default function AdminQnAPage() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [solvedFilter, setSolvedFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDetail | null>(null);
  const [previewPost, setPreviewPost] = useState<PostDetail | null>(null);

  const { confirm } = useConfirm();

  const fetchCategories = async () => {
    try {
      const resp = await categoryService.getAll(CategoryType.POST);
      setCategories(resp?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await postService.getAll({
        page,
        size: pageSize,
        search: search.trim() || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
      });

      const items = resp.data?.data || [];
      setPosts(items);
      setTotalElements(resp.data?.totalElements || 0);
      setTotalPages(resp.data?.totalPages || 0);
    } catch (err) {
      console.error("Failed to fetch Q&A posts", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle post deletion
  const handleDelete = async (post: PostDetail) => {
    await confirm(
      async () => {
        try {
          await postService.delete(post.id);
          fetchPosts();
        } catch (err) {
          console.error("Failed to delete post", err);
        }
      },
      {
        title: "Xác nhận xóa bài viết",
        message: `
          <div style="text-align: center; line-height: 1.5;">
            <p style="margin-bottom: 8px;">Bạn có chắc chắn muốn xóa bài viết Q&A</p>
            <p style="font-weight: 700; color: #dc2626; font-size: 14px; margin: 8px 0; padding: 6px 12px; background: #fef2f2; border-radius: 6px; display: inline-block; max-width: 280px; word-wrap: break-word;">
              "${post.title}"
            </p>
            <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
              Hành động này không thể hoàn tác
            </p>
          </div>
        `,
        confirmText: "Xóa bài viết",
        cancelText: "Hủy bỏ",
        type: "error",
      }
    );
  };

  // Filter local for solved status if specified
  const filteredPosts = posts.filter((p) => {
    if (solvedFilter === "solved") return p.isSolved === true;
    if (solvedFilter === "unsolved") return !p.isSolved;
    return true;
  });

  // Stats calculation
  const totalSolved = posts.filter((p) => p.isSolved).length;
  const challengeCount = posts.filter(
    (p) =>
      p.title.startsWith("[Daily Challenge]") ||
      p.title.startsWith("[Fix Bug]") ||
      p.title.startsWith("[Solution]")
  ).length;
  const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);

  return (
    <div className="p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border border-border p-6 rounded-xl shadow-sm mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-accent" />
            <span>{t("admin.qna.pageTitle")}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.qna.pageSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => setIsAIModalOpen(true)}
            variant="outline"
            className="gap-2 h-9 border-accent/40 text-accent hover:bg-accent/10 shadow-xs font-medium"
          >
            <Wand2 className="h-4 w-4 text-accent" />
            <span>{t("admin.qna.btnGenerateAI")}</span>
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="accent"
            className="gap-2 h-9 shadow-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>{t("admin.qna.btnCreateManual")}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.qna.statTotal")}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{totalElements}</p>
            </div>
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.qna.statSolved")}</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalSolved}</p>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.qna.statChallenge")}</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{challengeCount}</p>
            </div>
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("admin.qna.statComments")}</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{totalComments}</p>
            </div>
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Custom Filters Bar */}
      <div className="relative z-20 rounded-xl border border-border bg-card p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("admin.qna.searchPlaceholder")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 pl-9 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
            />
          </div>

          {/* Custom Filters */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <FilterSelect
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(String(val));
                setPage(1);
              }}
              options={[
                { value: "all", label: t("admin.qna.filterAllCategory") },
                ...categories.map((c) => ({ value: c.name, label: c.name })),
              ]}
              placeholder={t("admin.categories.colCategory") + "..."}
              className="w-[180px]"
            />

            <FilterSelect
              value={solvedFilter}
              onChange={(val) => {
                setSolvedFilter(val as "all" | "solved" | "unsolved");
                setPage(1);
              }}
              options={[
                { value: "all", label: t("admin.qna.filterAllStatus") },
                { value: "solved", label: t("admin.qna.statusSolved"), icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                { value: "unsolved", label: t("admin.qna.statusUnsolved"), icon: <Clock className="w-4 h-4 text-amber-500" /> },
              ]}
              placeholder={t("admin.common.status") + "..."}
              className="w-[180px]"
            />
          </div>
        </div>
      </div>

      {/* Posts Table Container */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span>Đang tải dữ liệu bài viết...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <AlertCircle className="w-10 h-10 mx-auto text-muted-foreground/60" />
            <p className="font-semibold text-foreground">Không tìm thấy bài viết Q&A nào</p>
            <p className="text-xs">Vui lòng thay đổi từ khóa tìm kiếm hoặc tạo mới bài viết.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">{t("admin.qna.colIndex")}</th>
                  <th className="px-6 py-4">{t("admin.qna.colTitle")}</th>
                  <th className="px-6 py-4">{t("admin.qna.colCategory")}</th>
                  <th className="px-6 py-4">{t("admin.qna.colAuthor")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.qna.colStatus")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.qna.colStats")}</th>
                  <th className="px-6 py-4">{t("admin.categories.colCreatedAt")}</th>
                  <th className="px-6 py-4 text-right">{t("admin.qna.colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post, idx) => {
                  const isDaily = post.title.startsWith("[Daily Challenge]");
                  const isBug = post.title.startsWith("[Fix Bug]");
                  const isSol = post.title.startsWith("[Solution]");

                  return (
                    <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-center text-xs font-medium text-muted-foreground">
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      {/* Title & Slug */}
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isDaily && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Sparkles className="w-3 h-3 shrink-0" />
                              Daily
                            </span>
                          )}
                          {isBug && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                              <Bug className="w-3 h-3 shrink-0" />
                              Fix Bug
                            </span>
                          )}
                          {isSol && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <Lightbulb className="w-3 h-3 shrink-0" />
                              Solution
                            </span>
                          )}
                          <button
                            onClick={() => setPreviewPost(post)}
                            className="font-semibold text-foreground hover:text-accent text-left line-clamp-1 transition"
                          >
                            {post.title}
                          </button>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          {post.category?.name || "Thảo luận"}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {post.author?.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={post.author.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-[10px] flex items-center justify-center shrink-0">
                              {(post.author?.username || "A").substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-medium text-foreground">
                            {post.author?.username || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Solved Status */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {post.isSolved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã giải quyết
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" />
                            Đang mở
                          </span>
                        )}
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4 text-center whitespace-nowrap text-xs text-muted-foreground">
                        <div className="flex items-center justify-center gap-3">
                          <span className="flex items-center gap-1" title="Lượt xem">
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            {post.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1" title="Lượt bình luận">
                            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                            {post.commentCount || 0}
                          </span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {post.createdAt}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewPost(post)}
                            title="Xem trước"
                            className="p-1.5 text-muted-foreground hover:text-blue-500 rounded-lg hover:bg-muted transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPost(post)}
                            title="Chỉnh sửa"
                            className="p-1.5 text-muted-foreground hover:text-accent rounded-lg hover:bg-muted transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            title="Xóa bài viết"
                            className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        itemName="bài viết"
      />

      {/* Modals */}
      <CreateQnAModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchPosts} />
      <GenerateQnAWithAIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onSuccess={fetchPosts} />
      <UpdateQnAModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onSuccess={fetchPosts}
      />
      <QnAPreviewModal post={previewPost} isOpen={!!previewPost} onClose={() => setPreviewPost(null)} />
    </div>
  );
}
